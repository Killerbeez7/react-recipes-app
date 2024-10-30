import { useEffect, useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./RecipeDetails.module.css";

export const RecipeDetails = () => {
    const { addComment, deleteRecipe, recipes } = useContext(RecipeContext);
    const { currentUser } = useAuth();
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");

    const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);

    useEffect(() => {
        if (!currentRecipe) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [currentRecipe]);

    const deleteRecipeHandler = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            deleteRecipe(recipeId).then(() => {
                navigate("/recipes/list");
            });
        }
    };

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
            username: currentUser.email,
        };

        try {
            await addComment(recipeId, comment);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!currentRecipe) {
        return <p>Recipe not found.</p>;
    }

    return (
        <div className={styles["recipe-details-wrapper"]}>
            <h1 className={styles["recipe-title"]}>Recipe: {currentRecipe.title}</h1>
            <div>
                <img src={currentRecipe.imageUrl} alt="" className={styles["recipe-img"]} />
                <p><strong>Description:</strong> {currentRecipe.description}</p>
                <p><strong>Time for preparation:</strong> {currentRecipe.timeToCook} minutes</p>
                <p><strong>Ingredients:</strong> {currentRecipe.ingredients}</p>
                <p><strong>Steps:</strong> {currentRecipe.steps}</p>
            </div>
            <div className={styles["form-control"]}>
                {currentUser?.email && (
                    <span>
                        <Link to="#" className={styles.btn}>LIKE</Link>
                        {currentRecipe._ownerId === currentUser?._id && (
                            <span>
                                <Link className={styles.btn} to={`/recipes/edit/${recipeId}`}>Edit</Link>
                                <Link className={styles.btn} to="#" onClick={deleteRecipeHandler}>Delete</Link>
                            </span>
                        )}
                    </span>
                )}
            </div>
            <div>
                <h3>Comments:</h3>
                <ul className="comments">
                    {currentRecipe.comments && Object.entries(currentRecipe.comments).map(([key, comment]) => (
                        <li key={key} className="comment">
                            <p><strong>{comment.username}:</strong> {comment.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
            {currentUser?.email && (
                <form onSubmit={handleAddComment}>
                    <textarea
                        name="comment"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <input type="submit" value="Add comment" />
                </form>
            )}
        </div>
    );
};
