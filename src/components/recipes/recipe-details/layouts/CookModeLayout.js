import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChefHat,
    PartyPopper,
    RotateCcw,
    X,
} from "lucide-react";
import { ingredientsInStep, plural, splitIngredient } from "./recipeParts";
import { RecipeTips } from "./RecipeTips";

const range = (n) => Array.from({ length: n }, (_, i) => i);

// "Cook mode": one step at a time, like a cooking app. The ingredient tray
// highlights what the current step needs. Progress follows your position:
// every step before the current one counts as done.
export const CookModeLayout = ({
    recipe,
    ingredients,
    steps,
    checkedIngredients,
    onToggleIngredient,
    doneSteps,
    onSetDoneSteps,
    onExitCooking,
}) => {
    const total = steps.length;
    const rootRef = useRef(null);
    const [inView, setInView] = useState(false);

    // Resume at the first step that isn't done yet (current === total: finished)
    const [current, setCurrent] = useState(() => {
        const firstOpen = range(total).find((i) => !doneSteps.has(i));
        return firstOpen === undefined ? total : firstOpen;
    });
    const finished = total > 0 && current >= total;
    // Latest position for key handlers, so fast repeated presses all count
    const currentRef = useRef(current);

    const goTo = useCallback(
        (index) => {
            const target = Math.max(0, Math.min(total, index));
            currentRef.current = target;
            setCurrent(target);
            onSetDoneSteps(new Set(range(target)));
        },
        [total, onSetDoneSteps]
    );

    const neededNow = useMemo(
        () =>
            finished
                ? new Set()
                : new Set(ingredientsInStep(steps[current] || "", ingredients)),
        [finished, steps, current, ingredients]
    );

    // Only listen for arrow keys while cook mode is on screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.25 }
        );
        if (rootRef.current) observer.observe(rootRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        const onKeyDown = (e) => {
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (
                /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) ||
                e.target.isContentEditable
            ) {
                return;
            }
            if (e.key === "Escape") {
                onExitCooking?.();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goTo(currentRef.current + 1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(currentRef.current - 1);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [inView, goTo, onExitCooking]);

    if (!total) {
        return (
            <p className="mx-auto max-w-3xl text-center text-neutral-500">
                This recipe has no steps yet.
            </p>
        );
    }

    const upNext = finished
        ? ""
        : current === total - 1
          ? "Last step — almost there!"
          : `Up next: ${steps[current + 1]}`;

    return (
        <div ref={rootRef} className="mx-auto max-w-3xl">
            {/* Cook mode header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    <ChefHat className="h-4 w-4" aria-hidden="true" />
                    Cook mode
                </p>
                <button
                    type="button"
                    onClick={onExitCooking}
                    className="btn-ghost px-3 py-1.5"
                    title="Back to the full recipe (Esc)"
                >
                    <X className="h-4 w-4" /> Exit cook mode
                </button>
            </div>

            {/* Ingredient tray */}
            <section aria-labelledby="ingredients-title" className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <h2
                        id="ingredients-title"
                        className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                        Ingredients
                        {recipe.servings &&
                            ` · ${plural(recipe.servings, "serving")}`}
                    </h2>
                    {!finished && neededNow.size > 0 && (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="h-2 w-2 rounded-full bg-brand-500" />
                            Needed for this step
                        </span>
                    )}
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                    {ingredients.map((item, i) => {
                        const { quantity, name } = splitIngredient(item);
                        const checked = checkedIngredients.has(i);
                        const needed = neededNow.has(i);
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onToggleIngredient(i)}
                                    aria-pressed={checked}
                                    title={
                                        checked
                                            ? "Mark as not ready"
                                            : "Mark as ready"
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                                        needed
                                            ? "border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-500 dark:bg-brand-500/15 dark:text-brand-100"
                                            : checked
                                              ? "border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500"
                                              : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-600"
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
                                    <span
                                        className={`first-letter:uppercase ${checked ? "line-through" : ""}`}
                                    >
                                        {name}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Step stage */}
            <section aria-labelledby="directions-title" className="mt-10">
                <div className="flex items-center justify-between gap-4">
                    <h2 id="directions-title" className="section-title">
                        Directions
                    </h2>
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {finished
                            ? "All steps done"
                            : `Step ${current + 1} of ${total}`}
                    </span>
                </div>

                {/* Progress – click a segment to jump there */}
                <div className="mt-4 flex gap-1.5">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to step ${i + 1}`}
                            aria-current={i === current ? "step" : undefined}
                            className={`h-2 flex-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                                i < current
                                    ? "bg-emerald-500 hover:bg-emerald-400"
                                    : i === current
                                      ? "bg-brand-600"
                                      : "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                            }`}
                        />
                    ))}
                </div>

                <div className="card mt-6 p-6 sm:p-10">
                    {/* Every step (and the finish screen) shares one grid
                        cell, so the card always fits the longest step and the
                        buttons never move */}
                    <div className="grid" aria-live="polite">
                        {steps.map((step, i) => {
                            const active = !finished && i === current;
                            return (
                                <div
                                    key={i}
                                    aria-hidden={!active}
                                    className={`flex gap-5 [grid-area:1/1] ${
                                        active
                                            ? "motion-safe:animate-step-in"
                                            : "invisible"
                                    }`}
                                >
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold tabular-nums text-white">
                                        {i + 1}
                                    </span>
                                    <p className="pt-1.5 text-xl leading-relaxed text-neutral-900 first-letter:uppercase dark:text-neutral-50 sm:text-2xl">
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                        <div
                            aria-hidden={!finished}
                            className={`flex flex-col items-center justify-center text-center [grid-area:1/1] ${
                                finished
                                    ? "motion-safe:animate-step-in"
                                    : "invisible"
                            }`}
                        >
                            <PartyPopper
                                className="h-9 w-9 text-brand-600"
                                aria-hidden="true"
                            />
                            <p className="mt-3 font-display text-3xl font-bold">
                                Enjoy your meal!
                            </p>
                            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                                You've finished all {total} steps. Rate the
                                recipe below.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={() => goTo(current - 1)}
                            disabled={current === 0}
                            className="btn-secondary shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <p className="min-w-0 flex-1 truncate text-center text-sm text-neutral-500 dark:text-neutral-400">
                            {upNext}
                        </p>
                        {finished ? (
                            <button
                                type="button"
                                onClick={() => goTo(0)}
                                className="btn-primary shrink-0"
                            >
                                <RotateCcw className="h-4 w-4" /> Cook it again
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => goTo(current + 1)}
                                className="btn-primary w-36 shrink-0"
                            >
                                {current === total - 1 ? (
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
                        )}
                    </div>
                </div>

                <p className="mt-3 text-center text-xs text-neutral-400">
                    Tip: use ← → to move between steps, Esc to exit
                </p>

                <RecipeTips tips={recipe.tips} />
            </section>
        </div>
    );
};
