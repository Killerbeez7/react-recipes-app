import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

// LIVE SEARCH NEW ----------------------------------------
import { LiveSearch } from "../../search/live-search/LiveSearch";
// LIVE SEARCH NEW ----------------------------------------

import styles from "./Navigation.module.css";

const categories = [
    { path: "/recipes/breakfast", label: "Breakfast & Brunch" },
    { path: "/recipes/lunch", label: "Lunch" },
    { path: "/recipes/appetizers", label: "Appetizers & Snacks" },
    { path: "/recipes/dinner", label: "Dinner" },
    { path: "/recipes/desserts", label: "Dessert" },
    { path: "/recipes/drinks", label: "Drink & Cocktail" },
    { path: "/recipes/side-dish", label: "Side Dish" },
    { path: "/recipes/grilling", label: "Grilling & BBQ" },
    { path: "/recipes/microwave", label: "Microwave" },
    { path: "/recipes/easy", label: "Quick & Easy" },
    { path: "/recipes/slow", label: "Slow-Cooker" },
    { path: "/recipes/fryer", label: "Air Fryer" },
    { path: "/recipes/instant-pot", label: "Instant Pot" },
    { path: "/recipes/baking", label: "Baking" },
    { path: "/recipes/vegetarian", label: "Vegetarian" },
];

const seasons = [
    { path: "/recipes/seasonal/spring", label: "Spring" },
    { path: "/recipes/seasonal/summer", label: "Summer" },
    { path: "/recipes/seasonal/fall", label: "Fall" },
    { path: "/recipes/seasonal/winter", label: "Winter" },
];

const news = [
    { path: "/news/food-and-nutrition", label: "Food & Nutrition News" },
    { path: "/news/food-culture-and-travel", label: "Food Culture & Travel" },
    { path: "/news/cooking-tips-and-tricks", label: "Cooking Tips & Tricks" },
    {
        path: "/news/interviews-and-spotlights",
        label: "Interviews & Spotlights",
    },
];

