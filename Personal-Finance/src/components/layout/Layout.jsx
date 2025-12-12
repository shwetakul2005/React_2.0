import NavBar from './Navbar'
import SideBar from './Sidebar'
import './Layout.css'
import { ThemeProvider } from '../../context/ThemeContext'
import { useEffect } from 'react'
import ThemeBtn from './ThemeBtn'
function Layout({ children }) {

  // const [themeMode, setThemeMode] = useState("light")

  // const lightTheme = () => {
  //   setThemeMode("light")
  // }

  // const darkTheme = () => {
  //   setThemeMode("dark")
  // }

  // //actual change in theme

  // useEffect(() => {
  //   document.querySelector('html').classList.remove("light", "dark")
  //   document.querySelector('html').classList.add(themeMode)
  // }, [themeMode])

  return (
    // <ThemeProvider value={{themeMode, darkTheme, lightTheme}}>
    
    <div className='content'>
      <NavBar />
      <div className='main_content'>
        <SideBar />
        <div className='page_content'>
            {children}
        </div>
      </div>
    </div>
    // </ThemeProvider>
    
  )
}

export default Layout