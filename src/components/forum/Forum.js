import styles from "./Forum.module.css";
import cx from "classnames";

// className={styles["content-wrapper"]}


export const Forum = () => {
    return <>
        <div
            className={cx(
                styles["main-wrapper"]
            )}
        >
            <h1>Forum</h1>;
        </div>
    </>
};


