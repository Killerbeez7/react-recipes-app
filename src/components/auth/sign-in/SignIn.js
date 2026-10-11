import { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { resetPassword } from "../../../services/authService";
import { AuthLayout } from "../auth-layout/AuthLayout";
import { GoogleIcon } from "../auth-layout/GoogleIcon";
import { Spinner } from "../../ui/Loader";

export const SignIn = () => {
    const { currentUser, handleEmailSignIn, handleGoogleSignIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [pending, setPending] = useState(null); // "email" | "google" | null

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    if (currentUser && !pending) {
        return <Navigate to={from} replace />;
    }

    const run = async (type, action, fallbackMessage) => {
        setPending(type);
        setErrorMessage("");
        setInfoMessage("");
        try {
            await action();
            navigate(from, { replace: true });
        } catch (error) {
            if (error.code !== "auth/popup-closed-by-user") {
                setErrorMessage(fallbackMessage);
            }
            setPending(null);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        run(
            "email",
            () => handleEmailSignIn(email, password),
            "Failed to sign in. Please check your email and password."
        );
    };

    const onGoogleSignIn = () =>
        run("google", handleGoogleSignIn, "Failed to sign in with Google.");

    const onForgotPassword = async () => {
        setErrorMessage("");
        setInfoMessage("");
        if (!email) {
            setErrorMessage(
                "Enter your email above, then click “Forgot password?” again."
            );
            return;
        }
        try {
            await resetPassword(email);
            setInfoMessage(
                `If an account exists for ${email}, a reset link is on its way.`
            );
        } catch {
            setErrorMessage(
                "Couldn't send the reset email. Please check the address."
            );
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Please enter your details."
            backTo={from}
        >
            <form className="space-y-5" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!!pending}
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="link mb-1.5 text-sm"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!!pending}
                    />
                </div>

                {errorMessage && <p className="alert-error">{errorMessage}</p>}
                {infoMessage && <p className="alert-success">{infoMessage}</p>}

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={!!pending}
                >
                    {pending === "email" && <Spinner className="h-4 w-4" />}
                    {pending === "email" ? "Signing in..." : "Sign in"}
                </button>

                <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-400">
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                    or
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>

                <button
                    type="button"
                    onClick={onGoogleSignIn}
                    className="btn-secondary w-full"
                    disabled={!!pending}
                >
                    {pending === "google" ? (
                        <Spinner className="h-4 w-4" />
                    ) : (
                        <GoogleIcon />
                    )}
                    {pending === "google"
                        ? "Signing in with Google..."
                        : "Continue with Google"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                Don't have an account?{" "}
                <Link to="/auth/sign-up" state={{ from }} className="link">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
};
