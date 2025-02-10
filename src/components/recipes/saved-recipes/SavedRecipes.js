import { Link } from "react-router-dom";
import styles from "./SavedRecipes.module.css";

export const SavedRecipes = () => {
    return (
        <>
            <div  className={styles.savedMain}>
                <h1 className={styles.savedTitle}>SavedRecipes</h1>
                <p className={styles.savedDesc}>No saved recipes yet. Please log in and save some!</p>
            </div>
        </>
    );
};
