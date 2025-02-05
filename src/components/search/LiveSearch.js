import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeContext } from "../../contexts/RecipeContext";
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
                onClick={() => setShowSearch((prev) => !prev)}
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
                                    {recipe.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
