import { useContext, useState, useEffect } from "react";
import { RecipeContext } from "../../contexts/RecipeContext";
import styles from "./Search.module.css";
import cx from "classnames";

export const Search = () => {
    const { filterRecipes } = useContext(RecipeContext);
    const [search, setSearch] = useState("");
    const [criteria, setCriteria] = useState("title");

    useEffect(() => {
        const handleGlobalClick = (e) => {
            const target = e.target;

            if (
                target.tagName === "A" ||
                (target.tagName === "BUTTON" && !target.dataset.noReset)
            ) {
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
        setSearch("");
        setCriteria("title");
        filterRecipes("", "title");
    };


    return (
        <form className={styles["search-form"]} onSubmit={onSearchSubmit}>
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
                        X{" "}
                    </button>
                )}
                <button
                    className={styles["btn"]}
                    title="Search"
                    type="submit"
                    data-no-reset
                >
                    🔍  
                </button>
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
