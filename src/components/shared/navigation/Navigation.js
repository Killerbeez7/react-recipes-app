import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { doSignOut } from "../../../firebase/auth";
import cx from "classnames";

import styles from "./Navigation.module.css";

export const Navigation = (props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const logoutHandler = () => {
        doSignOut();
    };

    const handleLinkClick = () => setMenuOpen(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.brand}>
                <Link to="/" onClick={handleLinkClick}>
                    Eat & Amare
                </Link>
                <button className={styles.menuButton} onClick={toggleMenu}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>
            <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
                <li>
                    <Link to="/" onClick={handleLinkClick}>
                        Home
                    </Link>
                </li>
                <li
                    className={styles.dropdown}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <Link to="#" onClick={handleLinkClick}>
                        Recipes
                    </Link>
                    {dropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            <li>
                                <Link
                                    to="/recipes/breakfast"
                                    onClick={handleLinkClick}
                                >
                                    Breakfast & Brunch
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/lunch"
                                    onClick={handleLinkClick}
                                >
                                    Lunch
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/appetizers"
                                    onClick={handleLinkClick}
                                >
                                    Appetizers & Snacks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/dinner"
                                    onClick={handleLinkClick}
                                >
                                    Dinner
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/desserts"
                                    onClick={handleLinkClick}
                                >
                                    Dessert
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/all"
                                    onClick={handleLinkClick}
                                >
                                    See More
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/drinks"
                                    onClick={handleLinkClick}
                                >
                                    Drink & Cocktail
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/side-dish"
                                    onClick={handleLinkClick}
                                >
                                    Side Dish
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/bbq"
                                    onClick={handleLinkClick}
                                >
                                    Grilling & BBQ
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/recipes/microwave"
                                    onClick={handleLinkClick}
                                >
                                    Microwave
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/easy"
                                    onClick={handleLinkClick}
                                >
                                    Quick & Easy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/slow"
                                    onClick={handleLinkClick}
                                >
                                    Slow-Cooker
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/fryer"
                                    onClick={handleLinkClick}
                                >
                                    Air Fryer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/pot"
                                    onClick={handleLinkClick}
                                >
                                    Instant Pot
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recipes/baking"
                                    onClick={handleLinkClick}
                                >
                                    Baking
                                </Link>
                            </li>
                            <br></br>
                            <li>
                                <Link
                                    to="/recipes/all"
                                    onClick={handleLinkClick}
                                >
                                    See More
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li>
                    <Link to="/gallery" onClick={handleLinkClick}>
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link to="/forum" onClick={handleLinkClick}>
                        Forum
                    </Link>
                </li>
                <li>
                    <Link to="/about" onClick={handleLinkClick}>
                        About
                    </Link>
                </li>
                {currentUser ? (
                    <>
                        <li>
                            <Link
                                to={`/auth/${userId}/details`}
                                onClick={handleLinkClick}
                            >
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
                        <Link to="/auth/sign-in" onClick={handleLinkClick}>
                            Sign In
                        </Link>

                        <Link to="/auth/sign-up" onClick={handleLinkClick}>
                            Try It Free
                        </Link>
                    </>
                )}
            </ul>
        </nav>
    );
};
