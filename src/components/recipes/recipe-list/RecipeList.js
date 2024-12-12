import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { RecipeItem } from "../recipe-item/RecipeItem";
import styles from "./RecipeList.module.css";
import { Search } from "../../search/Search";
import { useAuth } from "../../../contexts/AuthContext";

export const RecipeList = () => {
    const { currentUser } = useAuth();
    const { recipes } = useContext(RecipeContext);
    const { category } = useParams();
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    useEffect(() => {
        if (category) {
            const filtered = recipes.filter(
                (recipe) => recipe.categories?.includes(category)
            );
            setFilteredRecipes(filtered);
        } else {
            setFilteredRecipes(recipes);
        }
    }, [category, recipes]);

    return (
        <>
            {/* <Search /> */}

            <form>
                {currentUser && (
                    <Link to="/recipes/add" className={styles["add-btn"]}>
                        Add recipe
                    </Link>
                )}
            </form>
            <div className={styles["section"]}>
                <ul className={styles["recipe-list-wrapper"]}>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <div key={recipe.id}>
                                <RecipeItem recipe={recipe} />
                            </div>
                        ))
                    ) : (
                        <h1 className={styles["no-recipes-message"]}>
                            No recipes found for this category!
                        </h1>
                    )}
                </ul>
            </div>
        </>
    );
};
