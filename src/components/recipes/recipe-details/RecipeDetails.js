import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
    Bookmark,
    Check,
    ChefHat,
    ChevronRight,
    Clock,
    Gauge,
    Globe,
    Heart,
    Link2,
    Pencil,
    Printer,
    SearchX,
    Share2,
    Trash2,
    Users,
} from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { toggleSavedRecipe } from "../../../services/recipeService";
import { getCategoryLabel } from "../../../constants/categories";
import {
    getAverageRating,
    getRecipeDate,
    parseIngredients,
    parseSteps,
    toCategoryArray,
} from "../../../utils/recipe";
import { RecipeImage } from "../../ui/RecipeImage";
import { StarInput, StarRating } from "../../ui/StarRating";
import { Avatar } from "../../ui/Avatar";
import { PageLoader } from "../../ui/Loader";
import { EmptyState } from "../../ui/EmptyState";
import { RecipeGrid } from "../recipe-grid/RecipeGrid";
import { RecipeComments } from "./RecipeComments";

const difficultyStyles = {
    easy: "bg-emerald-600",
    medium: "bg-amber-500",
    hard: "bg-red-600",
};

const plural = (count, word) =>
    `${count} ${word}${Number(count) === 1 ? "" : "s"}`;

const Stat = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col items-center gap-1 px-2 py-4 text-center">
        <Icon
            className="h-5 w-5 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
        />
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {value}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {label}
        </span>
    </div>
);

