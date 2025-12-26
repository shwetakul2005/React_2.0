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
        <label>
            {/* <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={onChangeBtn}
                checked={themeMode==="dark"}
            /> */}
            <div></div>
            {/* <span >Toggle Theme</span> */}
            <button className="theme-btn" onClick={toggleTheme}>{themeMode === "light" ? "Dark Mode" : "Light Mode"}</button>
        </label>
    );
}


