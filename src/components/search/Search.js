import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { RecipeContext } from "../../contexts/RecipeContext";
import { RecipeImage } from "../ui/RecipeImage";
import { Highlight, searchRecipes } from "./searchUtils";

const Results = ({ results, term, onSelect }) => {
    if (!results.length) {
        return (
            <p className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                No recipes match “{term}”.
            </p>
        );
    }

    return (
        <ul className="p-2">
            {results.map((recipe) => (
                <li key={recipe.id}>
                    <button
                        type="button"
                        onClick={() => onSelect(recipe)}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        <RecipeImage
                            src={recipe.imageUrl}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-md"
                        />
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-neutral-900 first-letter:uppercase dark:text-neutral-100">
                                <Highlight text={recipe.title} term={term} />
                            </span>
                            <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                                {recipe.description}
                            </span>
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
};

export const Search = () => {
    const { recipes } = useContext(RecipeContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const containerRef = useRef(null);

    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const term = query.trim().toLowerCase();
    const results = term ? searchRecipes(recipes, term, 6) : [];

    const close = () => {
        setQuery("");
        setShowResults(false);
        setMobileOpen(false);
    };

    // Reset after navigating anywhere
    useEffect(() => {
        setQuery("");
        setShowResults(false);
        setMobileOpen(false);
    }, [pathname]);

    // Desktop: hide results when clicking elsewhere
    useEffect(() => {
        const onMouseDown = (e) => {
            if (!containerRef.current?.contains(e.target))
                setShowResults(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, []);

    const open = (recipe) => {
        navigate(`/recipes/details/${recipe.id}`);
        close();
    };

    const inputProps = {
        type: "search",
        value: query,
        placeholder: "Search recipes...",
        "aria-label": "Search recipes",
        autoComplete: "off",
        onChange: (e) => {
            setQuery(e.target.value);
            setShowResults(true);
        },
        onFocus: () => setShowResults(true),
        onKeyDown: (e) => {
            if (e.key === "Enter" && results[0]) open(results[0]);
            if (e.key === "Escape") close();
        },
    };

    return (
        <>
            {/* Desktop: always-visible search field */}
            <div ref={containerRef} className="relative hidden lg:block">
                <SearchIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    aria-hidden="true"
                />
                <input
                    {...inputProps}
                    className="h-10 w-44 rounded-full border-transparent bg-neutral-100 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-500 focus:bg-white focus:ring-brand-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:bg-neutral-950 xl:w-64"
                />
                {showResults && term && (
                    <div className="card absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden">
                        <Results
                            results={results}
                            term={term}
                            onSelect={open}
                        />
                    </div>
                )}
            </div>

            {/* Mobile & tablet: icon that reveals a search bar under the header */}
            <button
                type="button"
                className="btn-icon lg:hidden"
                onClick={() => (mobileOpen ? close() : setMobileOpen(true))}
                aria-label={mobileOpen ? "Close search" : "Search recipes"}
                aria-expanded={mobileOpen}
            >
                {mobileOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <SearchIcon className="h-5 w-5" />
                )}
            </button>

            {mobileOpen &&
                // Portal: the header's backdrop-filter would trap position:fixed
                createPortal(
                    <div className="fixed inset-x-0 bottom-0 top-16 z-40 lg:hidden">
                        <div
                            className="absolute inset-0 bg-neutral-950/40"
                            onClick={close}
                            aria-hidden="true"
                        />
                        <div className="relative border-b border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                            <div className="container py-3">
                                <div className="relative">
                                    <SearchIcon
                                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        {...inputProps}
                                        autoFocus
                                        className="input rounded-full pl-10"
                                    />
                                </div>
                            </div>
                            {term && (
                                <div className="container max-h-[60vh] overflow-y-auto border-t border-neutral-200 px-2 dark:border-neutral-800">
                                    <Results
                                        results={results}
                                        term={term}
                                        onSelect={open}
                                    />
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};
