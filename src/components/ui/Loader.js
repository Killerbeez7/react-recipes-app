import { Loader2 } from "lucide-react";

export const Spinner = ({ className = "h-5 w-5" }) => (
    <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />
);

export const PageLoader = ({ label = "Loading..." }) => (
    <div
        role="status"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400"
    >
        <Spinner className="h-8 w-8 text-brand-600" />
        <span className="text-sm">{label}</span>
    </div>
);
