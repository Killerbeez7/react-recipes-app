import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { doSignOut } from "../../../firebase/auth";
import cx from "classnames"

import styles from "./Navigation.module.css";

export const Navigation = (props) => {
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const logoutHandler = () => {
        doSignOut();
    };


    return (
        <div className={styles["main"]}>
            {/* Left-side links */}
            <div className={styles["left-side"]}>
                <div   className={cx(
                            styles["nav-link-wrapper"],
                            styles["site-logo"]
                        )}>
                    <NavLink to="/">
                        Eat & Amare
                    </NavLink>
                </div>
                <div className={styles["nav-link-wrapper"]}>
                    <NavLink to="/recipes/list">
                        Recipes
                    </NavLink>
                </div>
                <div className={styles["nav-link-wrapper"]}>
                    <NavLink to="/gallery">
                        Gallery
                    </NavLink>
                </div>
                <div className={styles["nav-link-wrapper"]}>
                    <NavLink to="/forum">
                        Forum
                    </NavLink>
                </div>
                <div className={styles["nav-link-wrapper"]}>
                    <NavLink to="/about">
                        About
                    </NavLink>
                </div>
            </div>

            {/* Right-side links */}
            <div className={styles["right-side"]}>
                {currentUser ? (
                    <>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink
                                to={`/auth/${userId}/details`}
                            >
                                {currentUser?.displayName || currentUser?.email}
                            </NavLink>
                        </div>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink to="/" onClick={logoutHandler}>
                                Logout
                            </NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink to="/auth/sign-in">
                                Sign In
                            </NavLink>
                        </div>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink to="/auth/sign-up">
                                Try It Free
                            </NavLink>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
