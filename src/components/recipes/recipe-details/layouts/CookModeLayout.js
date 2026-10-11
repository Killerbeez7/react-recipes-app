import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    PartyPopper,
    RotateCcw,
} from "lucide-react";
import { ingredientsInStep, plural, splitIngredient } from "./recipeParts";
import { RecipeTips } from "./RecipeTips";

// Idea 1 – "Cook mode": one big step at a time, like a cooking app.
// The ingredient strip highlights what the current step needs.
export const CookModeLayout = ({
    recipe,
    ingredients,
    steps,
    checkedIngredients,
    onToggleIngredient,
    doneSteps,
    onSetDoneSteps,
}) => {
    const [current, setCurrent] = useState(0);
    const finished = steps.length > 0 && doneSteps.size === steps.length;
    const step = steps[current] || "";

    const usedNow = useMemo(
        () => new Set(ingredientsInStep(step, ingredients)),
        [step, ingredients]
    );

    const goTo = (index) =>
        setCurrent(Math.max(0, Math.min(steps.length - 1, index)));

    const next = () => {
        onSetDoneSteps((prev) => new Set(prev).add(current));
        if (current < steps.length - 1) goTo(current + 1);
    };

    const restart = () => {
        onSetDoneSteps(new Set());
        setCurrent(0);
    };

    // ← / → step through the recipe (ignored while typing a comment)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") goTo(current - 1);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    return (
        <div className="mx-auto max-w-5xl">
            {/* Ingredient strip */}
            <section aria-labelledby="ingredients-title">
                <div className="flex items-baseline justify-between gap-4">
                    <h2 id="ingredients-title" className="section-title">
                        Ingredients
                    </h2>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {recipe.servings &&
                            `${plural(recipe.servings, "serving")} · `}
                        highlighted = needed for this step
                    </span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                    {ingredients.map((item, i) => {
                        const { quantity, name } = splitIngredient(item);
                        const checked = checkedIngredients.has(i);
                        const needed = usedNow.has(i) && !finished;
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onToggleIngredient(i)}
                                    aria-pressed={checked}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all ${
                                        needed
                                            ? "scale-105 border-brand-500 bg-brand-50 text-brand-900 shadow-sm ring-2 ring-brand-500/30 dark:bg-brand-500/15 dark:text-brand-100"
                                            : checked
                                              ? "border-neutral-200 text-neutral-400 line-through dark:border-neutral-800 dark:text-neutral-600"
                                              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                                    }`}
                                >
                                    {checked && (
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    )}
                                    {quantity && (
                                        <span className="font-semibold">
                                            {quantity}
                                        </span>
                                    )}
                                    <span className="first-letter:uppercase">
                                        {name}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Stage */}
            <section aria-labelledby="directions-title" className="mt-12">
                <h2 id="directions-title" className="sr-only">
                    Directions
                </h2>

                {/* Segmented progress – click to jump to a step */}
                <div className="flex gap-1.5" aria-label="Steps">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to step ${i + 1}`}
                            aria-current={i === current ? "step" : undefined}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                i === current
                                    ? "bg-brand-600"
                                    : doneSteps.has(i)
                                      ? "bg-emerald-500"
                                      : "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                            }`}
                        />
                    ))}
                </div>

                {finished ? (
                    <div className="card mt-6 flex flex-col items-center px-8 py-16 text-center">
                        <PartyPopper
                            className="h-10 w-10 text-brand-600"
                            aria-hidden="true"
                        />
                        <p className="mt-4 font-display text-3xl font-bold">
                            Enjoy your meal!
                        </p>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                            All {steps.length} steps done. Don't forget to rate
                            the recipe below.
                        </p>
                        <button
                            type="button"
                            onClick={restart}
                            className="btn-secondary mt-8"
                        >
                            <RotateCcw className="h-4 w-4" /> Cook it again
                        </button>
                    </div>
                ) : (
                    <div className="card relative mt-6 overflow-hidden px-10 py-12 sm:px-16">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[12rem] font-bold leading-none text-neutral-100 dark:text-neutral-800/60"
                        >
                            {current + 1}
                        </span>
                        <p className="relative text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                            Step {current + 1} of {steps.length}
                            {doneSteps.has(current) && (
                                <span className="ml-2 text-emerald-600">
                                    · done
                                </span>
                            )}
                        </p>
                        <p className="relative mt-4 min-h-[6rem] text-2xl leading-relaxed text-neutral-900 first-letter:uppercase dark:text-neutral-50">
                            {step}
                        </p>

                        <div className="relative mt-10 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => goTo(current - 1)}
                                disabled={current === 0}
                                className="btn-secondary"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            <span className="hidden text-xs text-neutral-400 sm:block">
                                Tip: use ← → keys
                            </span>
                            <button
                                type="button"
                                onClick={next}
                                className="btn-primary px-6"
                            >
                                {current === steps.length - 1 ? (
                                    <>
                                        <Check className="h-4 w-4" /> Finish
                                    </>
                                ) : (
                                    <>
                                        Next step{" "}
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {!finished && steps[current + 1] && (
                    <p className="mt-4 truncate px-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="font-medium">Up next:</span>{" "}
                        {steps[current + 1]}
                    </p>
                )}

                <RecipeTips tips={recipe.tips} />
            </section>
        </div>
    );
};
