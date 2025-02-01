import styles from "./CookingTipsAndTricks.module.css";

export const CookingTipsAndTricks = () => {
    return (
        <section className={styles.tipsSection}>
            <h2 className={styles.tipsTitle}>Cooking Tips & Tricks</h2>
            <div className={styles.tipsContainer}>
                <article className={styles.tipsItem}>
                    <h3 className={styles.tipsHeading}>
                        5 Kitchen Hacks to Save You Time & Effort
                    </h3>
                    <p className={styles.tipsText}>
                        Discover simple tricks that make cooking faster and easier.
                    </p>
                    <a href="#" className={styles.tipsLink}>Read More</a>
                </article>
                <article className={styles.tipsItem}>
                    <h3 className={styles.tipsHeading}>
                        The Secret to Perfectly Fluffy Pancakes
                    </h3>
                    <p className={styles.tipsText}>
                        Master the technique of making soft, airy pancakes every time.
                    </p>
                    <a href="#" className={styles.tipsLink}>Read More</a>
                </article>
                <article className={styles.tipsItem}>
                    <h3 className={styles.tipsHeading}>
                        How to Store Fresh Herbs Like a Pro
                    </h3>
                    <p className={styles.tipsText}>
                        Learn the best ways to keep herbs fresh for weeks.
                    </p>
                    <a href="#" className={styles.tipsLink}>Read More</a>
                </article>
            </div>
        </section>
    );
};
