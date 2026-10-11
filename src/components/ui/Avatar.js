import { useState } from "react";

const sizes = {
    sm: "h-9 w-9 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-24 w-24 text-3xl",
    xl: "h-32 w-32 text-4xl",
};

export const Avatar = ({ src, name, size = "md", className = "" }) => {
    const [failed, setFailed] = useState(false);
    const initial = (name || "?").trim().charAt(0).toUpperCase();
    const base = `${sizes[size]} shrink-0 rounded-full object-cover ${className}`;

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={name ? `${name}'s avatar` : "Avatar"}
                className={base}
                onError={() => setFailed(true)}
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <span
            className={`${base} inline-flex items-center justify-center bg-brand-100 font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300`}
            aria-label={name ? `${name}'s avatar` : "Avatar"}
        >
            {initial}
        </span>
    );
};
