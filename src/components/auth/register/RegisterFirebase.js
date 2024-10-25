import { useState } from "react";
import { Navigate, } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContextFirebase'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'


import styles from "./Register.module.css";

export const RegisterFirebase = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistrating, setIsRegistrating] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistrating) {
            setIsRegistrating(true)
            await doCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <div className={styles["register-form-wrapper"]}>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

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
                        value={email} onChange={(e) => { setEmail(e.target.value) }}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="password"
                        id="password-sign-up"
                        type="password"
                        placeholder="password"
                        value={password} onChange={(e) => { setPassword(e.target.value) }}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="confirm-password"
                        id="confirm-password-sign-up"
                        type="password"
                        placeholder="confirm-password"
                        value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }}
                    />
                </div>

                {errorMessage && (<span className="text-red-600 front-bold">{errorMessage}</span>)}

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
