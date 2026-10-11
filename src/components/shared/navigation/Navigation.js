import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bookmark, ChevronDown, Menu, Plus, User, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { CATEGORIES, SEASONS, NEWS } from "../../../constants/categories";
import { Search } from "../../search/Search";
import { Avatar } from "../../ui/Avatar";
import { Logo } from "../../ui/Logo";

const menus = [
    {
        id: "recipes",
        label: "Recipes",
        wide: true,
        items: CATEGORIES.map(({ slug, label }) => ({
            path: `/recipes/${slug}`,
            label,
        })),
        footer: { path: "/recipes/all", label: "View all recipes" },
    },
    {
        id: "seasonal",
        label: "Seasonal",
        items: SEASONS.map(({ slug, label }) => ({
            path: `/recipes/seasonal/${slug}`,
            label,
        })),
    },
    { id: "news", label: "News", items: NEWS },
];

const links = [
    { path: "/gallery", label: "Gallery" },
    { path: "/forum", label: "Forum" },
];

const topLinkClass =
    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-neutral-700 transition-colors hover:text-brand-600 dark:text-neutral-300 dark:hover:text-brand-400";

export const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null);

    const location = useLocation();
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    // Close the mobile menu on navigation
    useEffect(() => {
        setMenuOpen(false);
        setOpenSection(null);
        // Drop focus so the desktop dropdown (opened via :focus-within) closes
        document.activeElement?.blur();
    }, [location.pathname]);

    // Lock page scroll while the mobile menu is open
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", menuOpen);
        return () => document.body.classList.remove("overflow-hidden");
    }, [menuOpen]);

    // Close the mobile menu if the viewport grows to desktop size
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const onChange = (e) => e.matches && setMenuOpen(false);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const toggleSection = (id) =>
        setOpenSection((prev) => (prev === id ? null : id));

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-neutral-800 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/75 print:hidden">
                <nav className="container flex h-16 items-center justify-between gap-4">
                    {/* Left: burger + logo */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="btn-icon -ml-2 lg:hidden"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            {menuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                        <Logo className="text-xl sm:text-2xl" />
                    </div>

                    {/* Center: desktop links */}
                    <ul className="hidden items-center gap-1 lg:flex">
                        {menus.map((menu) => (
                            <li key={menu.id} className="group relative">
                                <button
                                    type="button"
                                    className={topLinkClass}
                                    aria-haspopup="true"
                                >
                                    {menu.label}
                                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                                </button>
                                {/* pt-2 bridges the gap so the menu doesn't close while moving the mouse */}
                                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                                    <div
                                        className={`card overflow-hidden p-2 ${
                                            menu.wide ? "w-[30rem]" : "w-56"
                                        }`}
                                    >
                                        <ul
                                            className={
                                                menu.wide
                                                    ? "grid grid-cols-2 gap-0.5"
                                                    : "space-y-0.5"
                                            }
                                        >
                                            {menu.items.map(
                                                ({ path, label }) => (
                                                    <li key={path}>
                                                        <NavLink
                                                            to={path}
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                `block rounded-md px-3 py-2 text-sm transition-colors ${
                                                                    isActive
                                                                        ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                                                                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                                                }`
                                                            }
                                                        >
                                                            {label}
                                                        </NavLink>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                        {menu.footer && (
                                            <Link
                                                to={menu.footer.path}
                                                className="mt-2 block rounded-md border-t border-neutral-200 px-3 pb-1 pt-3 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:border-neutral-800 dark:text-brand-400"
                                            >
                                                {menu.footer.label} →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                        {links.map(({ path, label }) => (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) =>
                                        `${topLinkClass} ${isActive ? "text-brand-600 dark:text-brand-400" : ""}`
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Right: one wide search field, then matching 40px circles */}
                    <div className="flex items-center gap-1 lg:gap-3">
                        <Search />
                        {currentUser ? (
                            <>
                                <Link
                                    to={`/recipes/saved-recipes/${userId}`}
                                    className="btn-icon hidden sm:inline-flex"
                                    aria-label="Saved recipes"
                                    title="Saved recipes"
                                >
                                    <Bookmark className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/recipes/add"
                                    className="btn-primary mx-1 hidden h-10 w-10 rounded-full p-0 sm:inline-flex lg:mx-0"
                                    aria-label="Add recipe"
                                    title="Add recipe"
                                >
                                    <Plus className="h-5 w-5" />
                                </Link>
                                <Link
                                    to={`/auth/${userId}/account-management`}
                                    className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 lg:ml-0 lg:flex"
                                    aria-label="My account"
                                    title="My account"
                                >
                                    <Avatar
                                        src={currentUser.photoURL}
                                        name={
                                            currentUser.displayName ||
                                            currentUser.email
                                        }
                                        size="sm"
                                        className="lg:h-10 lg:w-10"
                                    />
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/auth/sign-in"
                                state={{ from: location.pathname }}
                                className="btn-primary ml-1 px-3 py-2 lg:ml-0 lg:h-10 lg:rounded-full lg:px-4"
                            >
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Sign in
                                </span>
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* Mobile menu (outside <header>: backdrop-filter would trap position:fixed) */}
            {menuOpen && (
                <div
                    id="mobile-menu"
                    className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto overscroll-contain border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:hidden"
                >
                    <ul className="container divide-y divide-neutral-200 py-2 dark:divide-neutral-800">
                        {/* On phones these live here instead of the header */}
                        {currentUser && (
                            <li className="flex gap-3 py-4 sm:hidden">
                                <Link
                                    to="/recipes/add"
                                    className="btn-primary flex-1"
                                >
                                    <Plus className="h-4 w-4" /> Add recipe
                                </Link>
                                <Link
                                    to={`/recipes/saved-recipes/${userId}`}
                                    className="btn-secondary flex-1"
                                >
                                    <Bookmark className="h-4 w-4" /> Saved
                                </Link>
                            </li>
                        )}
                        {menus.map((menu) => {
                            const isOpen = openSection === menu.id;
                            return (
                                <li key={menu.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(menu.id)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-neutral-900 dark:text-neutral-100"
                                    >
                                        {menu.label}
                                        <ChevronDown
                                            className={`h-5 w-5 text-neutral-500 transition-transform ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <ul className="grid gap-1 pb-4 sm:grid-cols-2">
                                            {[
                                                ...menu.items,
                                                ...(menu.footer
                                                    ? [menu.footer]
                                                    : []),
                                            ].map(({ path, label }) => (
                                                <li key={path}>
                                                    <Link
                                                        to={path}
                                                        className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                    >
                                                        {label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                        {links.map(({ path, label }) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className="block py-4 text-base font-medium text-neutral-900 dark:text-neutral-100"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};
