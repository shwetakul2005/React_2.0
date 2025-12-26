// component/NavBar.js
import PocketPalLogo from "../../assets/PocketPalLogo2.1.png";
import pp from "../../assets/pp.jpeg";
import './Navbar.css'
import { useState } from 'react'
import ThemeBtn from "./ThemeBtn";

const themeToggle = () => setTheme(prev => prev === "light" ? "dark" : "light");


const NavBar = () => {
  const [theme, setTheme] = useState("light")

  return (
    
    <nav className="navbar">
  <ul className="nav-container">
    
    <li className="nav-left">
      <img src={PocketPalLogo} className="nav-logo" alt="logo" />
      <span className="nav-title">PocketPal</span>
    </li>

    <li className="nav-center">
      {/* <input type="text" placeholder="Search.."></input> */}
      <div><h1>Hi Shweta, Welcome back!</h1></div>
    </li>

    <li className="nav-right">
      <img src={pp} className="pp" alt="logo" />
      {/* <button className="theme-btn" onClick={themeToggle}>Theme</button> */}
      <ThemeBtn />
    </li>

  </ul>
</nav>

    
  );
};

export default NavBar;