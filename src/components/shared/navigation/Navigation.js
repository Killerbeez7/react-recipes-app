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

    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
    const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });

    useEffect(() => {
        if (!menuOpen) {
            setDropdownOpen(false);
        }
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const toggleDropdown = () => {
        if (!menuOpen) {
            setMenuOpen(true);
        }
        setDropdownOpen((prev) => !prev);
    };
    

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        const body = document.body;

        if (menuOpen) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflow = "auto";
        }

        return () => {
            body.style.overflow = "auto";
        };
    }, [menuOpen]);

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const logoutHandler = () => {
        doSignOut();
    };

    return (
        <nav className={styles.navbar}>
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
                {/* <li>
                    <Link to="/" onClick={closeMenu}>
                        Home
                    </Link>
                </li> */}
                {/* ---------------------------------------------------------------------------------*/}
                <li
                    // className={styles.dropdown}
                    className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""}`}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <Link to="#" className={styles.dropdownToggle} onClick={toggleDropdown}>
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
        </nav>
    );
};
