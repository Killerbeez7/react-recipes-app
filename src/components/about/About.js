import styles from "./About.module.css";
import cx from "classnames";

// className={styles["content-wrapper"]}


export const About = () => {
    return <>
        <div
            className={cx(
                styles["main"]
            )}
        >
            <h1>About</h1>;
        </div>
    </>
};
