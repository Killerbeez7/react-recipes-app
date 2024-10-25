// RecipeAdd.js
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { database } from "../../../firebase/firebaseConfig"; // Import database
import { ref, set, push } from "firebase/database"; // Import Realtime Database functions
import styles from "./RecipeAdd.module.css";

export const RecipeAdd = () => {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        authorId: "",
        imageUrl: "",
        likes: 0,
        timeToCook: ""
    });

    const { addRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const minLength = (e, limit) => {
        setErrors((state) => ({
            ...state,
            [e.target.name]: values[e.target.name].length < limit,
        }));
    };

    const isFormValid = !Object.values(errors).some((x) => x);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const recipeData = {
                ...values,
                authorId: values.authorId || "Unknown",
                date: new Date().toISOString(),
            };

            // Push a new recipe entry to the "recipes" node in Realtime Database
            const recipeRef = ref(database, "recipes");
            const newRecipeRef = push(recipeRef);
            await set(newRecipeRef, recipeData);

            // Update the context and navigate
            addRecipe({ id: newRecipeRef.key, ...recipeData });
            navigate(`/recipes/list`);
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };

    return (
        <div className={styles["form-container"]}>
            <h1 className={styles["add-recipe-title"]}>Add Recipe</h1>
            <form id="create" className="col-lg-6 offset-lg-3" onSubmit={onSubmit}>
                <div className={styles['form-group']}>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Recipe title"
                        value={values.title}
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
    );
};
