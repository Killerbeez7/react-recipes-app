import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { RecipeItem } from "../recipe-item/RecipeItem";
import styles from "./RecipeList.module.css";
import { useAuth } from "../../../contexts/AuthContext";

export const RecipeList = () => {
    const { currentUser } = useAuth();
    const { recipes } = useContext(RecipeContext);
    const { category } = useParams();
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    useEffect(() => {
        setFilteredRecipes(
            category ? recipes.filter((r) => r.categories?.includes(category)) : recipes
        );
    }, [category, recipes]);

    return (
        <div className={styles.recipeGrid}>
            {currentUser && (
                <Link to="/recipes/add" className={styles.addRecipeCard}>
                    <div className={styles.addIcon}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="white"
                        >
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <p>Add Recipe</p>
                </Link>
            )}
            {filteredRecipes.map((recipe) => (
                <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
};
