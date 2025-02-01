import styles from "./FoodCultureAndTravel.module.css";

export const FoodCultureAndTravel = () => {
    return (
        <section className={styles.travelSection}>
            <h2 className={styles.travelTitle}>Food Culture & Travel</h2>
            <div className={styles.travelList}>
                <div className={styles.travelItem}>
                    <h3 className={styles.travelHeading}>
                        Flavors of the World: Exploring Thai Street Food
                    </h3>
                    <p className={styles.travelText}>
                        Discover the vibrant street food culture of Thailand.
                    </p>
                    <a href="#" className={styles.travelLink}>Read More</a>
                </div>
                <div className={styles.travelItem}>
                    <h3 className={styles.travelHeading}>
                        Regional Specialties: What Makes Southern BBQ Unique?
                    </h3>
                    <p className={styles.travelText}>
                        Unravel the smoky secrets behind the best Southern BBQ styles.
                    </p>
                    <a href="#" className={styles.travelLink}>Read More</a>
                </div>
            </div>
        </section>
    );
};
