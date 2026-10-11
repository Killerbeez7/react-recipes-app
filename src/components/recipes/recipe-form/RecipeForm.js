import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Circle, Minus, Plus, RotateCcw } from "lucide-react";
import { isStoredImage, uploadImage } from "../../../services/imageService";
import { useAuth } from "../../../contexts/AuthContext";
import {
    CATEGORIES,
    CUISINES,
    DIFFICULTIES,
} from "../../../constants/categories";
import {
    parseIngredients,
    parseSteps,
    toCategoryArray,
} from "../../../utils/recipe";
import { Spinner } from "../../ui/Loader";
import { RecipeItem } from "../recipe-item/RecipeItem";
import { ListEditor } from "./ListEditor";
import { ImageField, isValidImageUrl } from "./ImageField";

const DESCRIPTION_MAX = 200;

// ------------------------------------------------------------------ state helpers

const toFormState = (recipe = {}) => ({
    title: recipe.title || "",
    description: recipe.description || "",
    cuisine: recipe.cuisine || "",
    difficulty: recipe.difficulty || "",
    timeToCook: recipe.timeToCook ? String(recipe.timeToCook) : "",
    servings: recipe.servings ? String(recipe.servings) : "",
    imageUrl: recipe.imageUrl || "",
    ingredients: withEmptyRow(parseIngredients(recipe.ingredients)),
    steps: withEmptyRow(parseSteps(recipe.steps)),
    tips: withEmptyRow(Array.isArray(recipe.tips) ? recipe.tips : []),
    categories: toCategoryArray(recipe.categories),
});

function withEmptyRow(list) {
    return list.length ? list : [""];
}

const clean = (list) => list.map((item) => item.trim()).filter(Boolean);

const isEmptyForm = (form) =>
    !form.title &&
    !form.description &&
    !form.cuisine &&
    !form.difficulty &&
    !form.timeToCook &&
    !form.servings &&
    !form.imageUrl &&
    !clean(form.ingredients).length &&
    !clean(form.steps).length &&
    !clean(form.tips).length &&
    !form.categories.length;

