import { Link } from "react-router-dom";
import styles from "./RecipeItem.module.css";


export const RecipeItem = ({ recipe }) => {
    return (
        <>
            <div className={styles.section}>
                <h3 className={styles["cook-time"]}>
                    <i class="fa-regular fa-clock" /> {recipe.timeToCook} min
                </h3>
                <Link
                    to={`/recipes/details/${recipe.id}`}
                    className={styles["recipe-link"]}
                >
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
                            <div
                                className={styles["recipe-description-wrapper"]}
                            >
                                <p className={styles["text-styles"]}>
                                    <strong>Description: </strong>
                                    {recipe.description}
                                </p>
                            </div>
                            <div
                                className={styles["recipe-ingredients-wrapper"]}
                            >
                                <p className={styles["text-styles"]}>
                                    <strong>Ingredients: </strong>
                                    {recipe.ingredients}
                                </p>
                            </div>
                        </div>
                    </li>
                </Link>
            </div>
        </>
    );
};
