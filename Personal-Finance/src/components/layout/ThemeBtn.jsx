import React from "react";
import useTheme from "../../context/ThemeContext";

export default function ThemeBtn() {
    
    const {themeMode, lightTheme, darkTheme}=useTheme()
    const toggleTheme = () => {
        if (themeMode === "dark") {
            lightTheme();
        } else {
            darkTheme();
        }
    };

    return (
        <button 
            className={`theme-toggle-btn ${themeMode}`} 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {themeMode === "light" ? (
                <span className="theme-icon">🌙</span> // Moon for switching to dark
            ) : (
                <span className="theme-icon">☀️</span> // Sun for switching to light
            )}
        </button>
    );
}