export const RecipeDetails = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const { recipes, loading, toggleLike, deleteRecipe, rateRecipe } =
        useContext(RecipeContext);

    const [checkedIngredients, setCheckedIngredients] = useState(new Set());
    const [doneSteps, setDoneSteps] = useState(new Set());
    const [actionError, setActionError] = useState("");
    const [linkCopied, setLinkCopied] = useState(false);
    const ratingSectionRef = useRef(null);

    const recipe = recipes.find((r) => r.id === recipeId);
    const author = useUserProfile(recipe?.authorId);

    // Start fresh when moving to another recipe (e.g. via "You might also like")
    useEffect(() => {
        setCheckedIngredients(new Set());
        setDoneSteps(new Set());
        setActionError("");
    }, [recipeId]);

    const similarRecipes = useMemo(() => {
        if (!recipe) return [];
        const categories = toCategoryArray(recipe.categories);
        return recipes
            .filter(
                (r) =>
                    r.id !== recipe.id &&
                    toCategoryArray(r.categories).some((c) =>
                        categories.includes(c)
                    )
            )
            .slice(0, 4);
    }, [recipe, recipes]);

    if (loading) return <PageLoader label="Loading recipe..." />;

    if (!recipe) {
        return (
            <div className="page max-w-2xl">
                <EmptyState
                    icon={SearchX}
                    title="Recipe not found"
                    action={
                        <Link to="/recipes/all" className="btn-primary">
                            Browse recipes
                        </Link>
                    }
                >
                    This recipe may have been removed by its author.
                </EmptyState>
            </div>
        );
    }

    const isOwner = currentUser?.uid === recipe.authorId;
    const isSaved = !!userProfile?.savedRecipes?.includes(recipeId);
    const isLiked = !!(currentUser && recipe.likes?.[currentUser.uid]);
    const averageRating = getAverageRating(recipe.ratings);
    const ratingCount = Object.keys(recipe.ratings || {}).length;
    const ratingBreakdown = Object.values(recipe.ratings || {}).reduce(
        (acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }),
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );
    const userRating = currentUser ? recipe.ratings?.[currentUser.uid] : null;
    const ingredients = parseIngredients(recipe.ingredients);
    const steps = parseSteps(recipe.steps);
    const categories = toCategoryArray(recipe.categories);
    const commentCount = recipe.commentCount || 0;
    const createdAt = getRecipeDate(recipe);
    const authorName = recipe.authorName || author?.username || "A home cook";
    const difficulty = recipe.difficulty || "Easy";

    const toggleInSet = (setter, value) =>
        setter((prev) => {
            const next = new Set(prev);
            next.has(value) ? next.delete(value) : next.add(value);
            return next;
        });

    const requireUser = () => {
        if (currentUser) return true;
        navigate("/auth/sign-in", {
            state: { from: `/recipes/details/${recipeId}` },
        });
        return false;
    };

    const runAction = async (action, message) => {
        setActionError("");
        try {
            await action();
        } catch (error) {
            console.error(message, error);
            setActionError(`${message} Please try again.`);
        }
    };

    const handleLike = () =>
        requireUser() &&
        runAction(
            () => toggleLike(recipeId, currentUser),
            "Couldn't update your like."
        );

    const handleSave = () =>
        requireUser() &&
        runAction(
            () => toggleSavedRecipe(currentUser.uid, recipeId, isSaved),
            "Couldn't update your saved recipes."
        );

    const handleRate = (value) =>
        runAction(
            () => rateRecipe(recipeId, currentUser, value),
            "Couldn't save your rating."
        );

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: recipe.description,
                    url,
                });
            } catch {
                // dismissed by the user
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            setActionError("Couldn't copy the link.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this recipe?"))
            return;
        await runAction(async () => {
            await deleteRecipe(recipeId);
            navigate("/recipes/all");
        }, "Couldn't delete the recipe.");
    };

    const scrollToRating = () =>
        ratingSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

    return (
        <article className="page">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 print:hidden">
                <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                    <li>
                        <Link
                            to="/recipes/all"
                            className="hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            Recipes
                        </Link>
                    </li>
                    {categories[0] && (
                        <li className="flex items-center gap-1">
                            <ChevronRight
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            <Link
                                to={`/recipes/${categories[0]}`}
                                className="hover:text-neutral-900 dark:hover:text-neutral-100"
                            >
                                {getCategoryLabel(categories[0]) ||
                                    categories[0]}
                            </Link>
                        </li>
                    )}
                    <li className="flex min-w-0 items-center gap-1">
                        <ChevronRight
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                        />
                        <span
                            aria-current="page"
                            className="max-w-[16rem] truncate font-medium text-neutral-900 first-letter:uppercase dark:text-neutral-100"
                        >
                            {recipe.title}
                        </span>
                    </li>
                </ol>
            </nav>

            {/* Hero: image + summary */}
            <header className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="relative overflow-hidden rounded-3xl shadow-card">
                    <RecipeImage
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="aspect-[4/3] w-full"
                    />
                    <span
                        className={`badge absolute left-4 top-4 text-white shadow ${
                            difficultyStyles[difficulty.toLowerCase()] ||
                            difficultyStyles.easy
                        }`}
                    >
                        {difficulty}
                    </span>
                </div>

                <div className="flex flex-col">
                    {categories.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                            {categories.map((slug) => (
                                <li key={slug}>
                                    <Link
                                        to={`/recipes/${slug}`}
                                        className="badge bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
                                    >
                                        {getCategoryLabel(slug) || slug}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight first-letter:uppercase sm:text-5xl">
                        {recipe.title}
                    </h1>

                    {/* Author & date */}
                    <div className="mt-5 flex items-center gap-3">
                        <Avatar
                            src={author?.profilePicture}
                            name={authorName}
                            size="sm"
                        />
                        <div className="text-sm leading-tight">
                            {recipe.authorId && author ? (
                                <Link
                                    to={`/profile/${recipe.authorId}`}
                                    className="font-semibold text-neutral-900 hover:text-brand-600 dark:text-neutral-100 dark:hover:text-brand-400"
                                >
                                    {authorName}
                                </Link>
                            ) : (
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {authorName}
                                </span>
                            )}
                            {createdAt && (
                                <p className="mt-0.5 text-neutral-500 dark:text-neutral-400">
                                    Published {format(createdAt, "MMM d, yyyy")}
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="mt-5 text-lg leading-8 text-neutral-600 first-letter:uppercase dark:text-neutral-400">
                        {recipe.description}
                    </p>

                    {/* Rating summary */}
                    <button
                        type="button"
                        onClick={scrollToRating}
                        className="mt-5 inline-flex items-center gap-2 self-start text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 print:hidden"
                    >
                        {ratingCount > 0 ? (
                            <>
                                <StarRating value={averageRating} />
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {averageRating.toFixed(1)}
                                </span>
                                <span>
                                    ({ratingCount}{" "}
                                    {ratingCount === 1 ? "rating" : "ratings"})
                                    · {commentCount}{" "}
                                    {commentCount === 1
                                        ? "comment"
                                        : "comments"}
                                </span>
                            </>
                        ) : (
                            <>
                                <StarRating value={0} />
                                <span>
                                    No ratings yet — be the first to rate
                                </span>
                            </>
                        )}
                    </button>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-4 divide-x divide-neutral-200 rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
                        <Stat
                            icon={Clock}
                            label="Minutes"
                            value={recipe.timeToCook || "—"}
                        />
                        <Stat
                            icon={Users}
                            label="Servings"
                            value={recipe.servings || "—"}
                        />
                        <Stat
                            icon={Gauge}
                            label="Difficulty"
                            value={difficulty}
                        />
                        <Stat
                            icon={Globe}
                            label="Cuisine"
                            value={recipe.cuisine || "—"}
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={handleSave}
                            aria-pressed={isSaved}
                            className={`${isSaved ? "btn-secondary" : "btn-primary"} flex-1 sm:flex-none`}
                        >
                            <Bookmark
                                className={`h-4 w-4 ${isSaved ? "fill-current text-brand-600" : ""}`}
                            />
                            {isSaved ? "Saved" : "Save recipe"}
                        </button>
                        <button
                            type="button"
                            onClick={handleLike}
                            aria-pressed={isLiked}
                            aria-label={
                                isLiked ? "Unlike recipe" : "Like recipe"
                            }
                            className="btn-secondary"
                        >
                            <Heart
                                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {recipe.likeCount || 0}
                        </button>
                        <button
                            type="button"
                            onClick={handleShare}
                            className="btn-secondary"
                            aria-label="Share recipe"
                        >
                            {linkCopied ? (
                                <Link2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                                <Share2 className="h-4 w-4" />
                            )}
                            <span className="hidden sm:inline">
                                {linkCopied ? "Link copied" : "Share"}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="btn-secondary"
                            aria-label="Print recipe"
                        >
                            <Printer className="h-4 w-4" />
                        </button>
                    </div>

                    {isOwner && (
                        <div className="mt-4 flex items-center gap-1 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800 print:hidden">
                            <span className="mr-auto text-neutral-500 dark:text-neutral-400">
                                This is your recipe
                            </span>
                            <Link
                                to={`/recipes/edit/${recipeId}`}
                                className="btn-ghost px-3 py-2"
                            >
                                <Pencil className="h-4 w-4" /> Edit
                            </Link>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn-ghost px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                            >
                                <Trash2 className="h-4 w-4" /> Delete
                            </button>
                        </div>
                    )}

                    {actionError && (
                        <p className="alert-error mt-4">{actionError}</p>
                    )}
                </div>
            </header>

            {/* Ingredients (pinned) | directions + reviews */}
            <div className="mt-16 grid gap-10 border-t border-neutral-200 pt-12 dark:border-neutral-800 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
                <section
                    aria-labelledby="ingredients-title"
                    className="lg:sticky lg:top-24 lg:self-start"
                >
                    <div className="card p-6">
                        <div className="flex items-center justify-between gap-4">
                            <h2
                                id="ingredients-title"
                                className="section-title"
                            >
                                Ingredients
                            </h2>
                            {checkedIngredients.size > 0 ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCheckedIngredients(new Set())
                                    }
                                    className="link text-xs print:hidden"
                                >
                                    Clear
                                </button>
                            ) : (
                                <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                    {plural(ingredients.length, "item")}
                                </span>
                            )}
                        </div>
                        {recipe.servings && (
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                For {plural(recipe.servings, "serving")}
                            </p>
                        )}
                        <ul className="mt-5 divide-y divide-neutral-100 dark:divide-neutral-800">
                            {ingredients.map((item, i) => {
                                const checked = checkedIngredients.has(i);
                                return (
                                    <li key={i}>
                                        <label className="flex cursor-pointer items-start gap-3 py-2.5 text-sm leading-6">
                                            <input
                                                type="checkbox"
                                                className="checkbox mt-1 print:hidden"
                                                checked={checked}
                                                onChange={() =>
                                                    toggleInSet(
                                                        setCheckedIngredients,
                                                        i
                                                    )
                                                }
                                            />
                                            <span
                                                className={`first-letter:uppercase ${
                                                    checked
                                                        ? "text-neutral-400 line-through dark:text-neutral-600"
                                                        : ""
                                                }`}
                                            >
                                                {item}
                                            </span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>

                <div className="min-w-0 space-y-16">
                    <section aria-labelledby="directions-title">
                        <div className="flex items-center justify-between gap-4">
                            <h2 id="directions-title" className="section-title">
                                Directions
                            </h2>
                            <span className="badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 print:hidden">
                                {doneSteps.size} of{" "}
                                {plural(steps.length, "step")} done
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 print:hidden">
                            Tap a step to mark it as done.
                        </p>

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
                                            onClick={() =>
                                                toggleInSet(setDoneSteps, i)
                                            }
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

                        {Array.isArray(recipe.tips) &&
                            recipe.tips.length > 0 && (
                                <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5">
                                    <h3 className="flex items-center gap-2 font-semibold">
                                        <ChefHat
                                            className="h-5 w-5 text-brand-600"
                                            aria-hidden="true"
                                        />
                                        Tips
                                    </h3>
                                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                                        {recipe.tips.map((tip, i) => (
                                            <li key={i}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </section>

                    {/* Reviews: rating summary, your rating, comments */}
                    <section
                        ref={ratingSectionRef}
                        aria-labelledby="reviews-title"
                        className="print:hidden"
                    >
                        <h2 id="reviews-title" className="section-title">
                            Reviews
                        </h2>

                        <div className="card mt-6 divide-y divide-neutral-200 dark:divide-neutral-800">
                            <div className="grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-10">
                                <div className="text-center sm:text-left">
                                    <p className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                        {ratingCount
                                            ? averageRating.toFixed(1)
                                            : "–"}
                                    </p>
                                    <div className="mt-2">
                                        <StarRating value={averageRating} />
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        {ratingCount
                                            ? plural(ratingCount, "rating")
                                            : "No ratings yet"}
                                    </p>
                                </div>
                                <ul
                                    className="space-y-1.5"
                                    aria-label="Rating breakdown"
                                >
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = ratingBreakdown[stars];
                                        const percent = ratingCount
                                            ? (count / ratingCount) * 100
                                            : 0;
                                        return (
                                            <li
                                                key={stars}
                                                className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400"
                                            >
                                                <span className="w-3 text-right">
                                                    {stars}
                                                </span>
                                                <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    <span
                                                        className="block h-full rounded-full bg-amber-400"
                                                        style={{
                                                            width: `${percent}%`,
                                                        }}
                                                    />
                                                </span>
                                                <span className="w-6 tabular-nums">
                                                    {count}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                                <div>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                        {userRating
                                            ? "Your rating"
                                            : "Made this recipe?"}
                                    </p>
                                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                                        {!currentUser
                                            ? "Sign in to rate it and help other cooks."
                                            : userRating
                                              ? "Tap a star to change it."
                                              : "Let others know how it turned out."}
                                    </p>
                                </div>
                                {currentUser ? (
                                    <StarInput
                                        value={userRating}
                                        onChange={handleRate}
                                    />
                                ) : (
                                    <Link
                                        to="/auth/sign-in"
                                        state={{
                                            from: `/recipes/details/${recipeId}`,
                                        }}
                                        className="btn-secondary"
                                    >
                                        Sign in to rate
                                    </Link>
                                )}
                            </div>
                        </div>

                        <RecipeComments recipeId={recipeId} />
                    </section>
                </div>
            </div>

            {/* Similar recipes */}
            {similarRecipes.length > 0 && (
                <section className="mt-20 print:hidden">
                    <h2 className="section-title mb-6">You might also like</h2>
                    <RecipeGrid recipes={similarRecipes} />
                </section>
            )}
        </article>
    );
};
