import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContext";
import * as authService from "../../../services/authService";

import styles from "./Register.module.css";

export const Register = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");

        if (password !== confirmPassword) {
            return;
        }

        authService
            .register(username, email, password)
            .then((authData) => {
                userLogin(authData);
                navigate("/");
            })
            .catch(() => {
                navigate("/not-found");
            });
    };

    return (
        <div className={styles["register-form-wrapper"]}>
            <h1 className={styles["title-style"]}>Sign Up</h1>
            <form onSubmit={onSubmit}>
                <div className={styles.containers}>
                    <input
                        name="username"
                        id="username"
                        type="text"
                        placeholder="Username"
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="email"
                        id="email-sign-up"
                        type="text"
                        placeholder="Email"
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="password"
                        id="password-sign-up"
                        type="password"
                        placeholder="password"
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="confirm-password"
                        id="confirm-password-sign-up"
                        type="password"
                        placeholder="confirm-password"
                    />
                </div>

                <div className={styles.containers}>
                    <label htmlFor="tac">Terms and Conditions:</label>
                    <input type="checkbox" name="tac" id="tac" />
                </div>

                <div>
                    <input
                        className={styles["auth-btn"]}
                        type="submit"
                        value="Sign Up"
                    />
                </div>
            </form>
        </div>
    );
};
