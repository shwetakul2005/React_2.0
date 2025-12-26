// Products.js
import { useNavigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
import { useFinance } from '../context/FinanceContext';
import './Budget.css'
import BudgetList from '../components/budget/BudgetList';
import { DefinedRange } from 'react-date-range';
import { useState } from 'react';
import useTransactions from '../hooks/useTransactions';
import { startOfMonth, format } from 'date-fns';
import BudgetAlerts from '../components/budget/BudgetAlerts';

 
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
    const { startDate, endDate } = state[0];
    const [showCalender, setShowCalender] = useState(false);
   const { 
        transactions: filteredTransactions,  // The filtered array
        totalExpense,                        // Already calculated by hook
        totalIncome,
        balance 
        } = useTransactions({date:state})
   

    // Sum budgets for ALL categories, regardless of transactions
    const totalBudget = categories.reduce((sum, cat) => {
        return sum + (cat.budgetLimit || 0)
    }, 0)

   // 1. Calculate the percentage
   console.log("e", totalExpense)
   console.log("s", totalSpent)
   const percentUsed = totalBudget >= 0 
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
   const remaining = totalBudget - totalExpense;
   const remainingClass = remaining < 0 ? "status-danger" : "status-safe";

return (
   <div className="budget-summary-wrapper">

        <div className='header-summary-sec'>
            
            {/* Total Budget (Neutral) */}
            <div className='summary-card neutral'>
                <span className="stat-label">Total Budget</span>
                <span className="stat-value">₹{totalBudget}</span>
            </div>

            {/* Total Spent (Dynamic Color) */}
            <div className={`summary-card ${statusClass}`}>
                <span className="stat-label">{`Total Spent from ${format(startDate, 'MMM d')} to ${format(endDate, 'MMM d, yyyy')}`}</span>
                {/* {console.log(`total spent in box: ${totalSpent}`)} */}
                <span className="stat-value">₹{totalExpense}</span>
            </div>

            {/* Remaining (Green/Red) */}
            <div className={`summary-card ${remainingClass}`}>
                <span className="stat-label">Current Remaining Budget</span>
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

        <button 
            className="add-btn" 
            onClick={() => setShowCalender(!showCalender)}>
            {showCalender ? "Hide" : "+ Select Date Range"}
        </button>
        <div className="date-card">
            {showCalender && (
                <div className="form-wrapper">
                    <DefinedRange
                        onChange={item => {
                            const dateName = item;
                            setState([item.selection])
                        }}
                        ranges={state}
                        showSelectionPreview={true}
                    />
                        
                </div>
            )}
                
        </div>
        <div>
            <h1>Alerts</h1>
                <BudgetAlerts 
                startDate={startDate}  
                endDate={endDate}
                type={"fixed"}/>

                 <BudgetAlerts 
                startDate={startDate}  
                endDate={endDate}
                type={"variable"}/>
        </div>
        <div className='main-content'>
            <h1>{`Category wise budget status from ${format(startDate, 'MMM d')} to ${format(endDate, 'MMM d, yyyy')}`}</h1>
            
            <div className='category-wise-bl'>
                <div>
                    <h2>Fixed Category List:</h2>
                    <BudgetList 
                    startDate={startDate}  
                    endDate={endDate} 
                    type={"fixed"}      
                    />
                </div>
                <div>
                    <h2>Variable Category List</h2>
                    <BudgetList 
                    startDate={startDate}  
                    endDate={endDate} 
                    type={"variable"}      
                    />
                </div>
            </div>

        </div>
   </div>
);
};
 
export default Budget;