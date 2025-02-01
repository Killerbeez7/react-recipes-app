import styles from "./InterviewsAndSpotlight.module.css";

export const InterviewsAndSpotlight = () => {
    return (
        <section className={styles.spotlightSection}>
            <h2 className={styles.spotlightTitle}>Interviews & Spotlights</h2>
            <div className={styles.spotlightContainer}>
                <article className={styles.spotlightItem}>
                    <h3 className={styles.spotlightHeading}>
                        Chef’s Corner: An Interview with [Local Chef Name]
                    </h3>
                    <p className={styles.spotlightText}>
                        We sat down with Chef [Name] to talk about their journey and cooking tips.
                    </p>
                    <a href="#" className={styles.spotlightLink}>Read More</a>
                </article>
                <article className={styles.spotlightItem}>
                    <h3 className={styles.spotlightHeading}>
                        Home Cook of the Month: Your Stories, Your Recipes
                    </h3>
                    <p className={styles.spotlightText}>
                        Meet this month’s featured home cook and their favorite recipe.
                    </p>
                    <a href="#" className={styles.spotlightLink}>Read More</a>
                </article>
            </div>
        </section>
    );
};
