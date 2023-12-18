import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { RecipeContext } from '../../../contexts/RecipeContext';
import { useContext } from 'react';

import * as recipeService from '../../../services/recipeService';

import styles from './RecipeEdit.module.css'

export const RecipeEdit = () => {
    const [currentRecipe, setCurrentRecipe] = useState({});

    const { editRecipe } = useContext(RecipeContext);
    const { recipeId } = useParams();

    useEffect(() => {
        recipeService.getOne(recipeId).then((recipeData) => {
            setCurrentRecipe(recipeData);
        });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        const recipeData = Object.fromEntries(new FormData(e.target));

        recipeService.edit(recipeId, recipeData).then((result) => {
            editRecipe(recipeId, result);
        });
    };

    return (
        <>
            <div
                className={styles['container']}
            >
                <h1>Edit Recipe</h1>
                <form className="col-lg-6 offset-lg-3" onSubmit={onSubmit}>
                    <div className={styles['form-group']}>
                        <p className={styles.labels}>Recipe name</p>
                        <input
                            type="text"
                            id="name"
                            name="name" 
                            defaultValue={currentRecipe.name}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <p>Description</p>
                        <input
                            type="text"
                            id="decription"
                            name="description"
                            defaultValue={currentRecipe.description}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <p>Time to cook </p>
                        <input
                            type="text"
                            id="timeToCook"
                            name="timeToCook"
                            defaultValue={currentRecipe.timeToCook}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <p>Image URL: </p>
                        <input
                            type="text"
                            id="image-url"
                            name="image-url"
                            defaultValue={currentRecipe.imageUrl}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <p>steps</p>
                        <input
                            type="text"
                            id="steps"
                            name="steps"
                            placeholder="recipe steps"
                            defaultValue={currentRecipe.steps}
                        />
                    </div>
                    <input type="submit"/>
                    <Link className="view-recipe-btn" to={`/recipes/list`}>
                        Cancel
                    </Link>
                </form>
            </div>
        </>
    );
};
