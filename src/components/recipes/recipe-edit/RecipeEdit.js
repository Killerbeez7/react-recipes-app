import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RecipeContext } from '../../../contexts/RecipeContext';
import { useContext } from 'react';
import * as recipeService from '../../../services/recipeService';

export const RecipeEdit = () => {
    const [currentRecipe, setCurrentRecipe] = useState({});

    const { editRecipe } = useContext(RecipeContext);

    const { recipeId } = useParams();

    useEffect(() => {
        recipeService.getOne(recipeId).then((recipeData) => {
            setCurrentRecipe(recipeData);
        });
    }, []);

    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const recipeData = Object.fromEntries(new FormData(e.target));

        recipeService.edit(recipeId, recipeData).then((result) => {
            editRecipe(recipeId, result);

            navigate(`/recipes/details/${recipeId}`);
        });
    };

    return (
        <>
            <div
                style={{
                    padding: 80,
                    margin: 100,
                    backgroundColor: 'lightgreen',
                    position: 'relative',
                }}
            >
                <h1 style={{ color: 'blue' }}>Edit Recipe</h1>
                <form className="col-lg-6 offset-lg-3" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Recipe name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={currentRecipe.name}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="decription"
                            name="description"
                            defaultValue={currentRecipe.description}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="timeToCook">Time to cook:</label>
                        <input
                            type="text"
                            id="timeToCook"
                            name="timeToCook"
                            defaultValue={currentRecipe.timeToCook}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image-url">Image URL: </label>
                        <input
                            type="text"
                            id="image-url"
                            name="image-url"
                            defaultValue={currentRecipe.imageUrl}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="steps">steps:</label>
                        <input
                            type="text"
                            id="steps"
                            name="steps"
                            placeholder="recipe steps"
                            defaultValue={currentRecipe.steps}
                        />
                    </div>
                    <input type="submit"></input>
                    <Link className="view-recipe-btn" to={`/recipes/list`}>
                        Cancel
                    </Link>
                </form>
            </div>
        </>
    );
};
