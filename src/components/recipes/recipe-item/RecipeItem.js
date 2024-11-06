import { Link } from "react-router-dom";
import styles from "./RecipeItem.module.css";

export const RecipeItem = ({ recipe }) => {
    return (
        <><h3 className={styles["cook-time"]}>
            Time to cook: {recipe.timeToCook} min
        </h3>
            <li className={styles["recipe-list-item-wrapper"]}>

                <div className={styles["recipe-image-wrapper"]}>
                    <img
                        alt={recipe.title}
                        src={recipe.imageUrl}
                        className={styles["recipe-img"]}
                    />
                </div>
                <div className={styles["recipe-content-wrapper"]}>
                    <div className={styles["recipe-name-wrapper"]}>
                        <h3>{recipe.title}</h3>
                    </div>
                    <div className={styles["recipe-description-wrapper"]}>
                        <p>
                            <strong>Description: </strong>
                            {recipe.description}
                        </p>
                    </div>
                    <div className={styles["recipe-ingredients-wrapper"]}>
                        <p>
                            <strong>Ingredients: </strong>
                            {recipe.ingredients}
                        </p>
                    </div>
                    <div className={styles["recipe-steps-wrapper"]}>
                        <p className={styles["steps-styles"]}>
                            <strong>Steps: </strong>
                            {recipe.steps}
                        </p>
                    </div>
                </div>
                <div>
                    <Link
                        to={`/recipes/details/${recipe.id}`}
                        className={styles["view-recipe-btn"]}
                    >
                        View
                    </Link>

                </div>
            </li>
        </>
    );
};
