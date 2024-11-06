import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext'
import { doSignInWithEmailAndPassword, doSignInWithGoogle, addUserToDatabase, getUserFromDatabase } from '../../../firebase/auth';
import styles from "./SignIn.module.css";

export const SignIn = () => {
    const { userLoggedIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [userData, setUserData] = useState(null)

    if (userLoggedIn) {
        return <Navigate to={'/'} replace={true} />;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const userCredential = await doSignInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                getUserFromDatabase(user.uid, (data) => {
                    setUserData(data);
                });

            } catch (err) {
                setErrorMessage("Failed to sign in. Please check your credentials.");
                console.error("Email/Password Sign-In Error:", err);
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const result = await doSignInWithGoogle();
                const user = result.user;
                await addUserToDatabase(user.uid, user.displayName, user.email);
                getUserFromDatabase(user.uid, (data) => {
                    setUserData(data);
                });
            } catch (err) {
                setErrorMessage("Failed to sign in with Google. Please try again.");
                console.error("Google Sign-In Error:", err);
            } finally {
                setIsSigningIn(false);
            }
        }
    };



    return (
        <div className={styles["main"]}>
            <h1>Sign In</h1>
            <form id="login" className={styles.form} onSubmit={onSubmit}>
                <div className={styles.containers}>
                    <input
                        name="email"
                        id="email-sign-up"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="password"
                        id="password-sign-up"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                    />
                </div>

                {errorMessage && (<span className="text-red-600 front-bold">{errorMessage}</span>)}

                <div>
                    <button
                        type="submit"
                        disabled={isSigningIn}
                        className={styles["auth-btn"]}
                    >
                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                    </button>

                    <button
                        disabled={isSigningIn}
                        onClick={onGoogleSignIn}
                        className={styles["auth-btn"]}
                    >
                        {isSigningIn ? 'Signing In...' : 'Google'}
                    </button>
                </div>
            </form>

            {userData && (
                <div>
                    <h2>Welcome, {userData.username}!</h2>
                    <p>Email: {userData.email}</p>
                </div>
            )}
        </div>
    );
};