import { Link } from "react-router-dom";
// import { RecipeItem } from "../recipe-item/RecipeItem";

import { useContext } from "react";
import { RecipeContext } from "../../../contexts/RecipeContext";

import styles from "./RecipeList.module.css";
import { Search } from "../../search/Search";
import { useAuth } from "../../../contexts/AuthContext";

export const RecipeList = () => {
    const { currentUser } = useAuth()

    // const { recipes } = useContext(RecipeContext);

    return (
        <>
            <Search></Search>

            <form style={{ marginLeft: "3%" }}>
                {currentUser && (
                    <Link to="/recipes/add" className={styles["add-btn"]}>
                        Add recipe
                    </Link>
                )}
            </form>

            <ul
                className={styles["recipe-list-wrapper"]}
                style={{ width: `${100}%` }}
            >
                {/* {recipes.length > 0 ? (
                    recipes.map((x) => <RecipeItem key={x._id} recipe={x} />)
                ) : (
                    <h1>No recipes yet!</h1>
                )} */}
            </ul>
        </>
    );
};
