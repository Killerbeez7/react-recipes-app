import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./SignUp.module.css";

export const SignUp = () => {
    const { currentUser, handleEmailSignUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [username, setUsername] = useState("");

    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [agreed, setAgreed] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const clearForm = () => {
        setEmail("");
        // setUsername("");
        setPassword("");
        setConfirmPassword("");
        setAgreed(false);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSigningUp) return;

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setPassword("");
            setConfirmPassword("");
            return;
        }

        setIsSigningUp(true);
        setErrorMessage("");

        try {
            // if adding username change to: handleEmailSignUp(email, password, username);
            await handleEmailSignUp(email, password);
            navigate("/");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setErrorMessage(
                    "This email is already in use. Please try another."
                );
                clearForm();
            } else if (error.code === "auth/missing-password") {
                setErrorMessage("Please fill in the password field.");
                setPassword("");
                setConfirmPassword("");
            } else if (error.code === "auth/weak-password") {
                setErrorMessage("Password should be at least 6 characters.");
                setPassword("");
                setConfirmPassword("");
            } else {
                setErrorMessage("Failed to create account. Please try again.");
                clearForm();
            }
        } finally {
            setIsSigningUp(false);
        }
    };

    // go back button functionality
    const isExternalReferrer =
        !document.referrer ||
        !document.referrer.includes(window.location.origin);
    const isFromSignIn = location.state?.from === "/auth/sign-in";

    const from = isExternalReferrer
        ? "/"
        : isFromSignIn
        ? location.state?.previous || "/"
        : location.state?.from || "/";

    const handleGoBack = () => {
        navigate(from);
    };

    if (currentUser) {
        return <Navigate to="/" replace />;
    }

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
                <h1 className={styles["title-style"]}>Sign Up</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* if add username uncomment this */}
                    {/* <div className={styles.containers}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleInputChange(setUsername)}
                        />
                    </div> */}
                    <div className={styles.containers}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                            disabled={isSigningUp}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange(setPassword)}
                            disabled={isSigningUp}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword)}
                            disabled={isSigningUp}
                        />
                    </div>

                    {errorMessage && (
                        <p style={{ color: "red" }}>{errorMessage}</p>
                    )}

                    <div className={styles.terms}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            disabled={isSigningUp}
                        />
                        <label htmlFor="terms">
                            I agree to the Terms and Conditions
                        </label>
                    </div>

                    <button
                        className={styles["auth-btn"]}
                        type="submit"
                        disabled={!agreed || isSigningUp}
                    >
                        {isSigningUp ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};
