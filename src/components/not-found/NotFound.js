import styles from "./NotFound.module.css";
import cx from "classnames";

// className={styles["content-wrapper"]}


export const NotFound = () => {
    return <>
        <div
            className={cx(
                styles["main"]
            )}
        >
            <div>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <a href="/">Go back to Home</a>
            </div>
        </div>
    </>
};

