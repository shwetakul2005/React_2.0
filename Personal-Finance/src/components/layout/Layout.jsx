import NavBar from './Navbar'
import SideBar from './Sidebar'
import './Layout.css'
import { ThemeProvider } from '../../context/ThemeContext'
import { useEffect, useState } from 'react'

function Layout({ children }) {
  // console.log("Layout rendering!")
  const [themeMode, setThemeMode] = useState("light")
  // console.log("Theme mode:", themeMode)
  const lightTheme = () => {
    // console.log("Light theme function called")
    setThemeMode("light")
  }

  const darkTheme = () => {
    // console.log("Dark theme function called")
    setThemeMode("dark")
  }

  //actual change in theme
  useEffect(() => {
    // console.log("useEffect running, themeMode:", themeMode)
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])

  // console.log("About to return JSX")

  return (
    <ThemeProvider value={{themeMode, darkTheme, lightTheme}}>
    
      <div className='content'>
        <NavBar />
        <div className='main_content'>
          <SideBar />
          <div className='page_content'>
              {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
    
  )
}

export default Layout