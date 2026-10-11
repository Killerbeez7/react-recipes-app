import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ImagePlus } from "lucide-react";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../../contexts/AuthContext";
import { CATEGORIES, DIFFICULTIES } from "../../../constants/categories";
import {
    parseIngredients,
    parseSteps,
    toCategoryArray,
} from "../../../utils/recipe";
import { Spinner } from "../../ui/Loader";

const isValidUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const toFormValues = (recipe = {}) => ({
    title: recipe.title || "",
    description: recipe.description || "",
    cuisine: recipe.cuisine || "",
    difficulty: recipe.difficulty || "",
    timeToCook: recipe.timeToCook ?? "",
    servings: recipe.servings ?? "",
    ingredients: parseIngredients(recipe.ingredients).join("\n"),
    steps: parseSteps(recipe.steps).join("\n"),
    imageUrl: recipe.imageUrl || "",
});

const validate = (values, categories, imageFile) => {
    const errors = {};
    if (!values.title.trim()) errors.title = "Title is required.";
    if (!values.description.trim())
        errors.description = "Description is required.";
    if (!values.cuisine.trim()) errors.cuisine = "Cuisine is required.";
    if (!values.difficulty) errors.difficulty = "Choose a difficulty.";
    if (!(Number(values.timeToCook) > 0))
        errors.timeToCook = "Enter a positive number of minutes.";
    if (!(Number(values.servings) > 0))
        errors.servings = "Enter a positive number of servings.";
    if (!values.ingredients.trim())
        errors.ingredients = "Add at least one ingredient.";
    if (!values.steps.trim()) errors.steps = "Add at least one step.";
    if (!imageFile && !values.imageUrl.trim())
        errors.image = "Upload an image or paste an image URL.";
    else if (!imageFile && !isValidUrl(values.imageUrl.trim()))
        errors.image = "Please enter a valid image URL (http/https).";
    if (categories.length === 0)
        errors.categories = "Pick at least one category.";
    return errors;
};

const Field = ({ id, label, error, hint, className = "", children }) => (
    <div className={className}>
        <label htmlFor={id} className="label">
            {label}
        </label>
        {children}
        {error ? (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {error}
            </p>
        ) : (
            hint && <p className="hint">{hint}</p>
        )}
    </div>
);

