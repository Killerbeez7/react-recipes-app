import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { RecipeImage } from "../../ui/RecipeImage";

export const LiveSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { recipes } = useContext(RecipeContext);
    const containerRef = useRef(null);

    useEffect(() => {
        const term = query.trim().toLowerCase();
        if (!term) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            setResults(
                recipes
                    .filter((recipe) =>
                        recipe.title?.toLowerCase().includes(term)
                    )
                    .slice(0, 8)
            );
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [query, recipes]);

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const onClick = (e) => {
            if (!containerRef.current?.contains(e.target)) {
                setIsOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [isOpen]);

    const close = () => {
        setIsOpen(false);
        setQuery("");
    };

    const handleSelect = (id) => {
        navigate(`/recipes/details/${id}`);
        close();
    };

    const onKeyDown = (e) => {
        if (e.key === "Escape") close();
        if (e.key === "Enter" && results[0]) handleSelect(results[0].id);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                className="btn-icon"
                onClick={() => (isOpen ? close() : setIsOpen(true))}
                aria-label={isOpen ? "Close search" : "Search recipes"}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Search className="h-5 w-5" />
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-x-4 top-[4.5rem] z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
                    <div className="card overflow-hidden">
                        <div className="relative border-b border-neutral-200 dark:border-neutral-800">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Search recipes..."
                                aria-label="Search recipes"
                                className="w-full border-0 bg-transparent py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-0 dark:text-neutral-100"
                                autoFocus
                            />
                        </div>

                        {query.trim() && (
                            <ul className="max-h-96 overflow-y-auto p-2">
                                {results.length === 0 ? (
                                    <li className="px-3 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                        No recipes match “{query.trim()}”.
                                    </li>
                                ) : (
                                    results.map((recipe) => (
                                        <li key={recipe.id}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSelect(recipe.id)
                                                }
                                                className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                            >
                                                <RecipeImage
                                                    src={recipe.imageUrl}
                                                    alt=""
                                                    className="h-12 w-12 shrink-0 rounded-md"
                                                />
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                        {recipe.title}
                                                    </span>
                                                    <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                        {recipe.description}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
