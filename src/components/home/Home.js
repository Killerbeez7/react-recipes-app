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

                        <h1>
                            <strong>От админа!</strong>
                        </h1>
                        <h3>
                            <i>
                                Първите 3 коментара печелят iPhone 16 pro Max
                                super GALAXY gold edition
                            </i>
                        </h3>

                        <hr></hr>
                        <br></br>
                        <ul>
                            <p className={styles["p-style"]}></p>
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
                        <h2>Online since - 05.11.2024</h2>
                        <p>...</p>
                        <p>...</p>
                    </div>
                    <div>
                        <h2>Updates</h2>
                        <br></br>
                        <h4>06.11.2024</h4>
                        <p>- Navigation bar: responsiveness</p>
                        <p>- Search bar: filters </p>
                        <br></br>
                        <h4>07.11.2024</h4>
                        <p>- Navigation bar: style</p>
                        <p>- Search bar: style</p>
                        <p>- profile details, home: form, style</p>
                        <h4>08.11.2024</h4>
                        <p>- added comments</p>
                        <p>- add user profile photo</p>
                        <h4>09.11.2024</h4>
                        <p>- comments: functionality and style</p>
                        <h4>10.11.2024</h4>
                        <p>- Navigation bar: style improvements</p>
                        <p>- comments, add recipe, edit recipe: style update</p>
                        <h4>11.11.2024</h4>
                        <p>- like button: style update</p>
                        <p>- Recipe Edit, Details: update style</p>

                    </div>
                </div>
            </main>
        </>
    );
};