export const RecipeForm = ({
    initialRecipe,
    onSubmit,
    submitLabel = "Save recipe",
    cancelTo = "/recipes/all",
}) => {
    const { currentUser } = useAuth();
    const [values, setValues] = useState(() => toFormValues(initialRecipe));
    const [categories, setCategories] = useState(() =>
        toCategoryArray(initialRecipe?.categories)
    );
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(initialRecipe?.imageUrl || "");
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Preview a chosen file, otherwise the typed URL
    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(isValidUrl(values.imageUrl) ? values.imageUrl : "");
    }, [imageFile, values.imageUrl]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const toggleCategory = (slug) => {
        setCategories((prev) =>
            prev.includes(slug)
                ? prev.filter((c) => c !== slug)
                : [...prev, slug]
        );
        setErrors((prev) => ({ ...prev, categories: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const validationErrors = validate(values, categories, imageFile);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            let imageUrl = values.imageUrl.trim();
            if (imageFile) {
                const fileRef = storageRef(
                    storage,
                    `recipesPictures/${currentUser.uid}/${Date.now()}-${imageFile.name}`
                );
                await uploadBytes(fileRef, imageFile);
                imageUrl = await getDownloadURL(fileRef);
            }

            await onSubmit({
                title: values.title.trim(),
                description: values.description.trim(),
                cuisine: values.cuisine.trim(),
                difficulty: values.difficulty,
                timeToCook: Number(values.timeToCook),
                servings: Number(values.servings),
                ingredients: parseIngredients(values.ingredients).join("\n"),
                steps: parseSteps(values.steps).join("\n"),
                imageUrl,
                categories,
            });
        } catch (error) {
            console.error("Error saving recipe:", error);
            setSubmitError(
                "There was an error saving the recipe. Please try again."
            );
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="card space-y-8 p-6 sm:p-8"
        >
            {/* Basics */}
            <section className="grid gap-6 sm:grid-cols-2">
                <Field
                    id="title"
                    label="Title"
                    error={errors.title}
                    className="sm:col-span-2"
                >
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="input"
                        placeholder="e.g. Creamy mushroom risotto"
                        value={values.title}
                        onChange={changeHandler}
                    />
                </Field>
                <Field
                    id="description"
                    label="Description"
                    error={errors.description}
                    className="sm:col-span-2"
                >
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="input"
                        placeholder="A short summary of the dish"
                        value={values.description}
                        onChange={changeHandler}
                    />
                </Field>
                <Field id="cuisine" label="Cuisine" error={errors.cuisine}>
                    <input
                        id="cuisine"
                        name="cuisine"
                        type="text"
                        className="input"
                        placeholder="e.g. Italian"
                        value={values.cuisine}
                        onChange={changeHandler}
                    />
                </Field>
                <Field
                    id="difficulty"
                    label="Difficulty"
                    error={errors.difficulty}
                >
                    <select
                        id="difficulty"
                        name="difficulty"
                        className="input"
                        value={values.difficulty}
                        onChange={changeHandler}
                    >
                        <option value="">Select difficulty</option>
                        {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field
                    id="timeToCook"
                    label="Time to cook (minutes)"
                    error={errors.timeToCook}
                >
                    <input
                        id="timeToCook"
                        name="timeToCook"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        className="input"
                        placeholder="30"
                        value={values.timeToCook}
                        onChange={changeHandler}
                    />
                </Field>
                <Field id="servings" label="Servings" error={errors.servings}>
                    <input
                        id="servings"
                        name="servings"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        className="input"
                        placeholder="4"
                        value={values.servings}
                        onChange={changeHandler}
                    />
                </Field>
            </section>

            {/* Ingredients & steps */}
            <section className="grid gap-6 lg:grid-cols-2">
                <Field
                    id="ingredients"
                    label="Ingredients"
                    hint="One ingredient per line."
                    error={errors.ingredients}
                >
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        rows={8}
                        className="input"
                        placeholder={
                            "200 g arborio rice\n1 onion, finely chopped\n..."
                        }
                        value={values.ingredients}
                        onChange={changeHandler}
                    />
                </Field>
                <Field
                    id="steps"
                    label="Directions"
                    hint="One step per line."
                    error={errors.steps}
                >
                    <textarea
                        id="steps"
                        name="steps"
                        rows={8}
                        className="input"
                        placeholder={
                            "Sauté the onion until soft.\nAdd the rice and toast for 2 minutes.\n..."
                        }
                        value={values.steps}
                        onChange={changeHandler}
                    />
                </Field>
            </section>

            {/* Image */}
            <section>
                <span className="label">Image</span>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50 sm:w-56">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Recipe preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <ImagePlus
                                className="h-10 w-10 text-neutral-400"
                                aria-hidden="true"
                            />
                        )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <label
                                htmlFor="file-upload"
                                className="btn-secondary cursor-pointer"
                            >
                                <ImagePlus className="h-4 w-4" /> Upload image
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                    setImageFile(e.target.files?.[0] || null);
                                    setErrors((prev) => ({
                                        ...prev,
                                        image: undefined,
                                    }));
                                }}
                            />
                            {imageFile && (
                                <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <span className="max-w-[14rem] truncate">
                                        {imageFile.name}
                                    </span>
                                    <button
                                        type="button"
                                        className="link text-xs"
                                        onClick={() => setImageFile(null)}
                                    >
                                        Remove
                                    </button>
                                </span>
                            )}
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="sr-only">
                                Image URL
                            </label>
                            <input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                className="input"
                                placeholder="…or paste an image URL"
                                value={values.imageUrl}
                                onChange={(e) => {
                                    changeHandler(e);
                                    setErrors((prev) => ({
                                        ...prev,
                                        image: undefined,
                                    }));
                                }}
                                disabled={!!imageFile}
                            />
                        </div>
                        {errors.image && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                {errors.image}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section>
                <span className="label">Categories</span>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ slug, label }) => {
                        const selected = categories.includes(slug);
                        return (
                            <button
                                key={slug}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => toggleCategory(slug)}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                                    selected
                                        ? "border-brand-600 bg-brand-600 text-white"
                                        : "border-neutral-300 bg-white text-neutral-700 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
                                }`}
                            >
                                {selected && <Check className="h-3.5 w-3.5" />}
                                {label}
                            </button>
                        );
                    })}
                </div>
                {errors.categories && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                        {errors.categories}
                    </p>
                )}
            </section>

            {submitError && <p className="alert-error">{submitError}</p>}
            {Object.values(errors).some(Boolean) && (
                <p className="alert-error">
                    Please fix the highlighted fields above.
                </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row sm:justify-end">
                <Link to={cancelTo} className="btn-secondary">
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Spinner className="h-4 w-4" />}
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
};
