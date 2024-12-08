import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../categoryDropDown/CategoryDropDown.module.css";

export const CategoryDropdown = ({ isMobile }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        if (isMobile) {
            setIsOpen((prev) => !prev);
        }
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <div
            className={`${styles.dropdown} ${
                isMobile ? styles.mobile : styles.desktop
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className={styles.dropdownToggle}
                onClick={toggleDropdown}
                aria-expanded={isOpen}
            >
                Recipes {isMobile ? (isOpen ? "▲" : "▼") : ""}
            </button>
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    <li>
                        <Link to="/recipes/breakfast">Breakfast & Brunch</Link>
                    </li>
                    <li>
                        <Link to="/recipes/lunch">Lunch</Link>
                    </li>
                    <li>
                        <Link to="/recipes/appetizers">Appetizers & Snacks</Link>
                    </li>
                    <li>
                        <Link to="/recipes/dinner">Dinner</Link>
                    </li>
                    <li>
                        <Link to="/recipes/desserts">Dessert</Link>
                    </li>
                    <li>
                        <Link to="/recipes/all">All Recipes</Link>
                    </li>
                </ul>
            )}
        </div>
    );
};
