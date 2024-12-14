import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
    doSignInWithEmailAndPassword,
    doSignInWithGoogle,
    addUserToDatabase,
    getUserFromDatabase,
} from "../../../firebase/auth";
import styles from "./SignIn.module.css";

export const SignIn = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    if (userLoggedIn) {
        return <Navigate to={"/"} replace={true} />;
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
        if (!isSigningInWithGoogle) {
            setIsSigningInWithGoogle(true);
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

    const canGoBack = window.history.length > 1;

    return (
        <div className={styles.main}>
            {/* Left Section */}
            <div className={styles["left-section"]}>
                <h1>Welcome to Eat & Amare</h1>
            </div>{" "}
            {/* Right Section */}
            <div className={styles["right-section"]}>
                {/* Go Back Button */}
                <button onClick={() => navigate(-1)} className={styles.goBackButton}>
                    ← Go Back
                </button>
                <h1>Welcome back</h1>
                <p>Please enter your details.</p>
                <form onSubmit={onSubmit}>
                    <div className={styles.containers}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <button type="submit" className={styles["auth-btn"]}>
                        {isSigningIn ? "Signing In..." : "Sign In"}
                    </button>
                    <button onClick={onGoogleSignIn} className={styles["auth-btn"]}>
                        {isSigningInWithGoogle
                            ? "Signing with Google..."
                            : "with Google"}
                    </button>

                    <div className={styles["extra-options"]}>
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};
