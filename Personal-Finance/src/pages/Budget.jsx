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
        transactions: filteredTransactions,
        totalExpense,
        totalIncome,
        balance 
        } = useTransactions({date:state})

    const totalBudget = categories.reduce((sum, cat) => {
        return sum + (cat.budgetLimit || 0)
    }, 0)

   const percentUsed = totalBudget > 0 
      ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) 
      : 0;

   let statusClass = "safe"; 
   if (percentUsed >= 90) statusClass = "danger"; 
   else if (percentUsed >= 70) statusClass = "warn"; 

   const remaining = totalBudget - totalExpense;
   const remainingClass = remaining < 0 ? "danger" : "safe";

   const fmt = (n) => `₹${Number(n).toLocaleString()}`;

return (
   <div className="page_content">
        <div className="budget-header">
            <h1>Budget Overview</h1>
            <div className="budget-actions">
                <button className="add-btn" onClick={() => setShowCalender(!showCalender)}>
                    {showCalender ? "Hide Calendar" : "Select Date Range"}
                </button>
                {showCalender && (
                    <div className="budget-calendar-dropdown">
                        <DefinedRange
                            onChange={item => setState([item.selection])}
                            ranges={state}
                            showSelectionPreview={true}
                        />
                    </div>
                )}
            </div>
        </div>

        {/* ── Summary Stats (Match Dashboard style) ── */}
        <div className="dashboard-stats">
            <div className="stat-card">
                <h3>Total Budget</h3>
                <p className="stat-value">{fmt(totalBudget)}</p>
                <span className="stat-detail">Across {categories.filter(c => c.budgetLimit > 0).length} categories</span>
            </div>

            <div className={`stat-card alert-${statusClass}`}>
                <h3>Total Spent</h3>
                <p className={`stat-value ${statusClass}`}>{fmt(totalExpense)}</p>
                <span className="stat-detail">{format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}</span>
            </div>

            <div className={`stat-card alert-${remainingClass}`}>
                <h3>Remaining Budget</h3>
                <p className={`stat-value ${remainingClass}`}>{fmt(remaining)}</p>
                <span className="stat-detail">{remaining < 0 ? 'Over budget' : 'Under budget'}</span>
            </div>

            <div className={`stat-card alert-${statusClass}`}>
                <h3>Overall Progress</h3>
                <p className={`stat-value ${statusClass}`}>{percentUsed}%</p>
                <div className="budget-progress-mini">
                    <div className={`budget-progress-fill bg-${statusClass}`} style={{ width: `${percentUsed}%` }}></div>
                </div>
            </div>
        </div>

        {/*  Alerts Section  */}
        <div className="chart-card mb-4" style={{ padding: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Active Alerts</h2>
            <div className="budget-alerts-wrapper">
                <BudgetAlerts startDate={startDate} endDate={endDate} type="fixed" />
                <BudgetAlerts startDate={startDate} endDate={endDate} type="variable" />
            </div>
        </div>

        {/* Category Wise Status */}
        <h2 className="section-title">Category Status ({format(startDate, 'MMM d')} - {format(endDate, 'MMM d')})</h2>
        <div className="dashboard-grid">
            <div className="chart-card">
                <h3>Fixed Categories</h3>
                <BudgetList startDate={startDate} endDate={endDate} type="fixed" />
            </div>
            
            <div className="chart-card">
                <h3>Variable Categories</h3>
                <BudgetList startDate={startDate} endDate={endDate} type="variable" />
            </div>
        </div>
   </div>
);
};
 
export default Budget;