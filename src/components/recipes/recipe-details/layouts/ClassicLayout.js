import { Check, Play, Users } from "lucide-react";
import { plural } from "./recipeParts";
import { RecipeTips } from "./RecipeTips";

// The normal recipe view: ingredients grid above a numbered timeline.
// On desktop, "Start cooking" (onStartCooking) switches to cook mode.
export const ClassicLayout = ({
    recipe,
    ingredients,
    steps,
    checkedIngredients,
    onToggleIngredient,
    onClearIngredients,
    doneSteps,
    onToggleStep,
    onStartCooking,
}) => (
    <div className="mx-auto max-w-3xl space-y-16">
        <section aria-labelledby="ingredients-title">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <h2 id="ingredients-title" className="section-title">
                    Ingredients
                </h2>
                <div className="flex items-center gap-2">
                    {recipe.servings && (
                        <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            <Users className="h-3.5 w-3.5" aria-hidden="true" />
                            {plural(recipe.servings, "serving")}
                        </span>
                    )}
                    {checkedIngredients.size > 0 ? (
                        <button
                            type="button"
                            onClick={() => onClearIngredients()}
                            className="badge bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20 print:hidden"
                        >
                            {checkedIngredients.size} of {ingredients.length}{" "}
                            ready · Clear
                        </button>
                    ) : (
                        <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            {plural(ingredients.length, "item")}
                        </span>
                    )}
                </div>
            </div>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 print:hidden">
                Tick off what you have ready.
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {ingredients.map((item, i) => {
                    const checked = checkedIngredients.has(i);
                    return (
                        <li key={i}>
                            <label
                                className={`flex h-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 transition-colors ${
                                    checked
                                        ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox mt-1 print:hidden"
                                    checked={checked}
                                    onChange={() => onToggleIngredient(i)}
                                />
                                <span
                                    className={`first-letter:uppercase ${
                                        checked
                                            ? "text-neutral-400 line-through dark:text-neutral-500"
                                            : "text-neutral-800 dark:text-neutral-200"
                                    }`}
                                >
                                    {item}
                                </span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </section>

        <section aria-labelledby="directions-title">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 id="directions-title" className="section-title">
                        Directions
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 print:hidden">
                        Tap a step to mark it as done.
                    </p>
                </div>
                {/* "Start cooking" (desktop) with the progress underneath */}
                <div
                    className={`flex shrink-0 flex-col gap-2 print:hidden ${
                        onStartCooking ? "items-center" : "items-end"
                    }`}
                >
                    {onStartCooking && steps.length > 0 && (
                        <button
                            type="button"
                            onClick={onStartCooking}
                            className="btn-primary px-4 py-2"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            {doneSteps.size > 0 && doneSteps.size < steps.length
                                ? "Continue cooking"
                                : "Start cooking"}
                        </button>
                    )}
                    <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        {doneSteps.size} of {plural(steps.length, "step")} done
                    </span>
                </div>
            </div>

            <ol className="mt-6">
                {steps.map((step, i) => {
                    const done = doneSteps.has(i);
                    const last = i === steps.length - 1;
                    return (
                        <li key={i} className="relative">
                            {/* Timeline connector */}
                            {!last && (
                                <span
                                    aria-hidden="true"
                                    className={`absolute bottom-0 left-4 top-11 w-px ${
                                        done
                                            ? "bg-emerald-300 dark:bg-emerald-800"
                                            : "bg-neutral-200 dark:bg-neutral-800"
                                    }`}
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => onToggleStep(i)}
                                aria-pressed={done}
                                aria-label={`Step ${i + 1}${done ? " (done)" : ""}`}
                                className={`group flex w-full gap-4 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                                    last ? "" : "pb-8"
                                }`}
                            >
                                <span
                                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-neutral-50 transition-colors dark:ring-neutral-950 ${
                                        done
                                            ? "bg-emerald-600 text-white"
                                            : "bg-brand-600 text-white group-hover:bg-brand-700"
                                    }`}
                                >
                                    {done ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        i + 1
                                    )}
                                </span>
                                <span
                                    className={`pt-0.5 leading-7 transition-colors first-letter:uppercase ${
                                        done
                                            ? "text-neutral-400 line-through decoration-neutral-300 dark:text-neutral-500 dark:decoration-neutral-700"
                                            : "text-neutral-800 group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white"
                                    }`}
                                >
                                    {step}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
            <RecipeTips tips={recipe.tips} />
        </section>
    </div>
);
