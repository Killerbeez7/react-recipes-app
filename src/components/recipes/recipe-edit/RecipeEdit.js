import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import * as recipeService from "../../../services/recipeService";
import styles from "./RecipeEdit.module.css";


export const RecipeEdit = () => {
    const { editRecipe } = useContext(RecipeContext);
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const recipeData = await recipeService.getOne(recipeId);
                if (recipeData) {
                    setCurrentRecipe({ id: recipeId, ...recipeData });
                } else {
                    alert("Recipe not found");
                    navigate("/recipes/all");
                }
            } catch (error) {
                console.error("Error fetching recipe details:", error);
                alert(
                    "There was an error fetching the recipe details. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [recipeId, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const recipeData = Object.fromEntries(formData);

        if (
            !recipeData.title ||
            !recipeData.description ||
            !recipeData.timeToCook
        ) {
            alert("Please fill in all required fields");
            return;
        }

        if (
            isNaN(recipeData.timeToCook) ||
            Number(recipeData.timeToCook) <= 0
        ) {
            alert("Time to cook must be a positive number");
            return;
        }

        try {
            await recipeService.edit(recipeId, recipeData);
            editRecipe(recipeId, recipeData);
            navigate(`/recipes/details/${recipeId}`);
        } catch (error) {
            console.error("Error updating the recipe:", error);
            alert("There was an error updating the recipe. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!currentRecipe) {
        return <p>Recipe not found.</p>;
    }

    return (
        <div className={styles["edit-form-container"]}>
            <h1 className={styles["edit-recipe-title"]}>Edit Recipe</h1>
            <form
                id="edit"
                className="col-lg-6 offset-lg-3"
                onSubmit={onSubmit}
            >
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Recipe title"
                        defaultValue={currentRecipe.title}
                    />
                </div>
                <div className={styles["edit-form-group"]}>
                    <input
                        type="textarea"
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={currentRecipe.description}
                    />
                </div>
                <div className={styles["edit-form-group"]}>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="Image URL"
                        defaultValue={currentRecipe.imageUrl}
                    />
                </div>
                <div className={styles["edit-form-group"]}>
                    <input
                        type="number"
                        id="timeToCook"
                        name="timeToCook"
                        placeholder="Preparation time"
                        defaultValue={currentRecipe.timeToCook}
                    />
                </div>
                <div className={styles["edit-form-group"]}>
                    <input
                        type="textarea"
                        id="ingredients"
                        name="ingredients"
                        placeholder="Ingredients"
                        defaultValue={currentRecipe.ingredients}
                    />
                </div>
                <div className={styles["edit-form-group"]}>
                    <input
                        type="textarea"
                        id="steps"
                        name="steps"
                        placeholder="Steps"
                        defaultValue={currentRecipe.steps}
                    />
                </div>
                <div className={styles["edit-buttons-form"]}>
                    <button
                        type="submit"
                        className={styles["edit-btn"]}
                        // disabled={isSubmitting}
                    >
                        Submit
                    </button>
                    <Link className={styles["edit-btn"]} to={`/recipes/details/${recipeId}`}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};
