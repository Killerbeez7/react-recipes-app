import { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { AuthLayout } from "../auth-layout/AuthLayout";
import { Spinner } from "../../ui/Loader";

const errorMessages = {
    "auth/email-already-in-use":
        "This email is already in use. Please sign in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/missing-password": "Please fill in the password field.",
    "auth/weak-password": "Password should be at least 6 characters.",
};

export const SignUp = () => {
    const { currentUser, handleEmailSignUp } = useAuth();

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [agreed, setAgreed] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    if (currentUser && !isSigningUp) {
        return <Navigate to={from} replace />;
    }

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSigningUp) return;

        if (values.password !== values.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsSigningUp(true);
        setErrorMessage("");

        try {
            await handleEmailSignUp(
                values.email,
                values.password,
                values.username
            );
            navigate(from, { replace: true });
        } catch (error) {
            setErrorMessage(
                errorMessages[error.code] ||
                    "Failed to create account. Please try again."
            );
            setIsSigningUp(false);
        }
    };

    const fields = [
        {
            name: "username",
            label: "Username",
            type: "text",
            autoComplete: "username",
            placeholder: "Your display name",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            autoComplete: "email",
            placeholder: "you@example.com",
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "new-password",
            placeholder: "At least 6 characters",
            minLength: 6,
        },
        {
            name: "confirmPassword",
            label: "Confirm password",
            type: "password",
            autoComplete: "new-password",
            placeholder: "Repeat your password",
            minLength: 6,
        },
    ];

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join the community and start sharing recipes."
            backTo={from}
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                {fields.map(({ name, label, ...rest }) => (
                    <div key={name}>
                        <label htmlFor={name} className="label">
                            {label}
                        </label>
                        <input
                            id={name}
                            name={name}
                            required
                            className="input"
                            value={values[name]}
                            onChange={handleChange}
                            disabled={isSigningUp}
                            {...rest}
                        />
                    </div>
                ))}

                <label
                    htmlFor="terms"
                    className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                    <input
                        id="terms"
                        type="checkbox"
                        className="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        disabled={isSigningUp}
                    />
                    I agree to the Terms and Conditions
                </label>

                {errorMessage && <p className="alert-error">{errorMessage}</p>}

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={!agreed || isSigningUp}
                >
                    {isSigningUp && <Spinner className="h-4 w-4" />}
                    {isSigningUp ? "Creating account..." : "Sign up"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                Already have an account?{" "}
                <Link to="/auth/sign-in" state={{ from }} className="link">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
};
