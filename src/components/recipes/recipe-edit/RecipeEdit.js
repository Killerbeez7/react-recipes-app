import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeContext } from '../../../contexts/RecipeContext';
import * as recipeService from '../../../services/recipeService';
import styles from './RecipeEdit.module.css';

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
                    navigate('/recipes/list');
                }
            } catch (error) {
                console.error("Error fetching recipe details:", error);
                alert("There was an error fetching the recipe details. Please try again later.");
            } finally {
                setLoading(false);
            }
        })();
    }, [recipeId, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const recipeData = Object.fromEntries(formData);

        if (!recipeData.title || !recipeData.description || !recipeData.timeToCook) {
            alert("Please fill in all required fields");
            return;
        }

        if (isNaN(recipeData.timeToCook) || Number(recipeData.timeToCook) <= 0) {
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
        <div className={styles['container']}>
            <h1>Edit Recipe</h1>
            <form className="col-lg-6 offset-lg-3" onSubmit={onSubmit}>
                <div className={styles['form-group']}>
                    <p>Title</p>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={currentRecipe.title} onChange={(e) => setCurrentRecipe({ ...currentRecipe, title: e.target.value })}
                    />
                </div>
                <div className={styles['form-group']}>
                    <p>Description</p>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={currentRecipe.description}
                    />
                </div>
                <div className={styles['form-group']}>
                    <p>Time to cook (minutes)</p>
                    <input
                        type="number"
                        id="timeToCook"
                        name="timeToCook"
                        defaultValue={currentRecipe.timeToCook}
                    />
                </div>
                <div className={styles['form-group']}>
                    <p>Image URL:</p>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        defaultValue={currentRecipe.imageUrl}
                    />
                </div>
                <div className={styles['form-group']}>
                    <p>Ingredients</p>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        defaultValue={currentRecipe.ingredients}
                    />
                </div>
                <div className={styles['form-group']}>
                    <p>Steps</p>
                    <textarea
                        id="steps"
                        name="steps"
                        defaultValue={currentRecipe.steps}
                    />
                </div>
                <input type="submit" value="Save Changes" />
                <button type="button" onClick={() => navigate(`/recipes/details/${recipeId}`)}>
                    Cancel
                </button>
            </form>
        </div>
    );
};
