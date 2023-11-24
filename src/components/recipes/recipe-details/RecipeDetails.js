import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import * as recipeService from "../../../services/recipeService";

import { useContext } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";

export const RecipeDetails = () => {
    const { deleteRecipe, addComment } = useContext(RecipeContext);

    const { recipeId } = useParams();
    const [ currentRecipe, setCurrentRecipe ] = useState({});

    const [comment, setComment] = useState({
        username: "",
        comment: "",
    });

    const [error, setError] = useState({
        username: "",
        comment: "",
    });

    useEffect(() => {
        recipeService.getOne(recipeId)
            .then((result) => {
                setCurrentRecipe(result);
        });
    });

    const addCommentHandler = (e) => {
        e.preventDefault();

        const result = `${comment.username}: ${comment.comment}`;

        addComment(recipeId, result);
    };

    const onChange = (e) => {
        setComment((state) => ({
            [e.target.name]: e.target.value,
        }));
    };

    const validateComment = (e) => {
        const comment = e.target.value;
        let errorMessage = "";

        if (comment.length < 4) {
            errorMessage = "Comment must be longer than 4 characters";
        } else if (comment.length > 30) {
            errorMessage = "Comment must be shorter than 30 characters";
        }

        setError((state) => ({
            ...state,
            comment: errorMessage,
        }));
    };

    const deleteRecipeHandler = () => {
        recipeService.remove(currentRecipe._id).then(deleteRecipe(currentRecipe._id));
    };

    return (
        <>
            <div
                style={{
                    padding: 50,
                    margin: 80,
                    backgroundColor: "lightgreen",
                }}
            >
                <h1 style={{ paddingBottom: 30 }}>
                    Recipe: {currentRecipe.name}
                </h1>
                <hr />
                <br />
                <div
                    className="recipe-details-wrapper"
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <div className="recipe-img-box">
                        <img
                            src={`/${currentRecipe.imageUrl}`}
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
                        <h3>Description: {currentRecipe.description}</h3>
                        <h3>
                            Time for preparation: {currentRecipe.timeToCook}{" "}
                            minutes
                        </h3>
                        <h3>ingredients: {currentRecipe.ingredients}</h3>
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
                        onClick={() => deleteRecipeHandler(currentRecipe._id)}
                    >
                        Delete
                    </Link>
                </div>
                <div className="comments-section">
                    <h3>Comments:</h3>
                    <hr />
                    <ul className="comments">
                        {currentRecipe.comments?.map((x) => (
                            <li className="comment">
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
                                onChange={onChange}
                                onBlur={validateComment}
                                value={comment.comment}
                            />
                            {error.comment && (
                                <div style={{ color: "red" }}>
                                    {error.comment}
                                </div>
                            )}
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
