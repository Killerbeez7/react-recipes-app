import { useEffect, useContext, useState, useNavigate } from "react";
import { useParams, Link } from "react-router-dom";
import * as recipeService from "../../../services/recipeService";
// import * as commentService from "../../../services/commentService";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./RecipeDetails.module.css";

export const RecipeDetails = () => {
    const { currentUser } = useAuth();
    const { deleteRecipe, addComment, fetchRecipeDetails, selectRecipe } = useContext(RecipeContext);
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const currentRecipe = selectRecipe(recipeId); // This should work correctly now
    const [loading, setLoading] = useState(true);

    const isOwner = currentRecipe?._ownerId === currentUser?._id;

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const recipeDetails = await recipeService.getOne(recipeId);
    //             const recipeComments = await commentService.getByRecipeId(recipeId);
    //             fetchRecipeDetails(recipeId, {
    //                 ...recipeDetails,
    //                 comments: recipeComments.map(
    //                     (x) => `${x.user.username}: ${x.text}`
    //                 ),
    //             });
    //         } finally {
    //             setLoading(false);
    //         }
    //     })();
    // }, [recipeId, fetchRecipeDetails]);

    const addCommentHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const comment = formData.get("comment").trim();

        if (!comment) {
            alert("Comment cannot be empty!");
            return;
        }

        // commentService.create(recipeId, comment).then(() => {
        //     addComment(recipeId, comment);
        // });

        e.target["comment"].value = "";
    };

    const deleteRecipeHandler = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            recipeService.del(recipeId).then(() => {
                deleteRecipe(recipeId);
            });
        }
    };

    // if (loading) {
    //     return <p>Loading...</p>;
    // }

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
                <h2>Likes:</h2>
            </div>
            <div className={styles["form-control"]}>
                {currentUser?.email && (
                    <span>
                        <Link to="#" className={styles.btn}>LIKE</Link>
                        {isOwner && (
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
                <form onSubmit={addCommentHandler}>
                    <textarea name="comment" placeholder="Comment..."></textarea>
                    <input type="submit" value="Add comment" />
                </form>
            )}
        </div>
    );
};
