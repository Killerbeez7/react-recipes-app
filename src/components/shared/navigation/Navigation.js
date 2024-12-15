import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { doSignOut } from "../../../firebase/auth";
import { useMediaQuery } from "react-responsive";

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
    // { path: "/recipes/all", label: "All Recipes" },
];

const seasons = [
    { path: "/recipes/seasonal/spring", label: "Spring" },
    { path: "/recipes/seasonal/summer", label: "Summer" },
    { path: "/recipes/seasonal/fall", label: "Fall" },
    { path: "/recipes/seasonal/winter", label: "Winter" },
];

export const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [recipesOpen, setRecipesOpen] = useState(false);
    const [seasonalOpen, setSeasonalOpen] = useState(false);

    const isDesktop = useMediaQuery({ query: "(min-width: 1210px)" });
    // const isTablet = useMediaQuery({ query: "(max-width: 1023px)" });
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    useEffect(() => {
        if (!menuOpen) {
            setRecipesOpen(false);
        }
    }, [menuOpen]);

    useEffect(() => {
        const body = document.body;

        const handleResize = () => {
            if (menuOpen && isMobile) {
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

    useEffect(() => {
        if (isDesktop) {
            closeMenu();
        }
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // recipes
    const toggleRecipesDropdown = () => {
        setRecipesOpen((prev) => !prev);
    };
    // seasonal
    const toggleSeasonalDropdown = () => {
        setSeasonalOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setRecipesOpen(false);
        setSeasonalOpen(false);
    };

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const logoutHandler = () => {
        doSignOut();
    };

    return (
        <div id="header-wrap" className={styles["view-nav"]}>
            {/* <header> */}
            <div className={styles.brand}>
                <div className={styles["nav-icons"]}>
                    <button className={styles.menuButton} onClick={toggleMenu}>
                        {menuOpen ? (
                            <i className="fa-solid fa-xmark"></i>
                        ) : (
                            <i className="fa-solid fa-bars"></i>
                        )}
                    </button>
                    <Link to="/" className={styles.logo} onClick={closeMenu}>
                        <span style={{ color: "#ffd700" }}>Eat</span>
                        <span style={{ color: "gray" }}> & </span>
                        <span style={{ color: "red" }}>Amare</span>
                    </Link>
                </div>
            </div>
            <ul className={`${styles.navLinks} ${styles.hideLinks} ${menuOpen ? styles.open : ""}`}>
                {/* -------------------------------------------------------------------------- Recipes --------------------------------------------------------------------- */}
                <li
                    className={`${styles.dropdown} ${recipesOpen ? styles.recipesOpen : ""}`}
                    {...(isDesktop && {
                        onMouseEnter: () => setRecipesOpen(true),
                        onMouseLeave: () => setRecipesOpen(false),
                    })}
                >
                    <Link
                        to="#"
                        className={styles.dropdownToggle}
                        onClick={(e) => (isDesktop ? e.preventDefault() : toggleRecipesDropdown())}
                    >
                        {" "}
                        Recipes{" "}
                        {menuOpen && (
                            <i
                                className={`fa-solid ${
                                    recipesOpen ? "fa-chevron-up" : "fa-chevron-down"
                                }`}
                            ></i>
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
                                <Link to="/recipes/all" >See more</Link>
                                {/* <i className="fa-solid fa-list"></i> All Recipes */}
                            </li>
                        </ul>
                    )}
                </li>
                {/* -------------------------------------------------------------------------- Seasonal --------------------------------------------------------------------- */}
                <li
                    className={`${styles.dropdown} ${seasonalOpen ? styles.seasonalOpen : ""}`}
                    {...(isDesktop && {
                        onMouseEnter: () => setSeasonalOpen(true),
                        onMouseLeave: () => setSeasonalOpen(false),
                    })}
                >
                    <Link
                        to="#"
                        className={styles.dropdownToggle}
                        onClick={(e) => (isDesktop ? e.preventDefault() : toggleSeasonalDropdown())}
                    >
                        {" "}
                        Seasonal{" "}
                        {menuOpen && (
                            <i
                                className={`fa-solid ${
                                    seasonalOpen ? "fa-chevron-up" : "fa-chevron-down"
                                }`}
                            ></i>
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
                {/* ------------------------------------------------------------------------------------------------------------------------------------------------------- */}
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
                    {currentUser ? (
                        <>
                            <li>
                                <Link to={`/auth/${userId}/details`} onClick={closeMenu}>
                                    <i class="fa-regular fa-user" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/" onClick={logoutHandler}>
                                    <i class="fa-solid fa-arrow-right-from-bracket" />
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/auth/sign-in" onClick={closeMenu}>
                                    Sign In
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            {/* </header> */}
        </div>
    );
};
