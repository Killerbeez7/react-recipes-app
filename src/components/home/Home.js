import { useState } from "react";
import styles from "./Home.module.css";
import cx from "classnames";

export const Home = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={cx(styles.wrapper, { [styles.dark]: darkMode })}>
            <header className={styles.hero}>
                <h1 className={styles.slogan}>Find Your Next Meal</h1>
                <button onClick={() => setDarkMode(!darkMode)} className={styles.darkModeToggle}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </header>

            <main className={styles.mainWrapper}>
                <div className={styles.contentWrapper}>
                    <section className={styles.trendingRecipes}>
                        <h2 className={styles.homeTitles}>Trending</h2>
                        <div className={styles.recipeGrid}>
                            {["Recipe 1", "Recipe 2", "Recipe 3"].map((recipe, index) => (
                                <div key={index} className={styles.recipeCard}>
                                    <p>{recipe}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.sections}>
                        <h2 className={styles.homeTitles}>Cooking Tips</h2>
                        <ul>
                            <li>Use fresh ingredients</li>
                            <li>Preheat your oven</li>
                            <li>Balance flavors</li>
                        </ul>
                    </section>
                </div>

                <aside className={styles.sideMenuWrapper}>
                    <h2>Updates</h2>
                    <p>New features and improvements</p>
                </aside>
            </main>

            <footer className={styles.footer}>© 2025 FoodHub</footer>
        </div>
    );
};