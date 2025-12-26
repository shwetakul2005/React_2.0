import React, {useContext} from 'react'
import { createContext } from 'react'


// these are the global values and functions we want various 
// components to access without prop drilling
export const ThemeContext = createContext({
    themeMode: "dark",
    darkTheme: () => {},
    lightTheme: () => {},
})

export const ThemeProvider = ThemeContext.Provider

// exporting custom hooks(here useTheme) using useContext
export default function useTheme(){
    return useContext(ThemeContext)
}