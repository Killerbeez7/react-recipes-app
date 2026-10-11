import { Link } from "react-router-dom";

// Wordmark: "Eat & Amare" with the ampersand in red, standing in for a heart.
export const Logo = ({ className = "text-2xl", onDark = false }) => (
    <Link
        to="/"
        aria-label="Eat & Amare – home"
        className={`whitespace-nowrap font-display font-bold tracking-tight ${
            onDark ? "text-white" : "text-neutral-900 dark:text-white"
        } ${className}`}
    >
        Eat{" "}
        <span
            className={
                onDark ? "text-red-500" : "text-red-600 dark:text-red-500"
            }
        >
            &amp;
        </span>{" "}
        Amare
    </Link>
);
