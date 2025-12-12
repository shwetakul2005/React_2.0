// component/NavBar.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { NavLink } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import Budget from "../../pages/Budget";
import Insights from "../../pages/Insights";
import Reports from "../../pages/Reports";
import Transactions from "../../pages/Transactions";
import Categories from "../../pages/Categories";
import './SideBar.css'

const SideBar = () => {
  return (
    <>
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/budget">Budget</NavLink>
        </li>
        <li>
          <NavLink to="/categories">Categories</NavLink>
        </li>
        <li>
          <NavLink to="/insights">Insights</NavLink>
        </li>
        <li>
          <NavLink to="/reports">Reports</NavLink>
        </li>
        <li>
          <NavLink to="/transaction">Transaction</NavLink>
        </li>
      </ul>
    </nav>

    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </>
  );
};

export default SideBar;