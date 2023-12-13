import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';
import * as authService from '../../../services/authService';

import styles from "./Register.module.css"

export const Register = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target)
        
        const email = formData.get('email')
        const password = formData.get('password')
        const confirmPassword = formData.get('confirm-password')

        if(password !== confirmPassword) {
            return
        }

        authService.register(email, password)
            .then((authData) => {
                userLogin(authData);
                navigate('/')
            })
            .catch(() => {
                navigate('/not-found');
            });
    };



    return (
        <div className={styles["register-form-wrapper"]}>
            <h1>Sign Up</h1>
            <form onSubmit={onSubmit}>
                <div className={styles.containers}>
                    <label htmlFor="email-sign-up">Email:</label>
                    <input
                        name="email"
                        id="email-sign-up"
                        type="text"

                    />
                </div>
                <div className={styles.containers}>
                    <label htmlFor="password-sign-up">Password:</label>
                    <input
                        name="password"
                        id="password-sign-up"
                        type="password"

                    />
                </div>
                <div className={styles.containers}>
                    <label htmlFor="confirm-password-sign-up">Confirm Password:</label>
                    <input
                        name="confirm-password"
                        id="confirm-password-sign-up"
                        type="password"

                    />
                </div>

                <div className={styles.containers}>
                    <label htmlFor="tac">Terms and Conditions:</label>
                    <input
                        type="checkbox"
                        name="tac"
                        id="tac"

                    />
                </div>

                <div>
                    <input type="submit" value="Sign Up" />
                </div>
            </form>
        </div>
    );
};