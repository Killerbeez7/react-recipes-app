import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { changePassword } from "../../../services/authService";
import { Spinner } from "../../ui/Loader";

export const Settings = () => {
    const { currentUser } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSaving, setIsSaving] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setStatus({
                type: "error",
                message: "Password should be at least 6 characters.",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatus({
                type: "error",
                message: "New passwords do not match.",
            });
            return;
        }

        setIsSaving(true);
        try {
            await changePassword(newPassword);
            setStatus({
                type: "success",
                message: "Password updated successfully!",
            });
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error.code === "auth/requires-recent-login"
                        ? "For security, please sign out and sign in again before changing your password."
                        : "Couldn't update your password. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page max-w-lg">
            <Link
                to={`/auth/${currentUser.uid}/account-management`}
                className="btn-ghost -ml-3 mb-6 px-3"
            >
                <ArrowLeft className="h-4 w-4" /> My account
            </Link>
            <h1 className="page-title">Change password</h1>
            <p className="page-subtitle">
                Choose a new password with at least 6 characters.
            </p>

            <form
                onSubmit={handleChangePassword}
                className="card mt-8 space-y-5 p-6"
            >
                <div>
                    <label htmlFor="new-password" className="label">
                        New password
                    </label>
                    <input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password" className="label">
                        Confirm new password
                    </label>
                    <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {status.message && (
                    <p
                        className={
                            status.type === "error"
                                ? "alert-error"
                                : "alert-success"
                        }
                    >
                        {status.message}
                    </p>
                )}

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={isSaving}
                >
                    {isSaving && <Spinner className="h-4 w-4" />}
                    Update password
                </button>
            </form>
        </div>
    );
};
