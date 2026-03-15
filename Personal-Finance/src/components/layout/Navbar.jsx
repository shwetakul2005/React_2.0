import PocketPalLogo from "../../assets/PocketPalLogo2.1.png";
import './Navbar.css'
import { useState, useEffect } from 'react'
import ThemeBtn from "./ThemeBtn";

const NavBar = () => {
  const [userName, setUserName] = useState("Shweta");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("pocketpal_username");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleNameSave = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem("pocketpal_username", tempName.trim());
    }
    setIsEditing(false);
  };

  const startEditing = () => {
    setTempName(userName);
    setIsEditing(true);
  };

  return (
    <nav className="navbar">
      <ul className="nav-container">

        <li className="nav-left">
          <img src={PocketPalLogo} className="nav-logo" alt="logo" />
          <span className="nav-title">PocketPal</span>
        </li>

        <li className="nav-center">
          <div className="greeting-container">
            <h1>
              Hi,{" "}
              {isEditing ? (
                <form onSubmit={handleNameSave} className="name-edit-form">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    autoFocus
                    onBlur={handleNameSave}
                    className="name-input"
                    maxLength={15}
                  />
                </form>
              ) : (
                <span className="user-name" onClick={startEditing} title="Click to edit name">
                  {userName}
                </span>
              )}

            </h1>
            <p className="greeting-subtext">Welcome back to your finances</p>
          </div>
        </li>

        <li className="nav-right">
          <ThemeBtn />
        </li>

      </ul>
    </nav>
  );
};

export default NavBar;