export const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [recipesOpen, setRecipesOpen] = useState(false);
    const [seasonalOpen, setSeasonalOpen] = useState(false);
    const [newsOpen, setNewsOpen] = useState(false);

    const location = useLocation();
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const isDesktop = useMediaQuery({ query: "(min-width: 1210px)" });
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    // Close submenus when main menu closes
    useEffect(() => {
        if (!menuOpen) {
            setRecipesOpen(false);
            setSeasonalOpen(false);
            setNewsOpen(false);
        }
    }, [menuOpen]);

    // Handle locking the body scroll on mobile
    useEffect(() => {
        const body = document.body;

        const handleResize = () => {
            if (menuOpen && !isDesktop) {
                body.classList.add(styles.mobile);
            } else if (menuOpen && isDesktop) {
                body.classList.remove(styles.mobile);
                closeMenu();
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            body.classList.remove(styles.mobile);
            window.removeEventListener("resize", handleResize);
        };
    }, [menuOpen, isMobile, isDesktop]);

    // Auto-close menu if toggled while on desktop
    useEffect(() => {
        if (isDesktop) {
            closeMenu();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuOpen]);

    // Toggles
    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const toggleRecipesDropdown = () => setRecipesOpen((prev) => !prev);
    const toggleSeasonalDropdown = () => setSeasonalOpen((prev) => !prev);
    const toggleNewsDropdown = () => setNewsOpen((prev) => !prev);

    // Close all menus
    const closeMenu = () => {
        setMenuOpen(false);
        setRecipesOpen(false);
        setSeasonalOpen(false);
        setNewsOpen(false);
    };

    return (
        <div id="header-wrap" className={styles["view-nav"]}>
            <div className={styles.brand}>
                <div className={styles["nav-icons"]}>
                    <button className={styles.menuButton} onClick={toggleMenu}>
                        {menuOpen ? (
                            <i class="fa-solid fa-x" />
                        ) : (
                            <i className="fa-solid fa-bars" />
                        )}
                    </button>
                    <Link to="/" className={styles.logo} onClick={closeMenu}>
                        <span className={styles["logo-eat"]}>I </span>
                        <span className={styles["logo-and"]}>
                            <i class="fa-solid fa-heart" />
                        </span>
                        <span className={styles["logo-amare"]}> Food</span>
                    </Link>
                </div>
            </div>

            {/* Main Nav Links */}
            <ul
                className={`${styles.navLinks} ${styles.hideLinks} ${
                    menuOpen ? styles.open : ""
                }`}
            >
                {/* Recipes Dropdown */}
                <li
                    className={`${styles.dropdown} ${
                        recipesOpen ? styles.recipesOpen : ""
                    }`}
                    {...(isDesktop && {
                        onMouseEnter: () => setRecipesOpen(true),
                        onMouseLeave: () => setRecipesOpen(false),
                    })}
                >
                    <Link
                        to="#"
                        className={styles.dropdownToggle}
                        onClick={(e) =>
                            isDesktop
                                ? e.preventDefault()
                                : toggleRecipesDropdown()
                        }
                    >
                        Recipes{" "}
                        {menuOpen && (
                            <i
                                className={`fa-solid ${
                                    recipesOpen
                                        ? "fa-chevron-up"
                                        : "fa-chevron-down"
                                }`}
                            />
                        )}
                    </Link>
                    {recipesOpen && (
                        <ul
                            className={`${styles.recipesDropdown} ${
                                recipesOpen ? styles.open : ""
                            }`}
                        >
                            {categories.map(({ path, label }) => (
                                <li key={path}>
                                    <Link to={path} onClick={closeMenu}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            <li className={styles["all-recipes-button"]}>
                                <Link to="/recipes/all" onClick={closeMenu}>
                                    VIEW ALL
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* Seasonal Dropdown */}
                <li
                    className={`${styles.dropdown} ${
                        seasonalOpen ? styles.seasonalOpen : ""
                    }`}
                    {...(isDesktop && {
                        onMouseEnter: () => setSeasonalOpen(true),
                        onMouseLeave: () => setSeasonalOpen(false),
                    })}
                >
                    <Link
                        to="#"
                        className={styles.dropdownToggle}
                        onClick={(e) =>
                            isDesktop
                                ? e.preventDefault()
                                : toggleSeasonalDropdown()
                        }
                    >
                        Seasonal{" "}
                        {menuOpen && (
                            <i
                                className={`fa-solid ${
                                    seasonalOpen
                                        ? "fa-chevron-up"
                                        : "fa-chevron-down"
                                }`}
                            />
                        )}
                    </Link>
                    {seasonalOpen && (
                        <ul
                            className={`${styles.seasonalDropdown} ${
                                seasonalOpen ? styles.open : ""
                            }`}
                        >
                            {seasons.map(({ path, label }) => (
                                <li key={path}>
                                    <Link to={path} onClick={closeMenu}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                {/* News Dropdown */}
                <li
                    className={`${styles.dropdown} ${
                        newsOpen ? styles.newsOpen : ""
                    }`}
                    {...(isDesktop && {
                        onMouseEnter: () => setNewsOpen(true),
                        onMouseLeave: () => setNewsOpen(false),
                    })}
                >
                    <Link
                        to="#"
                        className={styles.dropdownToggle}
                        onClick={(e) =>
                            isDesktop
                                ? e.preventDefault()
                                : toggleNewsDropdown()
                        }
                    >
                        News{" "}
                        {menuOpen && (
                            <i
                                className={`fa-solid ${
                                    newsOpen
                                        ? "fa-chevron-up"
                                        : "fa-chevron-down"
                                }`}
                            />
                        )}
                    </Link>
                    {newsOpen && (
                        <ul
                            className={`${styles.newsDropdown} ${
                                newsOpen ? styles.open : ""
                            }`}
                        >
                            {news.map(({ path, label }) => (
                                <li key={path}>
                                    <Link to={path} onClick={closeMenu}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
                {/* Other links */}
                <li>
                    <Link to="/gallery" onClick={closeMenu}>
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link to="/forum" onClick={closeMenu}>
                        Forum
                    </Link>
                </li>
            </ul>
            <div className={styles["auth-icons"]}>
                <ul className={styles.navLinks}>
                    <li className={styles.searchContainer}>
                        <LiveSearch />
                    </li>
                    {currentUser ? (
                        <>
                            <li>
                                <Link
                                    to={`/recipes/saved-recipes/${userId}`}
                                    onClick={closeMenu}
                                >
                                    <i class="fa-solid fa-bookmark"/>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/auth/${userId}/account-management`}
                                    onClick={closeMenu}
                                >
                                    <i className="fa-solid fa-user" />
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={styles["sign-in-box"]}>
                                <Link
                                    to="/auth/sign-in"
                                    onClick={closeMenu}
                                    state={{ from: location.pathname }}
                                >
                                    <i className="fa-solid fa-user" />
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};
