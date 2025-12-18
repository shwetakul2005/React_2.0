// Products.js
import { useNavigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
import { useFinance } from '../context/FinanceContext';
import './Budget.css'
import BudgetList from '../components/budget/BudgetList';
import { DefinedRange } from 'react-date-range';
import { useState } from 'react';
import useTransactions from '../hooks/useTransactions';
import { startOfMonth } from 'date-fns';
 
const Budget = () => {
   const navigate = useNavigate();
   const {totalSpent, categoriesOverBudget} = useCategories();
   const {categories} = useFinance();
   const [state, setState] = useState([
    {
        startDate: startOfMonth(new Date()),
        endDate: new Date(),
        key: 'selection'
    }
    ]);
   const { 
        transactions: filteredTransactions,  // The filtered array
        totalExpense,                        // Already calculated by hook
        totalIncome,
        balance 
        } = useTransactions({date:state})
   
    const categoriesWithTransactions = [...new Set(
        filteredTransactions.map(t => t.category)
    )]

    // Sum budgets only for those categories
    const totalBudget = categories
    .filter(cat => categoriesWithTransactions.includes(cat.id))
    .reduce((sum, cat) => sum + (cat.budgetLimit || 0), 0)
    


   // 1. Calculate the percentage
   const percentUsed = totalBudget > 0 
      ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) 
      : 0;

   // 2. Determine Color Status based on your rules
   let statusClass = "status-safe"; // Default Green (< 70%)
   if (percentUsed >= 90) {
      statusClass = "status-danger"; // Red (> 90%)
   } else if (percentUsed >= 70) {
      statusClass = "status-warning"; // Orange (70-90%)
   }

   // 3. Determine Remaining Balance Status
   const remaining = totalBudget - totalSpent;
   const remainingClass = remaining < 0 ? "status-danger" : "status-safe";

return (
   <div className="budget-summary-wrapper">
        
            <div>
                <DefinedRange
                    onChange={item => setState([item.selection])}
                    ranges={state}
                />
            </div>
        {/*  The Three Cards  */}
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

        {/*  Progress Bar Section  */}
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
        <div className='main-content'>
            <div className='category-wise-bl'>
                <BudgetList />
            </div>
        </div>
   </div>
);
};
 
export default Budget;