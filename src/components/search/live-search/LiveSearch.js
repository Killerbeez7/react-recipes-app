import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeContext } from "../../../contexts/RecipeContext";
import styles from "./LiveSearch.module.css";

export const LiveSearch = () => {
    const [query, setQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();
    const { recipes } = useContext(RecipeContext);

    useEffect(() => {
        if (query.trim() === "") {
            setFilteredResults([]);
            setShowDropdown(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            const results = recipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(query.toLowerCase())
            );
            console.log(results);

            setFilteredResults(results);
            setShowDropdown(results.length > 0);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, recipes]);

    const handleSelect = (id) => {
        navigate(`/recipes/details/${id}`);
        setQuery("");
        setShowDropdown(false);
        setShowSearch(false);
    };

    const handleSearchOpen = () => {
        setShowSearch((prev) => !prev);
        setQuery("");
    };

    return (
        <div
            className={`${styles.searchContainer} ${
                showSearch ? styles.active : ""
            }`}
        >
            <button
                className={`${styles.searchIcon} ${
                    showSearch ? styles.searchIconContrast : ""
                }`}
                onClick={handleSearchOpen}
            >
                <i className="fa-solid fa-magnifying-glass" />
            </button>

            {showSearch && (
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search recipes..."
                        className={styles.searchInput}
                        autoFocus
                    />
                    {showDropdown && (
                        <ul className={styles.searchDropdown}>
                            {filteredResults.map((recipe) => (
                                <li
                                    key={recipe.id}
                                    onClick={() => handleSelect(recipe.id)}
                                    className={styles.searchItem}
                                >
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className={styles.searchImg}
                                    />
                                    <div className={styles.searchText}>
                                        <span className={styles.recipeTitle}>
                                            {recipe.title}
                                        </span>
                                        <span className={styles.recipeDesc}>
                                            {recipe.description}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
