import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ref, update } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";

import styles from "./RecipeDetails.module.css";
import clx from "classnames";

export const RecipeDetails = () => {
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");
    const { recipeId } = useParams();
    const { currentUser } = useAuth();
    const { recipes, addComment, toggleLike, deleteComment, editComment } =
        useContext(RecipeContext);

    const navigate = useNavigate();
    const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);

    const [isSaved, setIsSaved] = useState(
        !!currentUser?.savedRecipes?.[recipeId]
    );

    useEffect(() => {
        setLoading(!currentRecipe);
    }, [currentRecipe]);

    if (loading) return <p>Loading...</p>;
    if (!currentRecipe) return <p>Recipe not found.</p>;

    const handleSaveRecipe = async () => {
        if (!currentUser) {
            alert("You need to be logged in to save recipes.");
            return;
        }

        const userRef = ref(database, `users/${currentUser.uid}`);
        const updatedSavedRecipes = { ...currentUser.savedRecipes };

        if (isSaved) {
            delete updatedSavedRecipes[recipeId];
        } else {
            updatedSavedRecipes[recipeId] = true;
        }

        try {
            await update(userRef, { savedRecipes: updatedSavedRecipes });
            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
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
        setNewComment("");
    };

    const handleEditComment = async (e) => {
        e.preventDefault();
        await editComment(recipeId, editCommentId, {
            text: editCommentText,
            username: currentUser.displayName,
            userPhoto: currentUser.photoURL,
        });
        setEditCommentId(null);
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(recipeId, commentId);
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };
    const userHasLiked = currentRecipe.likes?.[currentUser?.uid];
    const likeCount = currentRecipe.likeCount || 0;

    return (
        <div className={styles["recipe-details-wrapper"]}>
            <i
                id="save-star"
                onClick={handleSaveRecipe}
                className={isSaved ? "fa-solid fa-star" : "fa-regular fa-star"}
            ></i>
            <h1 className={styles["recipe-title"]}>{currentRecipe.title}</h1>

            <div className={styles["recipe-header"]}>
                <img
                    src={currentRecipe.imageUrl}
                    alt={currentRecipe.title}
                    className={styles["recipe-img"]}
                />
                <div className={styles["details-box"]}>
                    <p>
                        <strong>Description:</strong>{" "}
                        {currentRecipe.description}
                    </p>
                    <p>
                        <strong>Ingredients:</strong>{" "}
                        {currentRecipe.ingredients}
                    </p>
                    <p>
                        <strong>Steps:</strong> {currentRecipe.steps}
                    </p>
                    <p>
                        <strong>Cook Time:</strong> {currentRecipe.timeToCook}{" "}
                        min
                    </p>
                </div>
            </div>

            <div className={styles["form-control"]}>
                <span className={styles["likes-display"]}>
                    {likeCount} {likeCount === 1 ? "like" : "likes"}
                </span>
                <span
                    onClick={() => toggleLike(recipeId, currentUser)}
                    className={styles.btn}
                >
                    {userHasLiked ? (
                        <i class="fas fa-thumbs-up"></i>
                    ) : (
                        <i class="far fa-thumbs-up"></i>
                    )}
                </span>
            </div>

            <div className={styles["comments-section-wrapper"]}>
                <h3>Comments:</h3>
                <ul className={styles["comments-section"]}>
                    {Object.entries(currentRecipe.comments || {}).map(
                        ([key, comment]) => (
                            <li key={key} className={styles["comment-item"]}>
                                <img
                                    src={
                                        comment.userPhoto ||
                                        "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
                                    }
                                    alt="User"
                                    className={styles["profile-picture"]}
                                />
                                <div>
                                    <p>
                                        <strong>{comment.username}:</strong>{" "}
                                        {comment.text}
                                    </p>
                                    {comment.createdAt && (
                                        <p className={styles["comment-time"]}>
                                            {formatDistanceToNow(
                                                parseISO(comment.createdAt),
                                                { addSuffix: true }
                                            )}
                                        </p>
                                        
                                    )} {currentUser?.uid === comment.userId && (
                                    <div className={styles["comment-actions"]}>
                                        <span
                                            onClick={() => {
                                                setEditCommentId(key);
                                                setEditCommentText(
                                                    comment.text
                                                );
                                            }}
                                        >
                                            <i class="fas fa-edit"></i>
                                        </span>
                                        <span
                                            className={clx(
                                                styles["comment-btn"],
                                                "btn"
                                            )}
                                            onClick={() =>
                                                handleDeleteComment(key)
                                            }
                                        >
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </div>
                                )}
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
                    >
                        <textarea
                            className={styles["comment-text-area"]}
                            value={editCommentId ? editCommentText : newComment}
                            onChange={(e) =>
                                editCommentId
                                    ? setEditCommentText(e.target.value)
                                    : setNewComment(e.target.value)
                            }
                            placeholder="Add a comment..."
                        />
                        <button type="submit" className={styles["save-btn"]}>
                            {editCommentId ? "Update Comment" : "Post Comment"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
