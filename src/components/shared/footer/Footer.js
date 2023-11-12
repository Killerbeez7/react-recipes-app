import styles from './Footer.module.css'

export const Footer = (props) => {
    return (
        <div className={styles["footer-wrapper"]}>
            <div className={styles["left-side"]}>
                <h1 className={styles["footer-text"]}>Eat & Amare, your recipe library.</h1>
            </div>
            <div className={styles["right-side"]}>
                <h1 className={styles["footer-text"]}>Enjoy your meal!</h1>
            </div>
        </div>
    );
};
