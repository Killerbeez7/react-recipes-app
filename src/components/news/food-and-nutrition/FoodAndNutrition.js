import styles from "./FoodAndNutrition.module.css";

export const FoodAndNutrition = () => {
    return (
        <section className={styles.nutritionSection}>
            <h2 className={styles.nutritionTitle}>Food & Nutrition News</h2>
            <article className={styles.nutritionItem}>
                <h3 className={styles.nutritionHeading}>
                    Latest Study: Is Olive Oil Really That Healthy?
                </h3>
                <p className={styles.nutritionText}>
                    A look at the newest research on olive oil's health benefits.
                </p>
                <a href="#" className={styles.nutritionLink}>Read More</a>
            </article>
            <article className={styles.nutritionItem}>
                <h3 className={styles.nutritionHeading}>
                    The Truth About Sugar Substitutes – Are They Safe?
                </h3>
                <p className={styles.nutritionText}>
                    We break down the pros and cons of popular sugar alternatives.
                </p>
                <a href="#" className={styles.nutritionLink}>Read More</a>
            </article>
        </section>
    );
};
