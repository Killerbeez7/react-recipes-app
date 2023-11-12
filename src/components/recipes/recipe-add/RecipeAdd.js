import { useState } from 'react';
import { Link } from 'react-router-dom';

import { RecipeContext } from '../../../contexts/RecipeContext';
import { useContext } from 'react';

import * as recipeService from '../../../services/recipeService';

export const RecipeAdd = () => {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        name: '',
        description: '',
        timeToCook: '',
        imageUrl: '',
        steps: '',
    });

    const changeHandler = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const { addRecipe } = useContext(RecipeContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const recipeData = values;
        recipeService.create(recipeData).then((result) => {
            addRecipe(result);
        });
    };

    // Validators
    const minLength = (e, limit) => {
        setErrors((state) => ({
            ...state,
            [e.target.name]: values[e.target.name].length < limit,
        }));
    };

    const isFormValid = !Object.values(errors).some((x) => x);

    return (
        <>
            <div
                style={{
                    padding: 80,
                    margin: 80,
                    backgroundColor: 'lightgreen',
                }}
            >
                <h1 style={{ color: 'blue' }}>add recipe</h1>
                <form
                    id="create"
                    className="col-lg-6 offset-lg-3"
                    onSubmit={onSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="name">Recipe name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="recipe name"
                            value={values.name}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="recipe description"
                            value={values.description}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="timeToCook">Time to cook:</label>
                        <input
                            type="text"
                            id="timeToCook"
                            name="timeToCook"
                            placeholder="preparation time"
                            value={values.timeToCook}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 1)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUrl">ImageUrl:</label>
                        <input
                            type="text"
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="image link"
                            value={values.imageUrl}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="steps">steps:</label>
                        <input
                            type="text"
                            id="steps"
                            name="steps"
                            placeholder="recipe steps"
                            value={values.steps}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <input
                        type="submit"
                        value="Add Recipe"
                        disabled={!isFormValid}
                    />
                    <Link className="view-recipe-btn" to={`/recipes/list`}>
                        Cancel
                    </Link>
                </form>
            </div>
        </>
    );
};