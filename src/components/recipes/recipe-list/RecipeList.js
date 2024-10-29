import { Link } from "react-router-dom";
import { useContext } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";
import { RecipeItem } from "../recipe-item/RecipeItem";
import styles from "./RecipeList.module.css";
import { Search } from "../../search/Search";
import { useAuth } from "../../../contexts/AuthContext";

export const RecipeList = () => {
    const { currentUser } = useAuth();
    const { recipes } = useContext(RecipeContext); // Get recipes from context

    return (
        <>
            <Search />

            <form style={{ marginLeft: "3%" }}>
                {currentUser && (
                    <Link to="/recipes/add" className={styles["add-btn"]}>
                        Add recipe
                    </Link>
                )}
            </form>

            <ul className={styles["recipe-list-wrapper"]} style={{ width: `${100}%` }}>
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div>
                            <RecipeItem key={recipe.id} recipe={recipe} />
                            <p>{recipe.id}!!!!!!!!!!!!!!!!1</p>
                        </div>
                    ))
                ) : (
                    <h1>No recipes yet!</h1>
                )}
            </ul>
        </>
    );
};
