import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./Search.module.css";
import cx from "classnames";

import { useState } from "react";

export const Search = () => {
    const [search, setSearch] = useState("");
    const [criteria, setCriteria] = useState("all");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onSearchSubmit = (e) => {
        e.preventDefault();
        console.log(search);
        console.log(criteria);
    };

    const onSearchCriteriaChange = (e) => {
        setCriteria(e.target.value);
    };

    return (
        <form className={styles["search-form"]} onSubmit={onSearchSubmit}>
            <h2>
                <span>Search recipes</span>
            </h2>
            <div className={styles["search-input-container"]}>
                <input
                    type="text"
                    placeholder="Please, select the search criteria"
                    name="search"
                    onChange={onSearchChange}
                    value={search}
                />
                {search.length > 0 && (
                    <button
                        className={cx(styles.btn, styles["close-btn"])}
                        onClick={() => setSearch("")}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                )}
                <button
                    className={styles["btn"]}
                    title="Please, select the search criteria"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>

            <div className={styles["filter"]}>
                <span>Search Criteria:</span>
                <select
                    name="criteria"
                    className={styles.criteria}
                    onChange={onSearchCriteriaChange}
                >
                    <option values="all">Not selected</option>
                    <option value="name">Recipe name</option>
                    <option value="timeToCook">Time to cook</option>
                    <option value="ingredients">ingredients</option>
                </select>
            </div>
        </form>
    );
};
