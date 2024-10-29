import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { useAuth } from "../../../contexts/AuthContext";

import styles from "./RecipeAdd.module.css";

export const RecipeAdd = () => {
    const { currentUser } = useAuth();
    const [values, setValues] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        authorId: currentUser.uid,
        imageUrl: "",
        likes: 0,
        timeToCook: ""
    });

    const { addRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const changeHandler = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Basic validation to ensure the required fields are filled in
        if (!values.title || !values.description || !values.timeToCook) {
            alert("Please fill in all required fields");
            return;
        }

        // Additional validation to ensure data types are correct
        if (isNaN(values.timeToCook) || Number(values.timeToCook) <= 0) {
            alert("Time to cook must be a positive number");
            return;
        }

        if (values.imageUrl && !isValidUrl(values.imageUrl)) {
            alert("Please provide a valid URL for the image");
            return;
        }

        setIsSubmitting(true);

        try {
            await addRecipe(values);
            navigate(`/recipes/list`);
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("There was an error adding the recipe. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
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
                    />
                </div>

                <div className={styles["buttons-form"]}>
                    <button
                        type="submit"
                        className={styles.btn}
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                    <Link className={styles.btn} to={`/recipes/list`}>Cancel</Link>
                </div>
            </form>
        </div>
    );
};
