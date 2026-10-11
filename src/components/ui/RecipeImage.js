import { useState } from "react";
import { ChefHat } from "lucide-react";

export const RecipeImage = ({ src, alt, className = "" }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-500 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-600 ${className}`}
                role="img"
                aria-label={alt}
            >
                <ChefHat className="h-1/3 max-h-16 w-1/3 max-w-[4rem]" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            className={`object-cover ${className}`}
            onError={() => setFailed(true)}
        />
    );
};
