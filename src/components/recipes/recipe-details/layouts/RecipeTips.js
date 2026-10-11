import { ChefHat } from "lucide-react";

export const RecipeTips = ({ tips, className = "mt-10" }) =>
    Array.isArray(tips) && tips.length > 0 ? (
        <div
            className={`rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5 ${className}`}
        >
            <h3 className="flex items-center gap-2 font-semibold">
                <ChefHat
                    className="h-5 w-5 text-brand-600"
                    aria-hidden="true"
                />
                Tips
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                ))}
            </ul>
        </div>
    ) : null;
