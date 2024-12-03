import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { ref, set } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";

import styles from "./SignUp.module.css";

export const SignUp = () => {
    const { userLoggedIn, setCurrentUser } = useAuth();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [agreed, setAgreed] = useState(false);

    const clearForm = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setAgreed(false);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setPassword('');
            setConfirmPassword('');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: username,
            });

            setCurrentUser({ ...user, displayName: username });

            const userRef = ref(database, `users/${user.uid}`);
            await set(userRef, {
                username: username,
                email: user.email,
                createdAt: new Date().toISOString(),
            });

            console.log("User created successfully with displayName:", user.displayName);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setErrorMessage('This email is already in use. Please try another.');
                clearForm();
            } else if (err.code === 'auth/weak-password') {
                setErrorMessage('Password should be at least 6 characters.');
                setPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage('Failed to create account. Please try again.');
                clearForm();
            }
        }
    };

    return (
        <div className={styles["main"]}>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}

            <h1 className={styles["title-style"]}>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className={styles.containers}>
                    <input
                        type="text"
                        placeholder="username"
                        name="username"
                        id="username-sign-up"
                        value={username} onChange={handleInputChange(setUsername)}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        type="email"
                        placeholder="email"
                        name="email"
                        id="email-sign-up"
                        value={email} onChange={handleInputChange(setEmail)}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        type="password"
                        placeholder="password"
                        name="password"
                        id="password-sign-up"
                        value={password} onChange={handleInputChange(setPassword)}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        type="password"
                        placeholder="confirm password"
                        name="confirm-password"
                        id="confirm-password-sign-up"
                        value={confirmPassword} onChange={handleInputChange(setConfirmPassword)}
                    />
                </div>

                {errorMessage && (
                    <div style={{ padding: '10px', borderRadius: '5px' }}>
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                    </div>
                )}

                <div>
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <label htmlFor="terms">I agree to the Terms and Conditions</label>
                </div>

                <button className={styles["auth-btn"]} type="submit" disabled={!agreed}>Sign Up</button>
            </form>
        </div>
    );
};
