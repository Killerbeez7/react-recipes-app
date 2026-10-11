import { useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ingredientsInStep, plural, splitIngredient } from "./recipeParts";
import { RecipeTips } from "./RecipeTips";

// Idea 3 – "Prep board": mise en place cards with big quantities, then the
// method as a horizontal rail of step cards. Each step shows the
// ingredients it uses, so you rarely need to look back up.
export const PrepBoardLayout = ({
    recipe,
    ingredients,
    steps,
    checkedIngredients,
    onToggleIngredient,
    doneSteps,
    onToggleStep,
}) => {
    const railRef = useRef(null);
    const parsed = useMemo(
        () => ingredients.map(splitIngredient),
        [ingredients]
    );
    const usedBySteps = useMemo(
        () => steps.map((step) => ingredientsInStep(step, ingredients)),
        [steps, ingredients]
    );

    const scrollRail = (direction) =>
        railRef.current?.scrollBy({
            left: direction * railRef.current.clientWidth * 0.8,
            behavior: "smooth",
        });

    return (
        <div className="mx-auto max-w-6xl space-y-14">
            {/* Mise en place board */}
            <section aria-labelledby="ingredients-title">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                            Step 0 · Mise en place
                        </p>
                        <h2
                            id="ingredients-title"
                            className="section-title mt-1"
                        >
                            Get everything ready
                        </h2>
                    </div>
                    <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        {checkedIngredients.size}/{ingredients.length} ready
                        {recipe.servings &&
                            ` · ${plural(recipe.servings, "serving")}`}
                    </span>
                </div>

                <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
                    {parsed.map(({ quantity, name }, i) => {
                        const checked = checkedIngredients.has(i);
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onToggleIngredient(i)}
                                    aria-pressed={checked}
                                    className={`relative flex h-full w-full flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                                        checked
                                            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                                            : "border-neutral-200 bg-white hover:-translate-y-0.5 hover:shadow-card-hover dark:border-neutral-800 dark:bg-neutral-900"
                                    }`}
                                >
                                    {checked && (
                                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                                            <Check className="h-3 w-3" />
                                        </span>
                                    )}
                                    <span className="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">
                                        {quantity || "—"}
                                    </span>
                                    <span
                                        className={`mt-1 text-sm leading-5 first-letter:uppercase ${
                                            checked
                                                ? "text-neutral-500 line-through"
                                                : "text-neutral-800 dark:text-neutral-200"
                                        }`}
                                    >
                                        {name}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Method rail */}
            <section aria-labelledby="directions-title">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                            {doneSteps.size} of {steps.length} done
                        </p>
                        <h2
                            id="directions-title"
                            className="section-title mt-1"
                        >
                            Method
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => scrollRail(-1)}
                            className="btn-icon border border-neutral-200 dark:border-neutral-800"
                            aria-label="Previous steps"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollRail(1)}
                            className="btn-icon border border-neutral-200 dark:border-neutral-800"
                            aria-label="More steps"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <ol
                    ref={railRef}
                    className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
                >
                    {steps.map((step, i) => {
                        const done = doneSteps.has(i);
                        return (
                            <li key={i} className="w-80 shrink-0 snap-start">
                                <button
                                    type="button"
                                    onClick={() => onToggleStep(i)}
                                    aria-pressed={done}
                                    className={`flex h-full w-full flex-col rounded-2xl border p-6 text-left transition-colors ${
                                        done
                                            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                                            : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                                    }`}
                                >
                                    <span className="flex items-center justify-between">
                                        <span
                                            className={`font-display text-5xl font-bold leading-none ${done ? "text-emerald-600" : "text-brand-600/25 dark:text-brand-400/30"}`}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        {done && (
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                                                <Check className="h-4 w-4" />
                                            </span>
                                        )}
                                    </span>
                                    <span
                                        className={`mt-4 flex-1 leading-7 first-letter:uppercase ${done ? "text-neutral-500 line-through" : "text-neutral-800 dark:text-neutral-200"}`}
                                    >
                                        {step}
                                    </span>
                                    {usedBySteps[i].length > 0 && (
                                        <span className="mt-5 flex flex-wrap gap-1.5">
                                            {usedBySteps[i].map((index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-500/10 dark:text-brand-200"
                                                >
                                                    {parsed[index].quantity &&
                                                        `${parsed[index].quantity} `}
                                                    {parsed[index].name}
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <RecipeTips tips={recipe.tips} />
            </section>
        </div>
    );
};
