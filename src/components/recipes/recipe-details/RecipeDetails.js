import { useContext, useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { addRecipeToFavorites } from "../../../services/recipeService";
import { ScrollToTopButton } from "../../utils/scroll-to-top-button/ScrollToTopButton";

import styles from "./RecipeDetails.module.css";

export const RecipeDetails = () => {
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [reviewsCount, setReviewsCount] = useState(0);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const { recipeId } = useParams();
    const { currentUser } = useAuth();
    const {
        recipes,
        addComment,
        toggleLike,
        deleteComment,
        editComment,
        deleteRecipe,
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        rateRecipe,
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } = useContext(RecipeContext);

    const ratingSectionRef = useRef(null);

    const navigate = useNavigate();
    const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);

    const [isSaved, setIsSaved] = useState(
        !!currentUser?.savedRecipes?.[recipeId]
    );
    const [isLiked, setIsLiked] = useState(false);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const computeAverageRating = (ratingsObj) => {
        if (!ratingsObj) return 0;
        const allRatings = Object.values(ratingsObj);
        if (allRatings.length === 0) return 0;
        const sum = allRatings.reduce((acc, val) => acc + val, 0);
        return sum / allRatings.length;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setLoading(!currentRecipe);
        if (currentRecipe && currentUser) {
            setIsLiked(!!currentRecipe.likes?.[currentUser.uid]);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const avg = computeAverageRating(currentRecipe.ratings);
            setAverageRating(avg);
            setUserRating(currentRecipe.ratings?.[currentUser.uid] || null);
            const ratingCount = currentRecipe.ratings
                ? Object.keys(currentRecipe.ratings).length
                : 0;
            setReviewsCount(ratingCount);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }, [currentRecipe, currentUser]);

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (!currentRecipe)
        return <p className={styles.notFound}>Recipe not found.</p>;

    const handleLike = () => {
        if (!currentUser) {
            alert("You need to log in to like recipes.");
            return;
        }
        toggleLike(recipeId, currentUser);
        setIsLiked((prev) => !prev);
    };

    const handleSaveRecipe = async () => {
        if (!currentUser) {
            alert("You need to log in to save recipes.");
            return;
        }
        try {
            await addRecipeToFavorites(currentUser.uid, recipeId, isSaved);
            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    const handleDeleteRecipe = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            deleteRecipe(recipeId).then(() => navigate("/recipes/all"));
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleRateRecipe = async (value) => {
        if (!currentUser) {
            alert("You need to log in to rate.");
            return;
        }
        await rateRecipe(recipeId, currentUser, value);
    };

    const scrollToRatingSection = (ratingSectionRef) => {
        if (ratingSectionRef.current) {
            const offset = 250;
            const elementPosition =
                ratingSectionRef.current.getBoundingClientRect().top +
                window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
            });
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const resetCommentFields = () => {
        setNewComment("");
        setEditCommentId(null);
        setEditCommentText("");
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return alert("Comment cannot be empty");
        if (!currentUser) return alert("You need to log in.");
        await addComment(recipeId, {
            text: newComment,
            userId: currentUser.uid,
            username: currentUser.displayName,
            userPhoto: currentUser.photoURL,
        });
        resetCommentFields();
    };

    const handleEditComment = async (e) => {
        e.preventDefault();
        if (!editCommentText.trim()) return alert("Comment cannot be empty");
        await editComment(recipeId, editCommentId, {
            text: editCommentText,
            username: currentUser.displayName,
            userPhoto: currentUser.photoURL,
        });
        resetCommentFields();
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(recipeId, commentId);
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
        resetCommentFields();
    };

    const commentCount = Object.keys(currentRecipe.comments || {}).length;

    return (
        <div className={styles.pageWrapper}>
            {/* HERO SECTION */}
            <div className={styles.hero}>
                <img
                    src={currentRecipe.imageUrl}
                    alt={currentRecipe.title}
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.recipeTitle}>
                        {currentRecipe.title}
                    </h1>
                    {/*Like + Save buttons  */}
                    <div className={styles.heroActions}>
                        <button
                            onClick={handleSaveRecipe}
                            className={`${styles.heroBtn} ${
                                isSaved ? styles.saved : ""
                            }`}
                        >
                            {isSaved ? (
                                <i className="fa-solid fa-star"></i>
                            ) : (
                                <i className="fa-regular fa-star"></i>
                            )}
                        </button>
                        <button
                            onClick={handleLike}
                            className={`${styles.heroBtn} ${
                                isLiked ? styles.liked : ""
                            }`}
                        >
                            {isLiked ? (
                                <i className="fa-solid fa-heart"></i>
                            ) : (
                                <i className="fa-regular fa-heart"></i>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT SECTION */}
            <div className={styles.contentSection}>
                {/* Stats Bar */}
                <div className={styles.recipeStats}>
                    {/* Rating system */}
                    <div className={styles.ratingBox}>
                        <span className={styles.ratingNumber}>
                            {averageRating.toFixed(1)}
                        </span>
                        <div
                            className={styles.ratingStars}
                            onClick={() =>
                                scrollToRatingSection(ratingSectionRef)
                            }
                        >
                            {renderStars(averageRating)}
                        </div>

                        <span className={styles.reviewCount}>
                            {reviewsCount} reviews
                        </span>
                        
                    </div>

                    {/* TimeToCook + Like Count */}
                    <div className={styles.statItem}>
                        <i className="fa-regular fa-clock"></i>
                        <span>{currentRecipe.timeToCook || "?"} min</span>
                    </div>

                    <div className={styles.statItem}>
                        <i className="fa-solid fa-thumbs-up"></i>
                        <span>{currentRecipe.likeCount || 0} Likes</span>
                    </div>

                    {/* If the logged user is the author, show Edit/Delete */}
                    {currentUser?.uid === currentRecipe.authorId && (
                        <div className={styles.recipeOwnerActions}>
                            <button
                                className={styles.editBtn}
                                onClick={() =>
                                    navigate(`/recipes/edit/${recipeId}`)
                                }
                            >
                                <i className="fa-regular fa-pen-to-square"></i>{" "}
                                Edit
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteRecipe(recipeId)}
                            >
                                <i className="fa-solid fa-trash-can"></i> Delete
                            </button>
                        </div>
                    )}
                </div>

                <hr className={styles.sectionDivider} />
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                {/* About Section */}
                <section className={styles.sectionBlock}>
                    <h2>About This Recipe</h2>
                    <p>
                        <strong>
                            By: {currentRecipe.authorName || "Anonymous"}
                        </strong>
                    </p>
                    <p>{currentRecipe.description}</p>
                </section>

                {/* Ingredients */}
                <section className={styles.sectionBlock}>
                    <h2>Ingredients</h2>
                    <ul className={styles.ingredientsList}>
                        {currentRecipe.ingredients
                            ?.split(",")
                            .map((item, i) => (
                                <li key={i}>{item.trim()}</li>
                            ))}
                    </ul>
                </section>

                {/* Steps or Directions */}
                <section className={styles.sectionBlock}>
                    <h2>Directions</h2>
                    <ol className={styles.stepsList}>
                        {currentRecipe.steps
                            ?.split(".")
                            .filter((s) => s.trim() !== "")
                            .map((step, i) => (
                                <li key={i}>{step.trim()}.</li>
                            ))}
                    </ol>
                </section>

                {/* Optional tips */}
                {currentRecipe.tips && currentRecipe.tips.length > 0 && (
                    <section className={styles.sectionBlock}>
                        <h2>Tips</h2>
                        <ul className={styles.tipsList}>
                            {currentRecipe.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                <hr></hr>
                {currentUser && (
                    <section
                        ref={ratingSectionRef}
                        className={styles.sectionBlock}
                    >
                        <h2>Rate This Recipe</h2>
                        <div>
                            {renderInteractiveStars(
                                userRating,
                                handleRateRecipe
                            )}

                            <p>
                                Your rating: {userRating ? userRating : "N/A"}
                            </p>
                        </div>
                    </section>
                )}
                <hr></hr>
                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                {/* COMMENTS SECTION */}
                <section className={styles.sectionBlock}>
                    <h2>Comments</h2>
                    {Object.entries(currentRecipe.comments || {}).length ===
                        0 && (
                        <p className={styles.noComments}>
                            No comments yet. Be the first to add one!
                        </p>
                    )}

                    {/* List comments */}
                    <ul className={styles.commentList}>
                        {Object.entries(currentRecipe.comments || {}).map(
                            ([key, comment]) => (
                                <li key={key} className={styles.commentItem}>
                                    <img
                                        src={
                                            comment.userPhoto ||
                                            "default-avatar.png"
                                        }
                                        alt="User Avatar"
                                        className={styles.commentAvatar}
                                    />
                                    <div className={styles.commentContent}>
                                        <div className={styles.commentTopRow}>
                                            <Link
                                                to={`/user/${comment.userId}`}
                                                className={styles.commentAuthor}
                                            >
                                                {comment.username}
                                            </Link>
                                            {comment.createdAt && (
                                                <span
                                                    className={
                                                        styles.commentTime
                                                    }
                                                >
                                                    {formatDistanceToNow(
                                                        parseISO(
                                                            comment.createdAt
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                        }
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <p className={styles.commentText}>
                                            {comment.text}
                                        </p>
                                        {currentUser?.uid ===
                                            comment.userId && (
                                            <div
                                                className={
                                                    styles.commentActions
                                                }
                                            >
                                                <button
                                                    onClick={() => {
                                                        setEditCommentId(key);
                                                        setEditCommentText(
                                                            comment.text
                                                        );
                                                    }}
                                                >
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteComment(key)
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            )
                        )}
                    </ul>

                    {/* Add or edit comment form */}
                    {currentUser && (
                        <form
                            onSubmit={
                                editCommentId
                                    ? handleEditComment
                                    : handleAddComment
                            }
                            className={styles.commentForm}
                        >
                            <textarea
                                className={styles.commentInput}
                                placeholder="Write a comment..."
                                value={
                                    editCommentId ? editCommentText : newComment
                                }
                                onChange={(e) =>
                                    editCommentId
                                        ? setEditCommentText(e.target.value)
                                        : setNewComment(e.target.value)
                                }
                            />
                            <button
                                type="submit"
                                className={styles.commentSubmit}
                            >
                                {editCommentId
                                    ? "Update Comment"
                                    : "Post Comment"}
                            </button>
                        </form>
                    )}
                </section>
            </div>
            <ScrollToTopButton />
        </div>
    );
};

// Helper function

function renderStars(userRating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const starType =
            i <= userRating ? "fa-solid fa-star" : "fa-regular fa-star";
        stars.push(
            <i
                key={i}
                className={starType}
                style={{ cursor: "pointer", color: "#f1c40f", marginRight: 4 }}
            />
        );
    }
    return <div>{stars}</div>;
}

function renderInteractiveStars(userRating, onRate) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (userRating >= i) {
            stars.push(
                <i
                    key={i}
                    className="fa-solid fa-star"
                    style={{ cursor: "pointer", color: "#f1c40f" }}
                    onClick={() => onRate(i)}
                ></i>
            );
        } else {
            stars.push(
                <i
                    key={i}
                    className="fa-regular fa-star"
                    style={{ cursor: "pointer" }}
                    onClick={() => onRate(i)}
                ></i>
            );
        }
    }

    return <div style={{ fontSize: "1.5rem" }}>{stars}</div>;
}
