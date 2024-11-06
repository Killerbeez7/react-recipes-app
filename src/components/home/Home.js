import styles from "./Home.module.css";
import cx from "classnames";

export const Home = () => {
    return (
        <>
            <main className={styles["main-wrapper"]}>
                <div className={styles["content-wrapper"]}>
                    <div
                        className={cx(
                            styles["trending-recipes"],
                            styles.sections
                        )}
                    >
                        <p className={styles["home-titles"]}>
                            Trending recipes:
                        </p>
                        <br></br>
                        <hr></hr>

                        <h1><strong>От админа!</strong></h1>
                        <h3><i>Първите 3 коментара печелят iPhone 16 pro Max super GALAXY gold edition</i></h3>
                        <hr></hr>
                        <br></br>
                        <ul>
                        <p className={styles["p-style"]}>От днес 11.05.2024 сме онлайн!</p>
                            <p></p>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div className={styles["horizontal-row"]}>
                        <div
                            className={cx(
                                styles["cooking-tips"],
                                styles.sections
                            )}
                        >
                            <p className={styles["home-titles"]}>
                                Cooking tips:
                            </p>
                            <ul>
                                <li>dadasfasfas</li>
                                <li>gagagadfad</li>
                                <li>gagagadfad</li>
                            </ul>
                        </div>
                        <div
                            className={cx(
                                styles["easy-recipes"],
                                styles.sections
                            )}
                        >
                            <p className={styles["home-titles"]}>
                                Easy Recipes
                            </p>
                            <ul>
                                <li>fafasfdaad</li>
                                <li>gagagadfad</li>
                                <li>gagagadfad</li>
                            </ul>
                        </div>
                    </div>
                    <div className={cx(styles["food-news"], styles.sections)}>
                        <p className={styles["home-titles"]}>Food News</p>
                        <ul>
                            <li>dasfadff</li>
                            <li>gagagadfad</li>
                            <li>gagagadfad</li>
                        </ul>
                    </div>
                    <div
                        className={cx(
                            styles["cleaning-organizing"],
                            styles.sections
                        )}
                    >
                        <p className={styles["home-titles"]}>
                            Cleaning & Organizing
                        </p>
                        <ul>
                            <li>fafsafadf</li>
                            <li>gagagadfad</li>
                            <li>gagagadfad</li>
                        </ul>
                    </div>
                </div>
                <div
                    className={cx(styles["side-menu-wrapper"], styles.sections)}
                >
                    <div>
                        <h2>menu one</h2>
                        <p>babfababa</p>
                        <p>babfababa</p>
                        <p>babfababa</p>
                    </div>
                    <div>
                        <h2>menu two</h2>
                        <p>babfababa</p>
                        <p>babfababa</p>
                        <p>babfababa</p>
                    </div>
                </div>
            </main>
        </>
    );
};
