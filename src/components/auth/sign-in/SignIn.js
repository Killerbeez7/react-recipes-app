import { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import styles from "./SignIn.module.css";

export const SignIn = () => {
    const { currentUser, handleEmailSignIn, handleGoogleSignIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    if (currentUser) {
        return <Navigate to={"/"} replace={true} />;
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setIsSigningIn(true);
        try {
            await handleEmailSignIn(email, password);
            navigate("/");
        } catch (error) {
            setErrorMessage(
                "Failed to sign in. Please check your credentials."
            );
        } finally {
            setIsSigningIn(false);
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();

        setIsSigningInWithGoogle(true);
        try {
            await handleGoogleSignIn();
            navigate("/");
        } catch (error) {
            setErrorMessage("Failed to sign in with Google.");
        } finally {
            setIsSigningInWithGoogle(false);
        }
    };

    const from = location.state?.from || "/";
    const handleGoBack = () => {
        navigate(from);
    };

    return (
        <div className={styles.main}>
            {/* Left Section */}
            <div className={styles["left-section"]}>
                <h1>Welcome to Eat & Amare</h1>
            </div>

            {/* Right Section */}
            <div className={styles["right-section"]}>
                <button onClick={handleGoBack} className={styles.goBackButton}>
                    ← Go Back
                </button>
                <h1>Welcome back</h1>
                <p>Please enter your details.</p>

                <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles.containers}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSigningIn || isSigningInWithGoogle}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSigningIn || isSigningInWithGoogle}
                        />
                    </div>
                    {errorMessage && (
                        <p style={{ color: "red" }}>{errorMessage}</p>
                    )}

                    {/* Disable button if still signing in */}
                    <button
                        type="submit"
                        className={styles["auth-btn"]}
                        disabled={isSigningIn || isSigningInWithGoogle}
                    >
                        {isSigningIn ? "Signing In..." : "Sign In"}
                    </button>

                    <button
                        onClick={onGoogleSignIn}
                        className={styles["auth-btn"]}
                        disabled={isSigningIn || isSigningInWithGoogle}
                    >
                        {isSigningInWithGoogle
                            ? "Signing with Google..."
                            : "with Google"}
                    </button>

                    <div className={styles["extra-options"]}>
                        <a href="/forgot-password">Forgot Password?</a>
                        <p>
                            No account?
                            <Link to="/auth/sign-up" state={{ from }}>
                                {" "}
                                Sign up
                            </Link>
                        </p>
                    </div>
                    <div className={styles["extra-options"]}></div>
                </form>
            </div>
        </div>
    );
};
