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
    { path: "/recipes/all", label: "All Recipes" },
];

export const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isDesktop = useMediaQuery({ query: "(min-width: 1210px)" });
    const isTablet = useMediaQuery({ query: "(max-width: 1023px)" });
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    useEffect(() => {
        if (!menuOpen) {
            setDropdownOpen(false);
        }
    }, [menuOpen]);

    useEffect(() => {
        const body = document.body;

        const handleResize = () => {
            if (menuOpen && isMobile) {
                body.classList.add(styles.mobile);
            } else if (menuOpen && isDesktop) {
                body.classList.remove(styles.mobile);
                closeMenu()
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

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
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
                <Link to="/" onClick={closeMenu}>
                    Eat & Amare
                </Link>
                <button className={styles.menuButton} onClick={toggleMenu}>
                    {menuOpen ? (
                        <i className="fa-solid fa-xmark"></i>
                    ) : (
                        <i className="fa-solid fa-bars"></i>
                    )}
                </button>
            </div>
            <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
                <li
                    className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""}`}
                    {...(isDesktop && {
                        onMouseEnter: () => setDropdownOpen(true),
                        onMouseLeave: () => setDropdownOpen(false),
                    })}
                >
                    <Link
                        to="#"
                        className={styles.dropdownToggle}
                        onClick={(e) => (isDesktop ? e.preventDefault() : toggleDropdown())}
                    >
                        {" "}
                        Recipes{" "}
                        {menuOpen && (
                            <i
                                className={`fa-solid ${
                                    dropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                                }`}
                            ></i>
                        )}
                    </Link>
                    {dropdownOpen && (
                        <ul className={`${styles.dropdownMenu} ${dropdownOpen ? styles.open : ""}`}>
                            {categories.map(({ path, label }) => (
                                <li key={path}>
                                    <Link to={path} onClick={closeMenu}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
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
                {currentUser ? (
                    <>
                        <li>
                            <Link to={`/auth/${userId}/details`} onClick={closeMenu}>
                                {currentUser?.displayName || currentUser?.email}
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={logoutHandler}>
                                Logout
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
                        <li>
                            <Link to="/auth/sign-up" onClick={closeMenu}>
                                Try It Free
                            </Link>
                        </li>
                    </>
                )}
            </ul>
            {/* </header> */}
        </div>
    );
};
