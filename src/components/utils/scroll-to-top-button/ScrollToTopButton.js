import { useState, useEffect } from "react";
import styles from "./ScrollToTopButton.module.css";

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            className={`${styles.scrollToTop} ${
                isVisible ? styles.visible : ""
            }`}
            onClick={scrollToTop}
        >
            <i class="fa-solid fa-arrow-up"></i>
        </button>
    );
};
