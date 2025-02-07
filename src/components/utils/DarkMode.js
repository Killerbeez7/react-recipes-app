import { useState, useEffect } from "react";

export const DarkMode = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("darkMode");
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    return { darkMode, toggleTheme };
};
