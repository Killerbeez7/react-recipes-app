import styles from "./Home.module.css";
// import classNames from "classnames";

export const Home = () => {
    return (
        <>
            <main className={styles["main-wrapper"]}>
                <content className={styles["content-wrapper"]}>
                    <div className={styles[("sections", "trending-recipes")]}>
                        <p className={styles["home-titles"]}>
                            Trending recipes:
                        </p>
                        <ul>
                            <li>gagagadfad</li>
                            <li>gagagadfad</li>
                            <li>gagagadfad</li>
                        </ul>
                    </div>
                    <span className={styles["horizontal-row"]}>
                        <div className={styles[("sections", "cooking-tips")]}>
                            <p className={styles["home-titles"]}>
                                Cooking tips:
                            </p>
                            <ul>
                                <li>dadasfasfas</li>
                                <li>gagagadfad</li>
                                <li>gagagadfad</li>
                            </ul>
                        </div>
                        <div className={styles[("sections", "easy-recipes")]}>
                            <p className={styles["home-titles"]}>
                                Easy Recipes
                            </p>
                            <ul>
                                <li>fafasfdaad</li>
                                <li>gagagadfad</li>
                                <li>gagagadfad</li>
                            </ul>
                        </div>
                    </span>
                    <div className={styles[("sections", "food-news")]}>
                        <p className={styles["home-titles"]}>Food News</p>
                        <ul>
                            <li>dasfadff</li>
                            <li>gagagadfad</li>
                            <li>gagagadfad</li>
                        </ul>
                    </div>
                    <div
                        className={styles[("sections", "cleaning-organizing")]}
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
                </content>
                <sidemenu className={styles["side-menu-wrapper"]}>
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
                </sidemenu>
            </main>
        </>
    );
};
