/**
 * ARCHIVED – not currently used in the app.
 *
 * Command-palette style search: a centred dialog opened with ⌘K / Ctrl+K or
 * "/", with arrow-key navigation, popular recipes and category shortcuts.
 * It was replaced by the simpler inline header search (../Search.js).
 *
 * To bring it back, render <CommandPalette /> in Navigation.js in place of
 * <Search />. Matching/highlighting logic is shared via ../searchUtils.js.
 */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Clock,
    CornerDownLeft,
    Search as SearchIcon,
    SearchX,
} from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { CATEGORIES } from "../../../constants/categories";
import { RecipeImage } from "../../ui/RecipeImage";
import { Highlight, searchRecipes } from "../searchUtils";

const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);

const Kbd = ({ children }) => (
    <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-neutral-300 bg-white px-1 font-sans text-[11px] font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
        {children}
    </kbd>
);

const SearchDialog = ({ onClose }) => {
    const { recipes } = useContext(RecipeContext);
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const listRef = useRef(null);

    const term = query.trim().toLowerCase();

    const results = useMemo(
        () =>
            term
                ? searchRecipes(recipes, term)
                : [...recipes]
                      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
                      .slice(0, 5),
        [recipes, term]
    );

    useEffect(() => setActive(0), [term]);

    // Lock page scroll while open
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    }, []);

    // Keep the highlighted result in view
    useEffect(() => {
        listRef.current
            ?.querySelector(`[data-index="${active}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }, [active]);

    const open = (recipe) => {
        navigate(`/recipes/details/${recipe.id}`);
        onClose();
    };

    const onKeyDown = (e) => {
        if (e.key === "Escape") onClose();
        if (!results.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (i + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => (i - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            open(results[active]);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-[12vh]"
            role="presentation"
        >
            <div
                className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Search recipes"
                className="card relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden shadow-2xl"
            >
                <div className="flex items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-800">
                    <SearchIcon
                        className="h-5 w-5 shrink-0 text-neutral-400"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="search-results"
                        aria-activedescendant={
                            results.length
                                ? `search-result-${active}`
                                : undefined
                        }
                        autoComplete="off"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Search recipes, cuisines, categories..."
                        className="h-14 w-full border-0 bg-transparent p-0 text-base text-neutral-900 placeholder:text-neutral-400 focus:ring-0 dark:text-neutral-100"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="hidden shrink-0 sm:block"
                        aria-label="Close search"
                    >
                        <Kbd>Esc</Kbd>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="link shrink-0 text-sm sm:hidden"
                    >
                        Cancel
                    </button>
                </div>

                <div className="overflow-y-auto overscroll-contain">
                    {results.length > 0 ? (
                        <>
                            <p className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                {term ? "Recipes" : "Popular recipes"}
                            </p>
                            <ul
                                id="search-results"
                                role="listbox"
                                ref={listRef}
                                className="px-2 pb-2"
                            >
                                {results.map((recipe, index) => (
                                    <li
                                        key={recipe.id}
                                        id={`search-result-${index}`}
                                        data-index={index}
                                        role="option"
                                        aria-selected={index === active}
                                        onMouseMove={() => setActive(index)}
                                        onClick={() => open(recipe)}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 ${
                                            index === active
                                                ? "bg-neutral-100 dark:bg-neutral-800"
                                                : ""
                                        }`}
                                    >
                                        <RecipeImage
                                            src={recipe.imageUrl}
                                            alt=""
                                            className="h-12 w-12 shrink-0 rounded-md"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-neutral-900 first-letter:uppercase dark:text-neutral-100">
                                                <Highlight
                                                    text={recipe.title}
                                                    term={term}
                                                />
                                            </p>
                                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                <Highlight
                                                    text={recipe.description}
                                                    term={term}
                                                />
                                            </p>
                                        </div>
                                        {recipe.timeToCook && (
                                            <span className="hidden shrink-0 items-center gap-1 text-xs text-neutral-500 sm:inline-flex dark:text-neutral-400">
                                                <Clock className="h-3.5 w-3.5" />{" "}
                                                {recipe.timeToCook} min
                                            </span>
                                        )}
                                        <CornerDownLeft
                                            className={`h-4 w-4 shrink-0 text-neutral-400 ${index === active ? "visible" : "invisible"}`}
                                            aria-hidden="true"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div className="flex flex-col items-center px-6 py-12 text-center">
                            <SearchX
                                className="h-8 w-8 text-neutral-400"
                                aria-hidden="true"
                            />
                            <p className="mt-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                No recipes match “{query.trim()}”
                            </p>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Try another word or browse a category.
                            </p>
                        </div>
                    )}

                    {!term && (
                        <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
                            <p className="pb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Categories
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.slice(0, 8).map(
                                    ({ slug, label }) => (
                                        <Link
                                            key={slug}
                                            to={`/recipes/${slug}`}
                                            onClick={onClose}
                                            className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
                                        >
                                            {label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                    <span className="hidden items-center gap-3 sm:flex">
                        <span className="flex items-center gap-1">
                            <Kbd>↑</Kbd>
                            <Kbd>↓</Kbd> navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <Kbd>↵</Kbd> open
                        </span>
                    </span>
                    <Link
                        to="/recipes/all"
                        onClick={onClose}
                        className="link ml-auto inline-flex items-center gap-1 text-xs"
                    >
                        Browse all recipes{" "}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => setIsOpen(false), [pathname]);

    // ⌘K / Ctrl+K, or "/" when not typing, opens search
    useEffect(() => {
        const onKeyDown = (e) => {
            const typing =
                /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) ||
                e.target.isContentEditable;
            if (
                (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
                (e.key === "/" && !typing)
            ) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <>
            {/* Wide screens: search field look-alike with shortcut hint */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="hidden h-10 w-56 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 xl:flex"
            >
                <SearchIcon className="h-4 w-4" aria-hidden="true" />
                <span className="flex-1 text-left">Search recipes...</span>
                <span className="flex gap-0.5">
                    <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                    <Kbd>K</Kbd>
                </span>
            </button>

            {/* Smaller screens: icon button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="btn-icon xl:hidden"
                aria-label="Search recipes"
            >
                <SearchIcon className="h-5 w-5" />
            </button>

            {isOpen && <SearchDialog onClose={() => setIsOpen(false)} />}
        </>
    );
};
