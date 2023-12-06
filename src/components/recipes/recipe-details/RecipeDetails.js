import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import * as recipeService from "../../../services/recipeService";
import * as commentService from "../../../services/commentService";

import { useContext } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from "./RecipeDetails.module.css";

export const RecipeDetails = () => {
    const { user } = useContext(AuthContext);
    const { deleteRecipe, addComment, fetchRecipeDetails, selectRecipe } =
        useContext(RecipeContext);

    const { recipeId } = useParams();

    const currentRecipe = selectRecipe(recipeId);

    useEffect(() => {
        (async () => {
            const recipeDetails = await recipeService.getOne(recipeId);
            const recipeComments = await commentService.getByRecipeId(recipeId);

            fetchRecipeDetails(recipeId, {
                ...recipeDetails,
                comments: recipeComments.map(
                    (x) => `${x.user.email}: ${x.text}`
                ),
            });
        })();
    }, []);

    const addCommentHandler = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const comment = formData.get("comment");
        //TODO comment validation

        commentService.create(recipeId, comment).then((result) => {
            addComment(recipeId, comment);
        });
    };

    const deleteRecipeHandler = () => {
        const confirmation = window.confirm(
            "Are you sure you want to delete this recipe?"
        );
        if (confirmation) {
            recipeService.remove(recipeId).then(deleteRecipe(recipeId));
        }
    };

    return (
        <>
            <div className={styles["recipe-details-wrapper"]}>
                <h1 style={{ paddingBottom: 30 }}>
                    Recipe: {currentRecipe.name}
                </h1>
                <hr />
                <br />
                <div
                >
                    <div className="recipe-img-box">
                        <img
                            src={`${currentRecipe.imageUrl}`}
                            alt=""
                            className="recipe-img"
                            style={{
                                width: 250,
                                height: 250,
                                display: "inline-block",
                            }}
                        />
                    </div>
                    <div className="recipe-details-box" style={{ padding: 30 }}>
                        <p><strong>Description: </strong>{currentRecipe.description}</p>
                        <p>
                            <strong>Time for preparation: </strong>{currentRecipe.timeToCook}{" "}
                            minutes
                        </p>
                        <p><strong>ingredients: </strong>{currentRecipe.ingredients}</p>
                        <h2>Likes: </h2>
                    </div>
                    <div className="like-btn btn">
                        <button>
                            <Link
                                to={`/recipes/details/${currentRecipe._id}`}
                                className="view-recipe-btn"
                            >
                                LIKE
                            </Link>
                        </button>
                    </div>
                </div>
                <div className="form-control">
                    {user.email && (
                        <span>
                            <Link
                                className="view-recipe-btn"
                                to={`/recipes/edit/${currentRecipe._id}`}
                                recipe={currentRecipe}
                            >
                                Edit
                            </Link>

                            <Link
                                className="view-recipe-btn"
                                to={`/recipes/list`}
                                onClick={() =>
                                    deleteRecipeHandler(currentRecipe._id)
                                }
                            >
                                Delete
                            </Link>
                        </span>
                    )}
                </div>
                <div className="comments-section">
                    <h3>Comments:</h3>
                    <hr />
                    <ul className="comments">
                        {currentRecipe.comments?.map((x) => (
                            <li key={x} className="comment">
                                <p>{x}</p>
                            </li>
                        ))}
                    </ul>
                    {!currentRecipe.comments && <p>No comments yet!</p>}
                </div>
                <div
                    className="create-comment"
                    style={{
                        backgroundColor: "#c0b3dc",
                        padding: 20,
                        margin: 20,
                    }}
                >
                    <article className="create-comment">
                        <label htmlFor="comment">Add new comment</label>
                        <form className="form" onSubmit={addCommentHandler}>
                            <textarea
                                style={{ marginRight: 20, marginTop: 10 }}
                                name="comment"
                                id="comment"
                                placeholder="Comment..."
                            />
                            <div>
                                <input
                                    className="btn submit"
                                    type="submit"
                                    value="Add comment"
                                />
                            </div>
                        </form>
                    </article>
                </div>
            </div>
        </>
    );
};
