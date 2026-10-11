import { useState } from "react";
import { BookOpen, LayoutGrid, LayoutList, PlayCircle } from "lucide-react";

export const LAYOUTS = [
    { id: "classic", label: "Classic", icon: LayoutList },
    { id: "cook", label: "Cook mode", icon: PlayCircle },
    { id: "cookbook", label: "Cookbook", icon: BookOpen },
    { id: "board", label: "Prep board", icon: LayoutGrid },
];

const STORAGE_KEY = "recipe-layout-experiment";

// Remembers the chosen layout per browser; ?layout=cook etc. overrides it
export const useRecipeLayout = () => {
    const [layout, setLayoutState] = useState(() => {
        const fromUrl = new URLSearchParams(window.location.search).get(
            "layout"
        );
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch {}
        const choice = fromUrl || saved;
        return LAYOUTS.some((l) => l.id === choice) ? choice : "classic";
    });

    const setLayout = (id) => {
        setLayoutState(id);
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch {}
    };

    return [layout, setLayout];
};

export const LayoutSwitcher = ({ value, onChange }) => (
    <div className="mb-12 flex flex-col items-center gap-2 print:hidden">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Layout experiment
        </span>
        <div
            role="radiogroup"
            aria-label="Recipe layout"
            className="inline-flex gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
            {LAYOUTS.map(({ id, label, icon: Icon }) => {
                const selected = value === id;
                return (
                    <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                            selected
                                ? "bg-brand-600 text-white shadow-sm"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                        }`}
                    >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                    </button>
                );
            })}
        </div>
    </div>
);
