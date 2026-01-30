import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem("theme");
        if (saved) return saved;
        // Check system preference
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "dark";
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeContext;
