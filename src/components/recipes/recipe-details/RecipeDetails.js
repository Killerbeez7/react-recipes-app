import { useContext, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
    ArrowLeft,
    Bookmark,
    ChefHat,
    Clock,
    Gauge,
    Globe,
    Heart,
    MessageCircle,
    Pencil,
    Printer,
    SearchX,
    Trash2,
    Users,
} from "lucide-react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { toggleSavedRecipe } from "../../../services/recipeService";
import { getCategoryLabel } from "../../../constants/categories";
import {
    getAverageRating,
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

const timeAgo = (iso) => {
    try {
        return formatDistanceToNow(parseISO(iso), { addSuffix: true });
    } catch {
        return "";
    }
};

const Stat = ({ icon: Icon, label, children }) => (
    <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {label}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {children}
            </p>
        </div>
    </div>
);

export const RecipeDetails = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const {
        recipes,
        loading,
        addComment,
        toggleLike,
        deleteComment,
        editComment,
        deleteRecipe,
        rateRecipe,
    } = useContext(RecipeContext);

    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [actionError, setActionError] = useState("");
    const ratingSectionRef = useRef(null);

    const recipe = recipes.find((r) => r.id === recipeId);

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
    const isSaved = !!userProfile?.savedRecipes?.[recipeId];
    const isLiked = !!(currentUser && recipe.likes?.[currentUser.uid]);
    const averageRating = getAverageRating(recipe.ratings);
    const reviewsCount = Object.keys(recipe.ratings || {}).length;
    const userRating = currentUser ? recipe.ratings?.[currentUser.uid] : null;
    const ingredients = parseIngredients(recipe.ingredients);
    const steps = parseSteps(recipe.steps);
    const categories = toCategoryArray(recipe.categories);
    const comments = Object.entries(recipe.comments || {}).sort(
        ([, a], [, b]) => (a.createdAt || "").localeCompare(b.createdAt || "")
    );

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

    const handleDeleteRecipe = async () => {
        if (!window.confirm("Are you sure you want to delete this recipe?"))
            return;
        await runAction(async () => {
            await deleteRecipe(recipeId);
            navigate("/recipes/all");
        }, "Couldn't delete the recipe.");
    };

    const resetCommentFields = () => {
        setNewComment("");
        setEditCommentId(null);
        setEditCommentText("");
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const text = (editCommentId ? editCommentText : newComment).trim();
        if (!text) return;

        await runAction(async () => {
            if (editCommentId) {
                await editComment(recipeId, editCommentId, { text });
            } else {
                await addComment(recipeId, {
                    text,
                    userId: currentUser.uid,
                    username: currentUser.displayName || currentUser.email,
                    userPhoto: currentUser.photoURL || "",
                });
            }
            resetCommentFields();
        }, "Couldn't save your comment.");
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?"))
            return;
        await runAction(
            () => deleteComment(recipeId, commentId),
            "Couldn't delete the comment."
        );
        resetCommentFields();
    };

    const scrollToRating = () =>
        ratingSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

    return (
        <article className="page max-w-5xl">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-ghost -ml-3 mb-6 px-3 print:hidden"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {/* Header */}
            <header>
                {categories.length > 0 && (
                    <ul className="mb-3 flex flex-wrap gap-2">
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
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {recipe.title}
                </h1>
                <p className="mt-4 max-w-3xl text-lg text-neutral-600 dark:text-neutral-400">
                    {recipe.description}
                </p>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {recipe.authorId && (
                            <Link
                                to={`/profile/${recipe.authorId}`}
                                className="font-medium text-neutral-900 hover:text-brand-600 dark:text-neutral-100 dark:hover:text-brand-400"
                            >
                                By {recipe.authorName || "a home cook"}
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={scrollToRating}
                            className="inline-flex items-center gap-2 hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            <StarRating value={averageRating} />
                            <span>
                                {averageRating.toFixed(1)} · {reviewsCount}{" "}
                                {reviewsCount === 1 ? "rating" : "ratings"}
                            </span>
                        </button>
                        <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />{" "}
                            {comments.length}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 print:hidden">
                        <button
                            type="button"
                            onClick={handleSave}
                            aria-pressed={isSaved}
                            className={
                                isSaved ? "btn-primary" : "btn-secondary"
                            }
                        >
                            <Bookmark
                                className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                            />
                            {isSaved ? "Saved" : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={handleLike}
                            aria-pressed={isLiked}
                            className="btn-secondary"
                        >
                            <Heart
                                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {recipe.likeCount || 0}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="btn-secondary"
                            aria-label="Print recipe"
                        >
                            <Printer className="h-4 w-4" />
                        </button>
                        {isOwner && (
                            <>
                                <Link
                                    to={`/recipes/edit/${recipeId}`}
                                    className="btn-secondary"
                                >
                                    <Pencil className="h-4 w-4" /> Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleDeleteRecipe}
                                    className="btn-danger"
                                >
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {actionError && (
                    <p className="alert-error mt-4">{actionError}</p>
                )}
            </header>

            {/* Hero image */}
            <RecipeImage
                src={recipe.imageUrl}
                alt={recipe.title}
                className="mt-8 aspect-[16/9] w-full rounded-2xl shadow-card"
            />

            {/* Stats */}
            <div className="card mt-8 grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
                <Stat icon={Clock} label="Time">
                    {recipe.timeToCook || "?"} min
                </Stat>
                <Stat icon={Users} label="Servings">
                    {recipe.servings || "?"}
                </Stat>
                <Stat icon={Gauge} label="Difficulty">
                    {recipe.difficulty || "Easy"}
                </Stat>
                <Stat icon={Globe} label="Cuisine">
                    {recipe.cuisine || "—"}
                </Stat>
            </div>

            {/* Ingredients & directions */}
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <section className="card h-fit p-6 lg:sticky lg:top-24">
                    <h2 className="section-title">Ingredients</h2>
                    <ul className="mt-4 space-y-3">
                        {ingredients.map((item, i) => (
                            <li key={i}>
                                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
                                    <input
                                        type="checkbox"
                                        className="checkbox mt-1 print:hidden"
                                    />
                                    <span>{item}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="section-title">Directions</h2>
                    <ol className="mt-4 space-y-6">
                        {steps.map((step, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                                    {i + 1}
                                </span>
                                <p className="pt-1 leading-7">{step}</p>
                            </li>
                        ))}
                    </ol>

                    {Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
                        <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5">
                            <h3 className="flex items-center gap-2 font-semibold">
                                <ChefHat className="h-5 w-5 text-brand-600" />{" "}
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
            </div>

            {/* Rating */}
            <section
                ref={ratingSectionRef}
                className="card mt-12 p-6 print:hidden"
            >
                <h2 className="section-title">Rate this recipe</h2>
                {currentUser ? (
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <StarInput value={userRating} onChange={handleRate} />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {userRating
                                ? `You rated this ${userRating}/5`
                                : "Tap a star to rate"}
                        </span>
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link
                            to="/auth/sign-in"
                            state={{ from: `/recipes/details/${recipeId}` }}
                            className="link"
                        >
                            Sign in
                        </Link>{" "}
                        to rate this recipe.
                    </p>
                )}
            </section>

            {/* Comments */}
            <section className="mt-12 print:hidden">
                <h2 className="section-title">Comments ({comments.length})</h2>

                {currentUser ? (
                    <form
                        onSubmit={handleCommentSubmit}
                        className="mt-6 flex gap-4"
                    >
                        <Avatar
                            src={currentUser.photoURL}
                            name={currentUser.displayName || currentUser.email}
                            size="sm"
                            className="hidden sm:inline-flex"
                        />
                        <div className="flex-1">
                            <label htmlFor="comment" className="sr-only">
                                {editCommentId
                                    ? "Edit your comment"
                                    : "Write a comment"}
                            </label>
                            <textarea
                                id="comment"
                                rows={3}
                                className="input"
                                placeholder="Share your thoughts or tips..."
                                value={
                                    editCommentId ? editCommentText : newComment
                                }
                                onChange={(e) =>
                                    editCommentId
                                        ? setEditCommentText(e.target.value)
                                        : setNewComment(e.target.value)
                                }
                            />
                            <div className="mt-3 flex justify-end gap-2">
                                {editCommentId && (
                                    <button
                                        type="button"
                                        onClick={resetCommentFields}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={
                                        !(
                                            editCommentId
                                                ? editCommentText
                                                : newComment
                                        ).trim()
                                    }
                                >
                                    {editCommentId
                                        ? "Update comment"
                                        : "Post comment"}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                        <Link
                            to="/auth/sign-in"
                            state={{ from: `/recipes/details/${recipeId}` }}
                            className="link"
                        >
                            Sign in
                        </Link>{" "}
                        to join the conversation.
                    </p>
                )}

                {comments.length === 0 ? (
                    <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                        Be the first to comment!
                    </p>
                ) : (
                    <ul className="mt-8 space-y-6">
                        {comments.map(([key, comment]) => (
                            <li key={key} className="flex gap-4">
                                <Link
                                    to={`/profile/${comment.userId}`}
                                    className="shrink-0"
                                >
                                    <Avatar
                                        src={comment.userPhoto}
                                        name={comment.username}
                                        size="sm"
                                    />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <Link
                                            to={`/profile/${comment.userId}`}
                                            className="text-sm font-semibold text-neutral-900 hover:text-brand-600 dark:text-neutral-100 dark:hover:text-brand-400"
                                        >
                                            {comment.username || "Anonymous"}
                                        </Link>
                                        {comment.createdAt && (
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {timeAgo(comment.createdAt)}
                                                {comment.updatedAt &&
                                                    " · edited"}
                                            </span>
                                        )}
                                        {currentUser?.uid ===
                                            comment.userId && (
                                            <span className="ml-auto flex gap-1">
                                                <button
                                                    type="button"
                                                    className="btn-icon h-8 w-8"
                                                    aria-label="Edit comment"
                                                    onClick={() => {
                                                        setEditCommentId(key);
                                                        setEditCommentText(
                                                            comment.text
                                                        );
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon h-8 w-8 hover:text-red-600 dark:hover:text-red-400"
                                                    aria-label="Delete comment"
                                                    onClick={() =>
                                                        handleDeleteComment(key)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                                        {comment.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Similar recipes */}
            {similarRecipes.length > 0 && (
                <section className="mt-16 print:hidden">
                    <h2 className="section-title mb-6">You might also like</h2>
                    <RecipeGrid recipes={similarRecipes} />
                </section>
            )}
        </article>
    );
};
