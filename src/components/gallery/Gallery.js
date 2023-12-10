import styles from "./Gallery.module.css";

export const Gallery = () => {
    return (
        <>
            <>
                <div className={styles["gallery-title-wrapper"]}>
                    <div className={styles["gallery-title"]}>
                        Find the meal you want and learn how to cook it.
                    </div>
                </div>
                <div className={styles["content"]}>
                    <div className={styles["table-wrapper"]}>
                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/salad.jpg)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <p>Green salad</p>
                            </div>
                        </div>

                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/steak.jpg)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Steak</div>
                            </div>
                        </div>
                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/fish.JPG)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Fish</div>
                            </div>
                        </div>
                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/pasta.JPG)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Pasta</div>
                            </div>
                        </div>
                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/cake.jpeg)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Cake</div>
                            </div>
                        </div>
                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage:
                                        "url(/assets/icecream.JPG)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>
                                    Ice Cream
                                </div>
                            </div>
                        </div>

                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/pizza.JPG)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Pizza</div>
                            </div>
                        </div>

                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/juice.JPG)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Juice</div>
                            </div>
                        </div>

                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/wine.JPG)",
                                }}
                            />
                            <div className={styles["overlay"]}>
                                <div className={styles["subtitle"]}>Wines</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
};
