import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Bookmark,
    ChevronRight,
    KeyRound,
    LogOut,
    Moon,
    Pencil,
    Plus,
    Sun,
    Trash2,
    UserRound,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { deleteAccount } from "../../../services/authService";
import { Avatar } from "../../ui/Avatar";

const Section = ({ title, description, children }) => (
    <section className="card p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {description}
            </p>
        )}
        <div className="mt-5">{children}</div>
    </section>
);

const RowLink = ({ to, icon: Icon, children }) => (
    <Link
        to={to}
        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
        <Icon className="h-5 w-5 text-neutral-500" />
        <span className="flex-1">{children}</span>
        <ChevronRight className="h-4 w-4 text-neutral-400" />
    </Link>
);

export const AccountManagement = () => {
    const { currentUser, userProfile, handleSignOut } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const userId = currentUser.uid;
    const name =
        currentUser.displayName || userProfile?.username || "Your account";

    const onSignOut = async () => {
        await handleSignOut();
        navigate("/");
    };

    const onDeleteAccount = async () => {
        if (
            !window.confirm(
                "Delete your account permanently? This cannot be undone."
            )
        )
            return;
        setError("");
        try {
            await deleteAccount();
            navigate("/");
        } catch (err) {
            setError(
                err.code === "auth/requires-recent-login"
                    ? "For security, please sign out and sign in again before deleting your account."
                    : "Couldn't delete your account. Please try again."
            );
        }
    };

    return (
        <div className="page max-w-3xl space-y-6">
            <h1 className="page-title">My account</h1>

            {/* Profile summary */}
            <section className="card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
                <Avatar src={currentUser.photoURL} name={name} size="lg" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xl font-semibold text-neutral-900 dark:text-white">
                        {name}
                    </p>
                    <p className="truncate text-sm text-neutral-600 dark:text-neutral-400">
                        {currentUser.email}
                    </p>
                    {userProfile?.bio && (
                        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                            {userProfile.bio}
                        </p>
                    )}
                </div>
                <Link
                    to={`/auth/${userId}/edit-profile`}
                    className="btn-secondary"
                >
                    <Pencil className="h-4 w-4" /> Edit profile
                </Link>
            </section>

            <Section title="Shortcuts">
                <div className="-mx-3 divide-y divide-neutral-100 dark:divide-neutral-800">
                    <RowLink to={`/profile/${userId}`} icon={UserRound}>
                        View public profile
                    </RowLink>
                    <RowLink
                        to={`/recipes/saved-recipes/${userId}`}
                        icon={Bookmark}
                    >
                        Saved recipes
                    </RowLink>
                    <RowLink to="/recipes/add" icon={Plus}>
                        Add a recipe
                    </RowLink>
                </div>
            </Section>

            <Section title="Security" description="Keep your account secure.">
                <Link to="/auth/settings" className="btn-secondary">
                    <KeyRound className="h-4 w-4" /> Change password
                </Link>
            </Section>

            <Section
                title="Appearance"
                description="Choose how Eat & Amare looks to you."
            >
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn-secondary"
                >
                    {darkMode ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                    {darkMode ? "Switch to light mode" : "Switch to dark mode"}
                </button>
            </Section>

            <Section title="Session">
                <button
                    type="button"
                    onClick={onSignOut}
                    className="btn-secondary"
                >
                    <LogOut className="h-4 w-4" /> Sign out
                </button>
            </Section>

            <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Danger zone
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Permanently delete your account and profile. Your published
                    recipes will remain.
                </p>
                {error && <p className="alert-error mt-4">{error}</p>}
                <button
                    type="button"
                    onClick={onDeleteAccount}
                    className="btn-danger mt-5"
                >
                    <Trash2 className="h-4 w-4" /> Delete account
                </button>
            </section>
        </div>
    );
};
