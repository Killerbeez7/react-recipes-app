import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import styles from "./RecipeAdd.module.css";

export const RecipeAdd = () => {
    const [values, setValues] = useState({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        authorId: "Unknown",
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

        setIsSubmitting(true);

        try {
            await addRecipe(values);
            navigate(`/recipes/list`);
        } catch (error) {
            console.error("Error adding recipe:", error);
        } finally {
            setIsSubmitting(false);
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
