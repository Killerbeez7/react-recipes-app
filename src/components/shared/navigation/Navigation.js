import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { doSignOut } from "../../../firebase/auth";

import styles from "./Navigation.module.css";

export const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const toggleDropMenu = () => {
        setDropdownOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
    };

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
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
                <li>
                    <Link to="/" onClick={closeMenu}>
                        Home
                    </Link>
                </li>
                <li
                    className={styles.dropdown}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <Link to="#">Recipes {menuOpen && <i class="fa-solid fa-arrow-down" />}</Link>
                    {dropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            <li>
                                <Link to="/recipes/breakfast" onClick={closeMenu}>
                                    Breakfast & Brunch
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/lunch" onClick={closeMenu}>
                                    Lunch
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/appetizers" onClick={closeMenu}>
                                    Appetizers & Snacks
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/dinner" onClick={closeMenu}>
                                    Dinner
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/desserts" onClick={closeMenu}>
                                    Dessert
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/drinks" onClick={closeMenu}>
                                    Drink & Cocktail
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/side-dish" onClick={closeMenu}>
                                    Side Dish
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/grilling" onClick={closeMenu}>
                                    Grilling & BBQ
                                </Link>
                            </li>

                            <li>
                                <Link to="/recipes/microwave" onClick={closeMenu}>
                                    Microwave
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/easy" onClick={closeMenu}>
                                    Quick & Easy
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/slow" onClick={closeMenu}>
                                    Slow-Cooker
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/fryer" onClick={closeMenu}>
                                    Air Fryer
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/instant-pot" onClick={closeMenu}>
                                    Instant Pot
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/baking" onClick={closeMenu}>
                                    Baking
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipes/vegetarian" onClick={closeMenu}>
                                    Vegetarian
                                </Link>
                            </li>
                            <br></br>
                            <li>
                                <Link to="/recipes/all" onClick={closeMenu}>
                                    All Recipes
                                </Link>
                            </li>
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
