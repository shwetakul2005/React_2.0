// Products.js
import { useNavigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
import { useFinance } from '../context/FinanceContext';
import './Budget.css'
 
const Budget = () => {
   const navigate = useNavigate();
   const {totalSpent} = useCategories();
   const {categories} = useFinance();
   const totalBudget = categories.reduce((sum, category) => sum + category.budgetLimit, 0);
   
   // Inside your Component (e.g., Budget.js or Dashboard.js)

   // 1. Calculate the percentage (Guard against dividing by zero)
   const percentUsed = totalBudget > 0 
      ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) 
      : 0;

   // 2. Determine Color Status based on your rules
   let statusClass = "status-safe"; // Default Green (< 70%)
   if (percentUsed > 90) {
      statusClass = "status-danger"; // Red (> 90%)
   } else if (percentUsed > 70) {
      statusClass = "status-warning"; // Orange (70-90%)
   }

   // 3. Determine Remaining Balance Status
   const remaining = totalBudget - totalSpent;
   const remainingClass = remaining < 0 ? "status-danger" : "status-safe";

return (
    <div className="budget-summary-wrapper">
        
        {/* --- The Three Cards --- */}
        <div className='header-summary-sec'>
            
            {/* Total Budget (Neutral) */}
            <div className='summary-card neutral'>
                <span className="stat-label">Total Budget</span>
                <span className="stat-value">₹{totalBudget}</span>
            </div>

            {/* Total Spent (Dynamic Color) */}
            <div className={`summary-card ${statusClass}`}>
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">₹{totalSpent}</span>
            </div>

            {/* Remaining (Green/Red) */}
            <div className={`summary-card ${remainingClass}`}>
                <span className="stat-label">Remaining</span>
                <span className="stat-value">₹{remaining}</span>
            </div>
        </div>

        {/* --- Progress Bar Section --- */}
        <div className="progress-section">
            <div className="progress-labels">
                <span>Overall Budget Progress</span>
                <span className={statusClass}>{percentUsed}% Used</span>
            </div>
            
            <div className="progress-track">
                <div 
                    className={`progress-fill ${statusClass}`} 
                    style={{ width: `${percentUsed}%` }}
                ></div>
            </div>
        </div>

    </div>
);
};
 
export default Budget;