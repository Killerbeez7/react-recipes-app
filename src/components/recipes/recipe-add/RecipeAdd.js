import { useState } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";

import * as recipeService from "../../../services/recipeService";
import styles from "./RecipeAdd.module.css";

export const RecipeAdd = () => {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        name: "",
        description: "",
        imageUrl: "",
        timeToCook: "",
        ingredients: "",
        steps: "",
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
            <div className={styles["form-container"]}>
                <h1 className={styles["add-recipe-title"]}>add recipe</h1>
                <form
                    id="create"
                    className="col-lg-6 offset-lg-3"
                    onSubmit={onSubmit}
                >
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Recipe name"
                            value={values.name}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Description"
                            value={values.description}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={values.imageUrl}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            id="timeToCook"
                            name="timeToCook"
                            placeholder="Preparation time"
                            value={values.timeToCook}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 1)}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            id="ingredients"
                            name="ingredients"
                            placeholder="Ingredients"
                            value={values.ingredients}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            id="steps"
                            name="steps"
                            placeholder="Preparation steps"
                            value={values.steps}
                            onChange={changeHandler}
                            onBlur={(e) => minLength(e, 3)}
                        />
                    </div>
                    <div className={styles["buttons-form"]}>
                        <button
                            type="submit"
                            value="SUBMIT"
                            className={styles.btn}
                            disabled={!isFormValid}
                        >
                            Submit
                        </button>
                        <Link className={styles.btn} to={`/recipes/list`}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
};
