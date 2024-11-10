import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { doSignOut } from "../../../firebase/auth";
import cx from "classnames";

import styles from "./Navigation.module.css";

export const Navigation = (props) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
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
                    <Link to="/recipes" onClick={handleLinkClick}>
                        Recipes
                    </Link>
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
