import { useContext, useState, useEffect } from "react";
import { RecipeContext } from "../../contexts/RecipeContext";
import styles from "./Search.module.css";
import cx from "classnames"; // For class merging if needed

export const Search = () => {
    const { filterRecipes } = useContext(RecipeContext);
    const [search, setSearch] = useState("");
    const [criteria, setCriteria] = useState("title");

    useEffect(() => {
        const handleGlobalClick = (e) => {
            const target = e.target;

            // Exclude clicks on the search button
            if (target.tagName === "A" || (target.tagName === "BUTTON" && !target.dataset.noReset)) {
                onResetSearch();
            }
        };

        document.addEventListener("click", handleGlobalClick);

        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onSearchSubmit = (e) => {
        e.preventDefault();
        filterRecipes(search, criteria);
    };

    const onSearchCriteriaChange = (e) => {
        setCriteria(e.target.value);
    };

    const onResetSearch = () => {
        setSearch(""); // Clear search input
        setCriteria("title"); // Default back to title
        filterRecipes("", "title"); // Reset to show all recipes
    };

    return (
        <form className={styles["search-form"]} onSubmit={onSearchSubmit}>
            <h2>
                <span>Search Recipes</span>
            </h2>
            <div className={styles["search-input-container"]}>
                <input
                    type="text"
                    placeholder="Search by title or max cooking time..."
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
                        X {/* Reset icon (or you can use FontAwesome as before) */}
                    </button>
                )}
                <button
                    className={styles["btn"]}
                    title="Search"
                    type="submit"
                    data-no-reset
                >
                    🔍 {/* Search icon */}
                </button>
            </div>

            <div className={styles["filter"]}>
                <span>Search Criteria:</span>
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
