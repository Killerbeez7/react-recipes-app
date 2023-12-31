import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContext";
import * as authService from "../../../services/authService";

import styles from "./Login.module.css";

export const Login = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.target));

        authService
            .login(email, password)
            .then((authData) => {
                userLogin(authData);
                navigate("/");
            })
            .catch(() => {
                navigate("/not-found");
            });
    };

    return (
        <div className={styles["login-form-wraper"]}>
            <h1>Sign In</h1>
            <form id="login" className={styles.form} onSubmit={onSubmit}>
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
         

                <div>
                    <input
                        className={styles["auth-btn"]}
                        type="submit"
                        value="Login"
                    />
                </div>
            </form>
        </div>
    );
};
