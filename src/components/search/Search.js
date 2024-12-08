import { useContext, useState } from "react";
import { RecipeContext } from "../../contexts/RecipeContext";
import styles from "./Search.module.css";
import cx from "classnames";

export const Search = () => {
    const { filterRecipes } = useContext(RecipeContext);
    const [search, setSearch] = useState("");
    const [criteria, setCriteria] = useState("title");

    const onSearchChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);

        filterRecipes(newSearch, criteria);
    };

    const onSearchCriteriaChange = (e) => {
        const newCriteria = e.target.value;
        setCriteria(newCriteria);
        filterRecipes(search, newCriteria);
    };

    const onResetSearch = () => {
        setSearch("");
        setCriteria("title");
        filterRecipes("", "title");
    };

    return (
        <form className={styles["search-form"]}>
            <h2>
                <span>Search Recipes</span>
            </h2>
            <div className={styles["search-input-container"]}>
                <input
                    type="text"
                    placeholder="Hungry? Let’s find a recipe for you..."
                    name="search"
                    onChange={onSearchChange}
                    value={search}
                />
                {search.length > 0 && (
                    <button
                        className={cx(styles.btn, styles["close-btn"])}
                        type="button"
                        data-no-reset
                        onClick={onResetSearch}
                    >
                        X
                    </button>
                )}
            </div>

            <div className={styles["filter"]}>
                <span>Search by:</span>
                <select
                    name="criteria"
                    className={styles.criteria}
                    onChange={onSearchCriteriaChange}
                    value={criteria}
                >
                    <option value="title">Title</option>
                    <option value="timeToCook">Max Time</option>
                </select>
            </div>
        </form>
    );
};
