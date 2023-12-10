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
                            <a href="https://www.google.com/search?q=green+salads&sca_esv=589569211&rlz=1C1KNTJ_enBG1067BG1067&ei=xsN1ZaXdM8PAxc8Px6qM2AU&ved=0ahUKEwil2MOUg4WDAxVDYPEDHUcVA1sQ4dUDCBA&uact=5&oq=green+salads&gs_lp=Egxnd3Mtd2l6LXNlcnAiDGdyZWVuIHNhbGFkczILEAAYgAQYigUYkQIyCxAAGIAEGIoFGJECMgsQABiABBiKBRiRAjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyCxAAGIAEGIoFGJECMgUQABiABDIFEAAYgARIphNQAFjXEnAAeAGQAQCYAbIBoAHpCqoBBDAuMTG4AQPIAQD4AQHCAhAQLhiABBiKBRhDGMcBGNEDwgIKEAAYgAQYigUYQ8ICHxAuGIAEGIoFGEMYxwEY0QMYlwUY3AQY3gQY4ATYAQHCAgsQLhiABBiKBRiRAsICBRAuGIAEwgILEC4YgAQYxwEYrwHCAgoQLhiABBiKBRhDwgIIEAAYgAQYyQPCAgsQLhivARjHARiABMICCBAuGNQCGIAE4gMEGAAgQYgGAboGBggBEAEYFA&sclient=gws-wiz-serp">
                                <div className={styles["overlay"]}>
                                    <p>Green salad</p>
                                </div>
                            </a>
                        </div>

                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/steak.jpg)",
                                }}
                            />
                            <a href="https://www.google.com/search?q=steak+picture&sca_esv=589569211&rlz=1C1KNTJ_enBG1067BG1067&ei=S8R1ZYrdJaaLxc8P0oaD0AI&ved=0ahUKEwjKruvTg4WDAxWmRfEDHVLDACoQ4dUDCBA&uact=5&oq=steak+picture&gs_lp=Egxnd3Mtd2l6LXNlcnAiDXN0ZWFrIHBpY3R1cmUyBBAAGEcyBBAAGEcyBBAAGEcyBBAAGEcyBBAAGEcyBBAAGEcyBBAAGEcyBBAAGEdI0QhQ3QFY3QFwAXgCkAEAmAEAoAEAqgEAuAEDyAEA-AEBwgIKEAAYRxjWBBiwA-IDBBgAIEGIBgGQBgg&sclient=gws-wiz-serp">
                                <div className={styles["overlay"]}>
                                    <div className={styles["subtitle"]}>
                                        Steak
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className={styles["table-item"]}>
                            <div
                                className={styles["img-background"]}
                                style={{
                                    backgroundImage: "url(/assets/fish.JPG)",
                                }}
                            />
                            <a href="https://www.google.com/search?q=cooked+fish&sca_esv=589569211&rlz=1C1KNTJ_enBG1067BG1067&ei=asR1ZeTuOMK6xc8PtZuK2Ac&oq=coocked+fish&gs_lp=Egxnd3Mtd2l6LXNlcnAiDGNvb2NrZWQgZmlzaCoCCAAyCxAAGIAEGIoFGJECMgsQABiABBiKBRiRAjILEAAYgAQYigUYkQIyCxAAGIAEGIoFGJECMgoQABiABBiKBRhDMgoQABiABBiKBRhDMgcQABiABBgKMgcQABiABBgKMgcQABiABBgKMgcQABiABBgKSNcgUABY4hhwAHgBkAEAmAH0AaABrw6qAQYwLjExLjG4AQPIAQD4AQHCAgwQABiABBiKBRhDGArCAg0QLhiABBiKBRhDGNQCwgIKEC4YgAQYigUYQ8ICBRAAGIAEwgILEC4YgAQYxwEY0QPCAhAQLhiABBiKBRhDGMcBGNEDwgIFEC4YgATCAgcQLhiABBgKwgINEC4YgAQYxwEYrwEYCsICDRAuGK8BGMcBGIAEGAriAwQYACBBiAYB&sclient=gws-wiz-serp">
                                <div className={styles["overlay"]}>
                                    <div className={styles["subtitle"]}>
                                        Fish
                                    </div>
                                </div>
                            </a>
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
