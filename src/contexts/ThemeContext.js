import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem("darkMode");
        if (saved !== null) return JSON.parse(saved);
    } catch {}
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        try {
            localStorage.setItem("darkMode", JSON.stringify(darkMode));
        } catch {}
    }, [darkMode]);

    const toggleTheme = () => setDarkMode((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
