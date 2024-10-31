import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { doSignOut } from "../../../firebase/auth";

import styles from "./Navigation.module.css";


export const Navigation = (props) => {
    const { currentUser, username } = useAuth()
    const navigate = useNavigate();

    const userId = currentUser?.uid;

    const logoutHandler = () => {
        doSignOut()
        navigate('/home')
    }

    const setNavStyle = ({ isActive }) => {
        return isActive ? styles["active-link"] : undefined;
    };

    return (
        <div className={styles["nav-wrapper"]}>
            <div className={styles["left-side"]}>
                <div className={styles["nav-link-wrapper"]}>
                    <NavLink className={setNavStyle} to="/">
                        Home
                    </NavLink>
                </div>

                <div className={styles["nav-link-wrapper"]}>
                    <NavLink className={setNavStyle} to="/recipes/list">
                        Recipes
                    </NavLink>
                </div>

                <div className={styles["nav-link-wrapper"]}>
                    <NavLink className={setNavStyle} to="/gallery">
                        Gallery
                    </NavLink>
                </div>

                <div className={styles["nav-link-wrapper"]}>
                    <NavLink className={setNavStyle} to="/forum">
                        Forum
                    </NavLink>
                </div>

                <div className={styles["nav-link-wrapper"]}>
                    <NavLink className={setNavStyle} to="/about">
                        About
                    </NavLink>
                </div>
            </div>

            <div className={styles["right-side"]}>
                {currentUser ? (
                    <>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink
                                className={setNavStyle}
                                to={`/auth/${userId}/details`}
                            >
                                {currentUser?.displayName || currentUser?.email}
                            </NavLink>
                        </div>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink to="/home" onClick={logoutHandler}>logout</NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink className={setNavStyle} to="/auth/sign-in">
                                Sign In
                            </NavLink>
                        </div>
                        <div className={styles["nav-link-wrapper"]}>
                            <NavLink className={setNavStyle} to="/auth/sign-up">
                                try it free
                            </NavLink>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
