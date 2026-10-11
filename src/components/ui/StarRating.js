import { useState } from "react";
import { Star } from "lucide-react";

export const StarRating = ({ value = 0, size = "h-4 w-4" }) => (
    <span
        className="inline-flex items-center gap-0.5"
        aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
        {[1, 2, 3, 4, 5].map((i) => (
            <Star
                key={i}
                aria-hidden="true"
                className={`${size} ${
                    i <= Math.round(value)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-neutral-300 dark:text-neutral-600"
                }`}
            />
        ))}
    </span>
);

export const StarInput = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    const shown = hovered || value || 0;

    return (
        <div
            className="inline-flex items-center gap-1"
            onMouseLeave={() => setHovered(0)}
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onChange(i)}
                    onMouseEnter={() => setHovered(i)}
                    aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                    className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                    <Star
                        className={`h-7 w-7 ${
                            i <= shown
                                ? "fill-amber-400 text-amber-400"
                                : "fill-transparent text-neutral-300 dark:text-neutral-600"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};
