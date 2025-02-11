import { useContext, useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { addRecipeToFavorites } from "../../../services/recipeService";

import styles from "./RecipeDetails.module.css";

export const RecipeDetails = () => {
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    // rating system
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [reviewsCount, setReviewsCount] = useState(0);

    const { recipeId } = useParams();
    const { currentUser } = useAuth();
    const {
        recipes,
        addComment,
        toggleLike,
        deleteComment,
        editComment,
        deleteRecipe,
        rateRecipe,
    } = useContext(RecipeContext);

    const ratingSectionRef = useRef(null);
    const navigate = useNavigate();
    const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);

    const [isSaved, setIsSaved] = useState(
        !!currentUser?.savedRecipes?.[recipeId]
    );
    const [isLiked, setIsLiked] = useState(false);

    // gallery images
    const [galleryImages, setGalleryImages] = useState([]);

    // cost price: TO FINISH
    const costEstimate = "$10 - $12";

    // nutrition fatcs: TO FINISH
    const nutritionFacts = {
        calories: 280,
        fat: 10,
        protein: 15,
        carbs: 30,
    };

    // similar recipes: TO FINISH
    const [similarRecipes, setSimilarRecipes] = useState([
        {
            id: "1",
            title: "Chocolate Chip Pancakes",
            imageUrl:
                "https://via.placeholder.com/100x80?text=ChocolatePancakes",
        },
        {
            id: "2",
            title: "Pumpkin Spice Latte",
            imageUrl: "https://via.placeholder.com/100x80?text=PumpkinLatte",
        },
    ]);

    useEffect(() => {
        setLoading(!currentRecipe);

        // add more gallery images: TO FINISH
        if (currentRecipe) {
            setGalleryImages(
                currentRecipe.galleryImages || [
                    currentRecipe.imageUrl,
                    "https://placehold.co/600x400",
                    "https://placehold.co/600x400",
                ]
            );
        }

        if (currentRecipe && currentUser) {
            setIsLiked(!!currentRecipe.likes?.[currentUser.uid]);
            const avg = computeAverageRating(currentRecipe.ratings);
            setAverageRating(avg);
            setUserRating(currentRecipe.ratings?.[currentUser.uid] || null);
            const count = currentRecipe.ratings
                ? Object.keys(currentRecipe.ratings).length
                : 0;
            setReviewsCount(count);
        }
    }, [currentRecipe, currentUser]);

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (!currentRecipe) return <p className={styles.notFound}>Not found.</p>;

    // Handlers
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

    const handleRateRecipe = async (value) => {
        if (!currentUser) {
            alert("You need to log in to rate.");
            return;
        }
        await rateRecipe(recipeId, currentUser, value);
    };

    const scrollToRatingSection = () => {
        if (ratingSectionRef.current) {
            const offset = 220;
            const elementPosition =
                ratingSectionRef.current.getBoundingClientRect().top +
                window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
            });
        }
    };

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

    const handleDeleteCommentLocal = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(recipeId, commentId);
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
        resetCommentFields();
    };

    // For the “Print Recipe” placeholder
    const handlePrint = () => {
        // We can just do a simple window.print() or whatever logic you want
        window.print();
    };

    const commentCount = Object.keys(currentRecipe.comments || {}).length;

    // Render
    return (
        <div className={styles.pageWrapper}>
            {/* Title Bar */}
            <div className={styles.titleRow}>
                <h1 className={styles.recipeTitle}>{currentRecipe.title}</h1>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={handleSaveRecipe}
                        className={`${styles.iconBtn} ${
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
                        className={`${styles.iconBtn} ${
                            isLiked ? styles.liked : ""
                        }`}
                    >
                        {isLiked ? (
                            <i className="fa-solid fa-heart"></i>
                        ) : (
                            <i className="fa-regular fa-heart"></i>
                        )}
                    </button>
                    {/* If user is the author */}
                    {currentUser?.uid === currentRecipe.authorId && (
                        <div className={styles.ownerControls}>
                            <button
                                onClick={() =>
                                    navigate(`/recipes/edit/${recipeId}`)
                                }
                                className={styles.editBtn}
                            >
                                <i className="fa-regular fa-pen-to-square"></i>{" "}
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteRecipe(recipeId)}
                                className={styles.deleteBtn}
                            >
                                <i className="fa-solid fa-trash-can"></i> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Large Hero / Gallery */}
            <div className={styles.heroGallery}>
                {/* Main hero image */}
                <div className={styles.heroImageWrapper}>
                    <img
                        src={galleryImages[0]}
                        alt="Main"
                        className={styles.heroImage}
                    />
                </div>

                {/* Thumbnails (just placeholders; you could implement a carousel, etc.) */}
                <div className={styles.thumbnailRow}>
                    {galleryImages.slice(1).map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt={`Thumbnail ${index}`}
                            className={styles.thumbnail}
                        />
                    ))}
                </div>
            </div>

            {/* info bar:  rating, time, likes, servings, cost, print */}
            <div className={styles.infoBar}>
                <div
                    className={styles.ratingBox}
                    onClick={scrollToRatingSection}
                >
                    <span className={styles.ratingScore}>
                        {averageRating.toFixed(1)}
                    </span>
                    {renderStars(averageRating)}
                    <span className={styles.reviewCount}>
                        {reviewsCount} reviews
                    </span>
                </div>
                <div className={styles.timeBox}>
                    <i className="fa-regular fa-clock"></i>
                    <span>{currentRecipe.timeToCook || "?"} min</span>
                </div>
                <div className={styles.likeBox}>
                    <i className="fa-solid fa-thumbs-up"></i>
                    <span>{currentRecipe.likeCount || 0} Likes</span>
                </div>
                <div className={styles.servingsBox}>
                    <i className="fa-solid fa-utensils"></i>
                    <span>{currentRecipe.servings} servings</span>
                </div>
                <div className={styles.costBox}>
                    <i className="fa-solid fa-dollar-sign"></i>
                    <span>{costEstimate}</span>
                </div>
                <div className={styles.printBtnWrapper}>
                    <button onClick={handlePrint} className={styles.printBtn}>
                        <i className="fa-solid fa-print"></i> Print Recipe
                    </button>
                </div>
            </div>

            {/* Nutrition facts (placeholder) */}
            <div className={styles.nutritionBox}>
                <h2>Nutrition Facts (per serving)</h2>
                <ul>
                    <li>Calories: {nutritionFacts.calories}</li>
                    <li>Fat: {nutritionFacts.fat}g</li>
                    <li>Protein: {nutritionFacts.protein}g</li>
                    <li>Carbs: {nutritionFacts.carbs}g</li>
                </ul>
            </div>

            {/* Description */}
            <div className={styles.descriptionBox}>
                <p>{currentRecipe.description}</p>
            </div>

            {/* Recipe content (Ingredients + Directions) */}
            <div className={styles.recipeContent}>
                <div className={styles.recipeBlock}>
                    <h2>Ingredients</h2>
                    <ul className={styles.ingredientList}>
                        {currentRecipe.ingredients
                            ?.split(",")
                            .map((item, i) => (
                                <li key={i}>{item.trim()}</li>
                            ))}
                    </ul>
                </div>
                <div className={styles.recipeBlock}>
                    <h2>Directions</h2>
                    <ol className={styles.directionList}>
                        {currentRecipe.steps
                            ?.split(".")
                            .filter((s) => s.trim() !== "")
                            .map((step, i) => (
                                <li key={i}>{step.trim()}.</li>
                            ))}
                    </ol>
                </div>
            </div>

            {/* Tips */}
            {currentRecipe.tips && currentRecipe.tips.length > 0 && (
                <div className={styles.tipsBox}>
                    <h2>Tips</h2>
                    <ul>
                        {currentRecipe.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Chef’s Notes (placeholder) */}
            <div className={styles.chefNotes}>
                <h2>Chef’s Notes</h2>
                <p>
                    Feel free to add any personal thoughts, experiment ideas, or
                    variations here. This is a placeholder for extra context.
                </p>
            </div>

            {/* Rate if logged in */}
            {currentUser && (
                <div className={styles.rateBox} ref={ratingSectionRef}>
                    <h2>Rate This Recipe</h2>
                    <div className={styles.starRow}>
                        {renderInteractiveStars(userRating, handleRateRecipe)}
                        <span>
                            Your rating: {userRating ? userRating : "N/A"}
                        </span>
                    </div>
                </div>
            )}

            {/* Comments */}
            <div className={styles.commentSection}>
                <h2>Comments ({commentCount})</h2>
                {commentCount === 0 && (
                    <p className={styles.noComments}>
                        Be the first to comment!
                    </p>
                )}
                <ul className={styles.commentList}>
                    {Object.entries(currentRecipe.comments || {}).map(
                        ([key, comment]) => (
                            <li key={key} className={styles.commentItem}>
                                <img
                                    src={
                                        comment.userPhoto ||
                                        "default-avatar.png"
                                    }
                                    alt="avatar"
                                    className={styles.commentAvatar}
                                />
                                <div>
                                    <div className={styles.commentHeader}>
                                        {/* <Link
                                            to={`/user/${comment.userId}`}
                                            className={styles.commentAuthor}
                                        >
                                            {comment.username}
                                        </Link> */}
                                        <strong
                                            onClick={() =>
                                                navigate(
                                                    `/profile/${comment.userId}`
                                                )
                                            }
                                            className={styles.commentAuthor}
                                        >
                                            {comment.username}
                                        </strong>
                                        {comment.createdAt && (
                                            <span
                                                className={styles.commentTime}
                                            >
                                                {formatDistanceToNow(
                                                    parseISO(comment.createdAt),
                                                    { addSuffix: true }
                                                )}
                                            </span>
                                        )}
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
                                                        handleDeleteCommentLocal(
                                                            key
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className={styles.commentText}>
                                        {comment.text}
                                    </p>
                                </div>
                            </li>
                        )
                    )}
                </ul>
                {currentUser && (
                    <form
                        onSubmit={
                            editCommentId ? handleEditComment : handleAddComment
                        }
                        className={styles.commentForm}
                    >
                        <textarea
                            className={styles.commentInput}
                            placeholder="Write a comment..."
                            value={editCommentId ? editCommentText : newComment}
                            onChange={(e) =>
                                editCommentId
                                    ? setEditCommentText(e.target.value)
                                    : setNewComment(e.target.value)
                            }
                        />
                        <button type="submit" className={styles.commentSubmit}>
                            {editCommentId ? "Update Comment" : "Post Comment"}
                        </button>
                    </form>
                )}
            </div>

            {/* Similar Recipes (Placeholder) */}
            <div className={styles.similarRecipes}>
                <h2>You Might Also Like</h2>
                <ul className={styles.similarList}>
                    {similarRecipes.map((rec) => (
                        <li key={rec.id} className={styles.similarItem}>
                            <Link to={`/recipes/details/${rec.id}`}>
                                <img
                                    src={rec.imageUrl}
                                    alt={rec.title}
                                    className={styles.similarImg}
                                />
                                <p>{rec.title}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

/* HELPER FUNCTIONS */

function computeAverageRating(ratingsObj) {
    if (!ratingsObj) return 0;
    const arr = Object.values(ratingsObj);
    if (!arr.length) return 0;
    return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

function renderStars(avg) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= avg ? "fa-solid fa-star" : "fa-regular fa-star";
        stars.push(
            <i
                key={i}
                className={starClass}
                style={{ color: "#f1c40f", marginRight: 4 }}
            />
        );
    }
    return <span>{stars}</span>;
}

function renderInteractiveStars(userRating, onRate) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const filled = i <= userRating;
        stars.push(
            <i
                key={i}
                className={filled ? "fa-solid fa-star" : "fa-regular fa-star"}
                style={{
                    color: filled ? "#f1c40f" : "#ccc",
                    marginRight: 4,
                    cursor: "pointer",
                }}
                onClick={() => onRate(i)}
            />
        );
    }
    return <div>{stars}</div>;
}
