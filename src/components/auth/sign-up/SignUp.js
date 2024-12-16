import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { ref, set } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";
import styles from "./SignUp.module.css";

export const SignUp = () => {
    const { userLoggedIn, setCurrentUser } = useAuth();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [agreed, setAgreed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const clearForm = () => {
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setAgreed(false);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage("");
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setPassword("");
            setConfirmPassword("");
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
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setErrorMessage("This email is already in use. Please try another.");
                clearForm();
            } else if (err.code === "auth/weak-password") {
                setErrorMessage("Password should be at least 6 characters.");
                setPassword("");
                setConfirmPassword("");
            } else {
                setErrorMessage("Failed to create account. Please try again.");
                clearForm();
            }
        }
    };

    const isExternalReferrer =
        !document.referrer || !document.referrer.includes(window.location.origin);

    const isFromSignIn = location.state?.from === "/auth/sign-in";

    const from = isExternalReferrer
        ? "/"
        : isFromSignIn
        ? location.state?.previous || "/"
        : location.state?.from || "/";
    const handleGoBack = () => {
        navigate(from);
    };

    return (
        <div className={styles.main}>
            {userLoggedIn && <Navigate to={"/"} replace={true} />}

            {/* Left Section */}
            <div className={styles["left-section"]}>
                <h1>Welcome to Eat & Amare</h1>
            </div>

            {/* Right Section */}
            <div className={styles["right-section"]}>
                {/* Go Back Button */}
                <button onClick={handleGoBack} className={styles.goBackButton}>
                    ← Go Back
                </button>
                <h1 className={styles["title-style"]}>Sign Up</h1>
                <form className={styles["form"]} onSubmit={handleSignUp}>
                    <div className={styles.containers}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleInputChange(setUsername)}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange(setPassword)}
                        />
                    </div>
                    <div className={styles.containers}>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword)}
                        />
                    </div>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <div className={styles.terms}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms">I agree to the Terms and Conditions</label>
                    </div>
                    <button className={styles["auth-btn"]} type="submit" disabled={!agreed}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};