const readDraft = (key) => {
    try {
        const raw = key && localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const validate = (form, imageFile) => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Give your recipe a title.";
    if (!form.description.trim())
        errors.description = "Add a short description.";
    if (!form.cuisine.trim()) errors.cuisine = "Which cuisine is it?";
    if (!form.difficulty) errors.difficulty = "Choose a difficulty.";
    if (!(Number(form.timeToCook) > 0))
        errors.timeToCook = "Enter the cooking time in minutes.";
    if (!(Number(form.servings) > 0))
        errors.servings = "How many people does it serve?";
    if (!imageFile && !form.imageUrl.trim())
        errors.image = "Add a photo of the dish.";
    else if (
        !imageFile &&
        !isStoredImage(form.imageUrl) &&
        !isValidImageUrl(form.imageUrl.trim())
    )
        errors.image =
            "That image link doesn't look right (it should start with https://).";
    if (!clean(form.ingredients).length)
        errors.ingredients = "Add at least one ingredient.";
    if (!clean(form.steps).length) errors.steps = "Add at least one step.";
    if (!form.categories.length)
        errors.categories = "Pick at least one category.";
    return errors;
};

// Where to scroll/focus for each error, in page order
const errorTargets = [
    ["title", "title"],
    ["description", "description"],
    ["cuisine", "cuisine"],
    ["difficulty", "difficulty"],
    ["timeToCook", "timeToCook"],
    ["servings", "servings"],
    ["image", "recipe-image"],
    ["ingredients", "ingredients-0"],
    ["steps", "steps-0"],
    ["categories", "categories"],
];

// Turn Firebase errors into something the user (and we) can act on
const describeSaveError = (stage, error) => {
    const code = error?.code || "unknown";
    const reasons = {
        "storage/unauthorized":
            "Photo upload was blocked by Firebase Storage permissions.",
        "storage/unauthenticated":
            "Your session expired — please sign in again.",
        "storage/quota-exceeded":
            "Photo storage quota is exceeded on the Firebase plan.",
        "storage/retry-limit-exceeded":
            "The photo upload timed out. Check your connection.",
        "storage/canceled": "The photo upload was cancelled.",
        "permission-denied":
            "The database rejected the save (permission denied).",
        unauthenticated: "Your session expired — please sign in again.",
        unavailable: "You seem to be offline. Check your connection.",
        "invalid-argument": "Some recipe data was invalid.",
        "image/too-large":
            "The photo is too large even after compressing. Try a smaller one.",
    };
    const what = stage === "upload" ? "upload the photo" : "save the recipe";
    return `Couldn't ${what}. ${reasons[code] || "Please try again."} (${code})`;
};

// ------------------------------------------------------------------ UI pieces

const Section = ({ number, title, description, optional, children }) => (
    <section className="card p-6 sm:p-8">
        <div className="mb-6 flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {number}
            </span>
            <div>
                <h2 className="text-lg font-semibold">
                    {title}
                    {optional && (
                        <span className="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                            Optional
                        </span>
                    )}
                </h2>
                {description && (
                    <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
        {children}
    </section>
);

const FieldError = ({ children }) =>
    children ? (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {children}
        </p>
    ) : null;

const errorRing = (hasError) =>
    hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500/70"
        : "";

// ------------------------------------------------------------------ form

export const RecipeForm = ({
    initialRecipe,
    onSubmit,
    submitLabel = "Save recipe",
    cancelTo = "/recipes/all",
    draftKey,
}) => {
    const { currentUser } = useAuth();

    const [draftRestored] = useState(() => !!readDraft(draftKey));
    const [form, setForm] = useState(
        () => readDraft(draftKey) || toFormState(initialRecipe)
    );
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);
    const [filePreview, setFilePreview] = useState("");
    const submittedRef = useRef(false);
    // Remember the uploaded photo so a retry after a failed save reuses it
    const uploadedRef = useRef({ file: null, ref: "" });

    useEffect(() => {
        if (!imageFile) {
            setFilePreview("");
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setFilePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    // Autosave new recipes as a draft (the image file can't be stored)
    useEffect(() => {
        if (!draftKey || submittedRef.current) return;
        const timeoutId = setTimeout(() => {
            if (submittedRef.current) return;
            try {
                if (isEmptyForm(form)) {
                    localStorage.removeItem(draftKey);
                    setDraftSaved(false);
                } else {
                    localStorage.setItem(draftKey, JSON.stringify(form));
                    setDraftSaved(true);
                }
            } catch {}
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [form, draftKey]);

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const onInput = (e) => set(e.target.name, e.target.value);

    const stepServings = (delta) => {
        setForm((prev) => ({
            ...prev,
            servings: String(Math.max(1, (Number(prev.servings) || 0) + delta)),
        }));
        setErrors((prev) => ({ ...prev, servings: undefined }));
    };

    const toggleCategory = (slug) =>
        set(
            "categories",
            form.categories.includes(slug)
                ? form.categories.filter((c) => c !== slug)
                : [...form.categories, slug]
        );

    const startOver = () => {
        if (!window.confirm("Clear the form and discard this draft?")) return;
        try {
            localStorage.removeItem(draftKey);
        } catch {}
        setForm(toFormState());
        setImageFile(null);
        setErrors({});
        setDraftSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const validationErrors = validate(form, imageFile);
        setErrors(validationErrors);
        const firstError = errorTargets.find(([key]) => validationErrors[key]);
        if (firstError) {
            const el = document.getElementById(firstError[1]);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            el?.focus({ preventScroll: true });
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        let stage = "upload";
        try {
            let imageUrl = form.imageUrl.trim();
            if (imageFile) {
                if (uploadedRef.current.file !== imageFile) {
                    uploadedRef.current = {
                        file: imageFile,
                        ref: await uploadImage(imageFile, currentUser.uid),
                    };
                }
                imageUrl = uploadedRef.current.ref;
            }

            stage = "save";
            submittedRef.current = true;
            await onSubmit({
                title: form.title.trim(),
                description: form.description.trim(),
                cuisine: form.cuisine.trim(),
                difficulty: form.difficulty,
                timeToCook: Number(form.timeToCook),
                servings: Number(form.servings),
                ingredients: clean(form.ingredients).join("\n"),
                steps: clean(form.steps).join("\n"),
                tips: clean(form.tips),
                imageUrl,
                categories: form.categories,
            });

            if (draftKey) {
                try {
                    localStorage.removeItem(draftKey);
                } catch {}
            }
        } catch (error) {
            console.error(`Recipe ${stage} failed:`, error);
            submittedRef.current = false;
            setSubmitError(describeSaveError(stage, error));
            setIsSubmitting(false);
        }
    };

    // Live preview + checklist
    const ingredientCount = clean(form.ingredients).length;
    const stepCount = clean(form.steps).length;
    const hasImage =
        !!imageFile ||
        isStoredImage(form.imageUrl) ||
        isValidImageUrl(form.imageUrl);
    const previewImage = imageFile ? filePreview : form.imageUrl;
    const checklist = [
        { label: "Title", done: !!form.title.trim() },
        { label: "Description", done: !!form.description.trim() },
        {
            label: "Details",
            done:
                !!form.cuisine.trim() &&
                !!form.difficulty &&
                Number(form.timeToCook) > 0 &&
                Number(form.servings) > 0,
        },
        { label: "Photo", done: hasImage },
        {
            label: ingredientCount
                ? `${ingredientCount} ingredient${ingredientCount === 1 ? "" : "s"}`
                : "Ingredients",
            done: ingredientCount > 0,
        },
        {
            label: stepCount
                ? `${stepCount} step${stepCount === 1 ? "" : "s"}`
                : "Directions",
            done: stepCount > 0,
        },
        { label: "Category", done: form.categories.length > 0 },
    ];
    const doneCount = checklist.filter((item) => item.done).length;

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
        >
            <div className="min-w-0 space-y-6">
                {draftRestored && draftKey && !isEmptyForm(form) && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-200">
                        <span>
                            We restored your unfinished draft.
                            {!hasImage &&
                                " You'll need to add the photo again."}
                        </span>
                        <button
                            type="button"
                            onClick={startOver}
                            className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                        >
                            <RotateCcw className="h-3.5 w-3.5" /> Start over
                        </button>
                    </div>
                )}

                {/* 1. Basics */}
                <Section
                    number={1}
                    title="The basics"
                    description="What are you cooking, and how long does it take?"
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="title" className="label">
                                Recipe title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                className={`input text-base ${errorRing(errors.title)}`}
                                placeholder="e.g. Creamy mushroom risotto"
                                value={form.title}
                                onChange={onInput}
                            />
                            <FieldError>{errors.title}</FieldError>
                        </div>

                        <div className="sm:col-span-2">
                            <div className="flex items-baseline justify-between">
                                <label htmlFor="description" className="label">
                                    Short description
                                </label>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {form.description.length}/{DESCRIPTION_MAX}
                                </span>
                            </div>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                maxLength={DESCRIPTION_MAX}
                                className={`input ${errorRing(errors.description)}`}
                                placeholder="What makes this dish special? It appears on the recipe card."
                                value={form.description}
                                onChange={onInput}
                            />
                            <FieldError>{errors.description}</FieldError>
                        </div>

                        <div>
                            <label htmlFor="cuisine" className="label">
                                Cuisine
                            </label>
                            <input
                                id="cuisine"
                                name="cuisine"
                                type="text"
                                list="cuisine-options"
                                className={`input ${errorRing(errors.cuisine)}`}
                                placeholder="e.g. Italian"
                                value={form.cuisine}
                                onChange={onInput}
                            />
                            <datalist id="cuisine-options">
                                {CUISINES.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                            <FieldError>{errors.cuisine}</FieldError>
                        </div>

                        <div>
                            <span className="label" id="difficulty-label">
                                Difficulty
                            </span>
                            <div
                                id="difficulty"
                                role="radiogroup"
                                aria-labelledby="difficulty-label"
                                tabIndex={-1}
                                className={`grid grid-cols-3 gap-1 rounded-lg border bg-neutral-50 p-1 shadow-sm focus:outline-none dark:bg-neutral-950 ${
                                    errors.difficulty
                                        ? "border-red-400 dark:border-red-500/70"
                                        : "border-neutral-300 dark:border-neutral-700"
                                }`}
                            >
                                {DIFFICULTIES.map((level) => {
                                    const selected = form.difficulty === level;
                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            role="radio"
                                            aria-checked={selected}
                                            onClick={() =>
                                                set("difficulty", level)
                                            }
                                            className={`rounded-md py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                                                selected
                                                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700"
                                                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                            }`}
                                        >
                                            {level}
                                        </button>
                                    );
                                })}
                            </div>
                            <FieldError>{errors.difficulty}</FieldError>
                        </div>

                        <div>
                            <label htmlFor="timeToCook" className="label">
                                Total time
                            </label>
                            <div className="relative">
                                <input
                                    id="timeToCook"
                                    name="timeToCook"
                                    type="number"
                                    min="1"
                                    inputMode="numeric"
                                    className={`input no-spinner pr-14 ${errorRing(errors.timeToCook)}`}
                                    placeholder="30"
                                    value={form.timeToCook}
                                    onChange={onInput}
                                />
                                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400">
                                    min
                                </span>
                            </div>
                            <FieldError>{errors.timeToCook}</FieldError>
                        </div>

                        <div>
                            <label htmlFor="servings" className="label">
                                Servings
                            </label>
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={() => stepServings(-1)}
                                    aria-label="Fewer servings"
                                    className="flex w-11 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <input
                                    id="servings"
                                    name="servings"
                                    type="number"
                                    min="1"
                                    inputMode="numeric"
                                    className={`input no-spinner rounded-none text-center ${errorRing(errors.servings)}`}
                                    placeholder="4"
                                    value={form.servings}
                                    onChange={onInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => stepServings(1)}
                                    aria-label="More servings"
                                    className="flex w-11 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-neutral-300 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <FieldError>{errors.servings}</FieldError>
                        </div>
                    </div>
                </Section>

                {/* 2. Photo */}
                <Section
                    number={2}
                    title="Photo"
                    description="A good photo is the first thing people notice."
                >
                    <ImageField
                        file={imageFile}
                        url={form.imageUrl}
                        onFileChange={(file) => {
                            setImageFile(file);
                            setErrors((prev) => ({
                                ...prev,
                                image: undefined,
                            }));
                        }}
                        onUrlChange={(url) => {
                            set("imageUrl", url);
                            setErrors((prev) => ({
                                ...prev,
                                image: undefined,
                            }));
                        }}
                    />
                    <FieldError>{errors.image}</FieldError>
                </Section>

                {/* 3. Ingredients */}
                <Section
                    number={3}
                    title="Ingredients"
                    description="One per line, with amounts. Press Enter for the next one — or paste a whole list."
                >
                    <ListEditor
                        id="ingredients"
                        items={form.ingredients}
                        onChange={(items) => set("ingredients", items)}
                        placeholder="e.g. 200 g arborio rice"
                        addLabel="Add ingredient"
                    />
                    <FieldError>{errors.ingredients}</FieldError>
                </Section>

                {/* 4. Directions */}
                <Section
                    number={4}
                    title="Directions"
                    description="Walk through it step by step. Press Enter to start the next step."
                >
                    <ListEditor
                        id="steps"
                        items={form.steps}
                        onChange={(items) => set("steps", items)}
                        placeholder="e.g. Sauté the onion in butter until soft, about 5 minutes."
                        addLabel="Add step"
                        numbered
                        multiline
                    />
                    <FieldError>{errors.steps}</FieldError>
                </Section>

                {/* 5. Categories */}
                <Section
                    number={5}
                    title="Categories"
                    description="Help people find your recipe. Pick all that apply."
                >
                    <div
                        id="categories"
                        tabIndex={-1}
                        className="flex flex-wrap gap-2 focus:outline-none"
                    >
                        {CATEGORIES.map(({ slug, label }) => {
                            const selected = form.categories.includes(slug);
                            return (
                                <button
                                    key={slug}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => toggleCategory(slug)}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                                        selected
                                            ? "border-brand-600 bg-brand-600 text-white"
                                            : "border-neutral-300 bg-white text-neutral-700 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
                                    }`}
                                >
                                    {selected && (
                                        <Check className="h-3.5 w-3.5" />
                                    )}
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    <FieldError>{errors.categories}</FieldError>
                </Section>

                {/* 6. Tips */}
                <Section
                    number={6}
                    title="Tips"
                    optional
                    description="Substitutions, make-ahead advice or serving ideas."
                >
                    <ListEditor
                        id="tips"
                        items={form.tips}
                        onChange={(items) => set("tips", items)}
                        placeholder="e.g. Use day-old rice for a better texture."
                        addLabel="Add tip"
                    />
                </Section>

                {submitError && <p className="alert-error">{submitError}</p>}

                {/* Action bar stays visible while scrolling the form */}
                <div className="sticky bottom-0 z-20 -mx-4 sm:bottom-4 sm:mx-0">
                    <div className="flex items-center gap-3 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.15)] dark:border-neutral-800 dark:bg-neutral-900 sm:rounded-2xl sm:border sm:px-5 sm:shadow-card-hover">
                        <div className="mr-auto hidden items-center gap-4 text-sm sm:flex">
                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <span
                                        className="block h-full rounded-full bg-brand-600 transition-all"
                                        style={{
                                            width: `${(doneCount / checklist.length) * 100}%`,
                                        }}
                                    />
                                </span>
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                    {doneCount}/{checklist.length} complete
                                </span>
                            </span>
                            {draftKey && (
                                <span
                                    className={`inline-flex items-center gap-1 text-neutral-500 transition-opacity duration-300 dark:text-neutral-400 ${
                                        draftSaved ? "opacity-100" : "opacity-0"
                                    }`}
                                    aria-live="polite"
                                >
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    {draftSaved ? "Draft saved" : ""}
                                </span>
                            )}
                        </div>
                        <Link
                            to={cancelTo}
                            className="btn-secondary flex-1 sm:flex-none"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn-primary flex-1 sm:flex-none"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner className="h-4 w-4" />}
                            {isSubmitting ? "Saving..." : submitLabel}
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview & checklist */}
            <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Card preview
                        </p>
                        <RecipeItem
                            preview
                            recipe={{
                                title: form.title || "Your recipe title",
                                description:
                                    form.description ||
                                    "A short description of your dish appears here.",
                                imageUrl: hasImage ? previewImage : "",
                                difficulty: form.difficulty || "Easy",
                                timeToCook: form.timeToCook,
                                servings: form.servings,
                                likeCount: 0,
                            }}
                        />
                    </div>

                    <div className="card p-5">
                        <div className="flex items-baseline justify-between">
                            <p className="text-sm font-semibold">Checklist</p>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {doneCount}/{checklist.length}
                            </span>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                            <div
                                className="h-full rounded-full bg-brand-600 transition-all"
                                style={{
                                    width: `${(doneCount / checklist.length) * 100}%`,
                                }}
                            />
                        </div>
                        <ul className="mt-4 space-y-2 text-sm">
                            {checklist.map(({ label, done }) => (
                                <li
                                    key={label}
                                    className="flex items-center gap-2"
                                >
                                    {done ? (
                                        <Check className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-neutral-300 dark:text-neutral-600" />
                                    )}
                                    <span
                                        className={
                                            done
                                                ? "text-neutral-900 dark:text-neutral-100"
                                                : "text-neutral-500 dark:text-neutral-400"
                                        }
                                    >
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
        </form>
    );
};
