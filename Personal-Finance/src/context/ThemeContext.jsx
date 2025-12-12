import React, {useContext} from 'react'

// these are the global values and functions we want various 
// components to access without prop drilling
export const ThemeContext = createContext({
    themeMode: "light",
    darkTheme: () => {},
    lightTheme: () => {},
})

export const ThemeProvider = ThemeContext.Provider

// returns useContext
export default function useTheme(){
    return useContext(ThemeContext)
}