import { plural, splitIngredient } from "./recipeParts";

// Idea 2 – "Cookbook spread": an open book with two equal pages, so neither
// side pushes the other around. Ingredients use dotted leaders like a
// printed cookbook; the method uses large serif step numbers.
// Warm paper with a soft light falling from the top-left (subtler in dark mode)
const paper =
    "bg-[#fbf6ec] text-stone-800 dark:bg-[#1d1915] dark:text-stone-200 " +
    "bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.6),transparent_45%)] " +
    "dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.04),transparent_45%)]";

const PageNumber = ({ children }) => (
    <p className="mt-10 text-center font-display text-sm italic text-stone-400 dark:text-stone-500">
        — {children} —
    </p>
);

export const CookbookLayout = ({
    recipe,
    ingredients,
    steps,
    checkedIngredients,
    onToggleIngredient,
    doneSteps,
    onToggleStep,
}) => (
    <div className="mx-auto max-w-5xl">
        <div
            className={`relative grid overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-black/5 dark:ring-white/5 md:grid-cols-2 ${paper}`}
        >
            {/* The fold between the pages */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent md:block dark:via-black/40"
            />

            {/* Left page: ingredients */}
            <section
                aria-labelledby="ingredients-title"
                className="flex flex-col px-10 py-12 lg:px-14"
            >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-400">
                    Mise en place
                </p>
                <h2
                    id="ingredients-title"
                    className="mt-2 font-display text-4xl font-bold text-stone-900 dark:text-stone-50"
                >
                    Ingredients
                </h2>
                {recipe.servings && (
                    <p className="mt-2 font-display italic text-stone-500 dark:text-stone-400">
                        Serves {recipe.servings}
                    </p>
                )}

                <ul className="mt-8 flex-1 space-y-1">
                    {ingredients.map((item, i) => {
                        const { quantity, name } = splitIngredient(item);
                        const checked = checkedIngredients.has(i);
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onToggleIngredient(i)}
                                    aria-pressed={checked}
                                    className={`flex w-full items-baseline gap-2 rounded py-1.5 text-left transition-opacity ${
                                        checked
                                            ? "opacity-40"
                                            : "hover:opacity-80"
                                    }`}
                                >
                                    <span
                                        className={`first-letter:uppercase ${checked ? "line-through" : ""}`}
                                    >
                                        {name}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="min-w-[1.5rem] flex-1 translate-y-[-0.2em] border-b border-dotted border-stone-400/70 dark:border-stone-600"
                                    />
                                    <span className="whitespace-nowrap font-display font-semibold text-stone-900 dark:text-stone-50">
                                        {quantity || "to taste"}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
                    <aside className="mt-10 border-l-2 border-brand-400 pl-4 font-display italic text-stone-600 dark:text-stone-400">
                        <p className="text-xs font-semibold uppercase not-italic tracking-[0.2em] text-brand-700 dark:text-brand-400">
                            Chef's note
                        </p>
                        {recipe.tips.map((tip, i) => (
                            <p key={i} className="mt-2">
                                {tip}
                            </p>
                        ))}
                    </aside>
                )}
                <PageNumber>
                    {plural(ingredients.length, "ingredient")}
                </PageNumber>
            </section>

            {/* Right page: method */}
            <section
                aria-labelledby="directions-title"
                className="flex flex-col border-t border-stone-300/60 px-10 py-12 dark:border-stone-700/60 md:border-t-0 lg:px-14"
            >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-400">
                    Method
                </p>
                <h2
                    id="directions-title"
                    className="mt-2 font-display text-4xl font-bold text-stone-900 dark:text-stone-50"
                >
                    Directions
                </h2>
                <p className="mt-2 font-display italic text-stone-500 dark:text-stone-400">
                    {recipe.timeToCook
                        ? `About ${recipe.timeToCook} minutes`
                        : "Take your time"}
                </p>

                <ol className="mt-8 flex-1 space-y-5">
                    {steps.map((step, i) => {
                        const done = doneSteps.has(i);
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onToggleStep(i)}
                                    aria-pressed={done}
                                    className={`flex w-full gap-4 text-left transition-opacity ${
                                        done ? "opacity-40" : "hover:opacity-80"
                                    }`}
                                >
                                    <span className="w-8 shrink-0 font-display text-3xl font-bold leading-none text-brand-600 dark:text-brand-400">
                                        {i + 1}
                                    </span>
                                    <span
                                        className={`leading-7 first-letter:uppercase ${done ? "line-through" : ""}`}
                                    >
                                        {step}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
                <PageNumber>{plural(steps.length, "step")}</PageNumber>
            </section>
        </div>
        <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Tap an ingredient or step to cross it off.
        </p>
    </div>
);
