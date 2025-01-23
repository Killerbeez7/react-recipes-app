import { Link } from "react-router-dom";
import styles from "./RecipeItem.module.css";

export const RecipeItem = ({ recipe }) => {
    return (
        <div className={styles.recipeItem}>
            <Link to={`/recipes/details/${recipe.id}`} className={styles.recipeLink}>
                <div className={styles.recipeImageContainer}>
                    <div className={styles.difficultyBadge}>{recipe.difficulty || "Easy"}</div>
                    <img src={recipe.imageUrl} alt={recipe.title} className={styles.recipeImage} />
                </div>

                <div className={styles.recipeContent}>
                    <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                    <p className={styles.recipeDescription}>{recipe.description}</p>
                    <div className={styles.recipeMeta}>
                        <span>
                            <i class="fa-solid fa-clock" /> {recipe.timeToCook} min
                        </span>
                        <span><i class="fa-solid fa-burger"></i> {recipe.servings} servings</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};
