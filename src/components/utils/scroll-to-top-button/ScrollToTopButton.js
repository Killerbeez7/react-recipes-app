import { useState, useEffect } from "react";
import styles from "./ScrollToTopButton.module.css";

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = window.innerHeight * 0.35; // Show after 35% of viewport height
            const minPageHeight = 1500; // Only show if the page is at least 1500px tall

            if (document.body.scrollHeight > minPageHeight) {
                setIsVisible(window.scrollY > scrollThreshold);
            } else {
                setIsVisible(false); // Hide if page is too short
            }
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
