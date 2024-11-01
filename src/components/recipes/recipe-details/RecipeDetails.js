import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { database } from "../../../firebase/firebaseConfig";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ref, update } from "firebase/database";

import styles from "./RecipeDetails.module.css";
import clx from 'classnames';


export const RecipeDetails = () => {
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    const { currentUser, setCurrentUser } = useAuth();
    const { recipeId } = useParams();
    const {
        addComment,
        editComment,
        deleteComment,
        recipes,
        deleteRecipe,
        toggleLike
    } = useContext(RecipeContext);

    const navigate = useNavigate();
    const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);

    useEffect(() => {
        if (currentRecipe) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [currentRecipe]);

    useEffect(() => {
        if (!currentUser || !currentUser.savedRecipes) return;
        setIsSaved(!!currentUser.savedRecipes[recipeId]);
    }, [currentUser, recipeId]);

    // ------------------------------------------- Recipes ---------------------------------------------

    const deleteRecipeHandler = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            deleteRecipe(recipeId).then(() => {
                navigate("/recipes/list");
            });
        }
    };

    // ------------------------------------------- Comments --------------------------------------------

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            alert("Comment cannot be empty");
            return;
        }
        if (!currentUser) {
            alert("You need to be logged in to add a comment.");
            return;
        }

        const comment = {
            text: newComment,
            userId: currentUser.uid,
            username: currentUser.displayName,
        };

        try {
            await addComment(recipeId, comment);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = async (e) => {
        e.preventDefault();
        if (!editCommentText.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            await editComment(recipeId, editCommentId, { text: editCommentText });
            setEditCommentId(null);
            setEditCommentText("");
        } catch (error) {
            console.error("Error editing comment:", error);
        }
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

    // ------------------------------------------- Likes ------------------------------------------------

    const handleToggleLike = () => {
        toggleLike(recipeId, currentUser);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!currentRecipe) {
        return <p>Recipe not found.</p>;
    }

    const userHasLiked = currentUser && currentRecipe.likes && currentRecipe.likes[currentUser.uid];
    const likeCount = currentRecipe.likeCount || 0;

    // --------------------------------------------- Favorite recipes --------------------------------------------


    const handleSaveRecipe = async () => {
        if (!currentUser) {
            alert("You need to be logged in to save recipes.");
            return;
        }

        const userRef = ref(database, `users/${currentUser.uid}`);
        const updatedSavedRecipes = { ...currentUser.savedRecipes };
        if (isSaved) {
            delete updatedSavedRecipes[recipeId]; // Remove recipe if already saved
        } else {
            updatedSavedRecipes[recipeId] = true; // Add recipe if not saved
        }

        try {
            await update(userRef, { savedRecipes: updatedSavedRecipes });
            setIsSaved(!isSaved);
            setCurrentUser(prev => ({ ...prev, savedRecipes: updatedSavedRecipes }));
        } catch (error) {
            console.error("Error saving recipe:", error);
            alert("Failed to save recipe. Please try again.");
        }
    };

    return (
        <div className={styles["recipe-details-wrapper"]}>
            <i id="save-star" onClick={handleSaveRecipe} className={isSaved ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
            <h1 className={styles["recipe-title"]}>Recipe: {currentRecipe.title}</h1>
            <div>
                <img src={currentRecipe.imageUrl} alt="" className={styles["recipe-img"]} />
                <p><strong>Description:</strong> {currentRecipe.description}</p>
                <p><strong>Time for preparation:</strong> {currentRecipe.timeToCook} minutes</p>
                <p><strong>Ingredients:</strong> {currentRecipe.ingredients}</p>
                <p><strong>Steps:</strong> {currentRecipe.steps}</p>
            </div>
            <div className={styles["form-control"]}>
                <span className={styles["likes-display"]}>{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
                {currentUser?.email && (
                    <span>
                        <button onClick={handleToggleLike} className={styles.btn}>
                            {userHasLiked ? "Unlike" : "Like"}
                        </button>
                        {currentUser?.uid === currentRecipe.authorId && (
                            <span>
                                <Link className={styles.btn} to={`/recipes/edit/${recipeId}`}>Edit</Link>
                                <Link className={styles.btn} to="#" onClick={deleteRecipeHandler}>Delete</Link>
                            </span>
                        )}
                    </span>
                )}
            </div>
            <div className={styles["comments-section-wrapper"]} >
                <h3>Comments:</h3>
                <ul className={styles["comments-section"]}>
                    {currentRecipe.comments && Object.entries(currentRecipe.comments).map(([key, comment]) => (
                        <li key={key} className={styles["comment-item"]}>
                            {editCommentId === key ? (
                                <form onSubmit={handleEditComment}>
                                    <textarea
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                    />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditCommentId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <span>
                                    <p><strong>{comment.username}:</strong> {comment.text}</p>
                                    {comment.createdAt && (
                                        <p className="comment-time">
                                            <em>{formatDistanceToNow(parseISO(comment.createdAt), { addSuffix: true })}</em>  {/* Show time since comment creation */}
                                        </p>
                                    )}
                                </span>
                            )}
                            {comment.userId === currentUser?.uid && (
                                <div>
                                    <button className={clx(styles["comment-btn"], "btn")} onClick={() => { setEditCommentId(key); setEditCommentText(comment.text); }}>
                                        Edit
                                    </button>
                                    <button className={clx(styles["comment-btn"], "btn")} onClick={() => handleDeleteComment(key)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {
                currentUser?.email && (
                    <form onSubmit={handleAddComment}>
                        <textarea
                            className={styles["comment-text-area"]}
                            name="comment"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <input type="submit" value="Add comment" />
                    </form>
                )
            }
        </div >
    );
};
