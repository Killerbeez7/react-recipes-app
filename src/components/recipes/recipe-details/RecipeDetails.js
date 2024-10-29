import { useEffect, useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as recipeService from "../../../services/recipeService";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./RecipeDetails.module.css";

export const RecipeDetails = () => {
    const { currentUser } = useAuth();
    const { deleteRecipe, recipes } = useContext(RecipeContext);
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [currentRecipe, setCurrentRecipe] = useState(null);

    useEffect(() => {
        const foundRecipe = recipes.find((recipe) => recipe.id === recipeId);
        if (foundRecipe) {
            setCurrentRecipe(foundRecipe);
            setLoading(false);
        } else {
            // Fetch the recipe from the server if it's not in the local state
            (async () => {
                try {
                    setLoading(true);
                    const recipeDetails = await recipeService.getOne(recipeId);
                    if (recipeDetails) {
                        setCurrentRecipe({ id: recipeId, ...recipeDetails });
                    } else {
                        setCurrentRecipe(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch recipe details:", error);
                    setCurrentRecipe(null);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [recipeId, recipes]);

    const deleteRecipeHandler = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            recipeService.del(recipeId).then(() => {
                deleteRecipe(recipeId);
                navigate("/recipes/list");
            });
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
                <p><strong>Ingredients:</strong> {currentRecipe.steps}</p>
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
                    {currentRecipe.comments?.length > 0 ? (
                        currentRecipe.comments.map((comment, index) => (
                            <li key={index} className="comment">
                                <p>{comment}</p>
                            </li>
                        ))
                    ) : (
                        <p>No comments yet!</p>
                    )}
                </ul>
            </div>
            {currentUser?.email && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <textarea name="comment" placeholder="Comment..." disabled></textarea>
                    <input type="submit" value="Add comment" disabled />
                </form>
            )}
        </div>
    );
};
