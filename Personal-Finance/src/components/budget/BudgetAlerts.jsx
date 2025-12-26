// import React from "react";
// import useCategories from "../../hooks/useCategories";
// import './BudgetList.css';
// import { addDays, startOfMonth } from 'date-fns';
// import { endOfMonth } from "date-fns";

// const BudgetAlerts = ({ startDate, endDate, type }) => {
//     const { categories } = useCategories({ startDate, endDate, type });
//     const isFixed = type === "fixed";
//     const isVar = type === "variable";
//     const currentDate = new Date();

//     // 1. Filter the list first to avoid empty cards/divs
//     const fixedAlertCategories = categories.filter(cat => {
//         const hasBudget = cat.budgetLimit > 0;
//         const matchesType = cat.type === type;
//         const isUnpaid = cat.remaining === cat.budgetLimit;
        
//         // Only keep fixed categories that haven't been paid yet
//         return hasBudget && matchesType && isFixed && isUnpaid;
//     });
    

//     const varAlertCategories = categories.filter(cat => {
//         const hasBudget = cat.budgetLimit > 0;
//         const matchesType = cat.type === type;
        
//         return hasBudget && matchesType && isVar;
//     });

//     return (
//         <div className="budget-list-grid">
            
//                 {fixedAlertCategories.map((cat) => {
//                     // Ensure cat.dueDate is a Date object for comparison
//                     const dueDate = new Date(cat.dueDate);
//                     const isOverdue = dueDate < currentDate;

//                     return (
//                         <div key={cat.id} className="budget-card">
//                             <div>
//                                 {isOverdue ? (
//                                     <div>{`You need to pay for ${cat.name} ASAP. The due date was ${dueDate.toLocaleDateString()}`}</div>
//                                 ) : (
//                                     <div>{`Approaching payment of ${cat.name}. The due date is ${dueDate.toLocaleDateString()}`}</div>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })}
            
//                 {varAlertCategories.map((cat) => {
//                     const pct = Math.round(cat.percentUsed || 0);
//                     const remDays = parseInt((endOfMonth(currentDate) - currentDate) / (24 * 3600 * 1000));
//                     console.log(remDays);
//                     return (
//                         <div >
//                             <div>
//                                 {pct>100 && remDays>0 &&(
//                                     <div key={cat.id} className="budget-card">{`Limit reached for ${cat.name}. Every dollar spent from now on is over-budget.`}</div>
//                                 )}
//                                 {pct>=90 && remDays>=7 && (    
//                                     <div key={cat.id} className="budget-card">{`Hang in there! You have ${100-pct}% of your budget left for ${cat.name} to last you until the 1st of next month.`}</div>
//                                 )}
//                                 {pct>85 && remDays>=10 && (    
//                                     <div key={cat.id} className="budget-card">{`Emergency: You only have ${100-pct}% of your budget left for the next 10 days for ${cat.name}. You must cut non-essential spending.`}</div>
//                                 )}
//                                 {pct>70 && remDays>10 && remDays<=15 && (    
//                                     <div key={cat.id} className="budget-card">{`You've used ${pct}% of your budget for ${cat.name}. You are on track, but keep an eye on your remaining ${remDays} days.`}</div>
//                                 )}
//                                 {pct>50 && remDays>=21 && (    
//                                     <div key={cat.id} className="budget-card">{`Slow down! You've used ${pct}% your budget for ${cat.name} in the first week itself.`}</div>
//                                 )}
                                
//                             </div>
                        
//                         </div>
//                     )
//                 })}
            
            

            
//         </div>
//     );
// };

// export default BudgetAlerts;

import React from "react";
import useCategories from "../../hooks/useCategories";
import './BudgetAlerts.css'; // Renamed to match the component
import { endOfMonth } from "date-fns";

const BudgetAlerts = ({ startDate, endDate, type }) => {
    const { categories } = useCategories({ startDate, endDate, type });
    const isFixed = type === "fixed";
    const isVar = type === "variable";
    const currentDate = new Date();

    const fixedAlertCategories = categories.filter(cat => {
        const hasBudget = cat.budgetLimit > 0;
        const matchesType = cat.type === type;
        const isUnpaid = cat.remaining === cat.budgetLimit;
        return hasBudget && matchesType && isFixed && isUnpaid;
    });

    const varAlertCategories = categories.filter(cat => {
        const hasBudget = cat.budgetLimit > 0;
        const matchesType = cat.type === type;
        return hasBudget && matchesType && isVar;
    });

    return (
        <div className="alerts-container">
            {/* Fixed Budget Alerts */}
            {fixedAlertCategories.map((cat) => {
                const dueDate = new Date(cat.dueDate);
                const isOverdue = dueDate < currentDate;

                return (
                    <div key={cat.id} className="alert-group">
                        
                            {isOverdue && (
                                <div className="budget-alert-card alert-critical">
                                    <span className="alert-icon">❌</span>
                                    <div>{`ASAP: Pay for ${cat.name}. Due date was: ${dueDate.toDateString()}`}</div>
                                </div>
                            )}  
                            {!isOverdue && (
                                <div className="budget-alert-card alert-emergency">
                                    <span className="alert-icon">🚨</span>
                                    <div>{`Reminder: Approaching payment for ${cat.name}. Due: ${dueDate.toDateString()}`}</div>
                                </div>
                            )}
                        
                    </div>
                );
            })}

            {/* Variable Budget Alerts */}
            {varAlertCategories.map((cat) => {
                const pct = Math.round(cat.percentUsed || 0);
                const remDays = parseInt((endOfMonth(currentDate) - currentDate) / (24 * 3600 * 1000));

                return (
                    <div key={cat.id} className="alert-group">
                        {/* CRITICAL: Over-budget */}
                        {pct > 100 && remDays > 0 && (
                            <div className="budget-alert-card alert-critical">
                                <span className="alert-icon">❌</span>
                                <div>{`Limit reached for ${cat.name}. Every dollar spent from now on is over-budget.`}</div>
                            </div>
                        )}

                        {/* HIGH URGENCY: Emergency */}
                        {pct > 85 && remDays >= 10 && (
                            <div className="budget-alert-card alert-emergency">
                                <span className="alert-icon">🚨</span>
                                <div>{`Emergency: You only have ${100 - pct}% left for the next 10 days for ${cat.name}.`}</div>
                            </div>
                        )}

                        {/* MEDIUM URGENCY: High percentage used */}
                        {pct >= 90 && remDays >= 7 && (
                            <div className="budget-alert-card alert-warning">
                                <span className="alert-icon">⚠️</span>
                                <div>{`Hang in there! Only ${100 - pct}% left for ${cat.name} for this month.`}</div>
                            </div>
                        )}

                        {/* INFO: On track */}
                        {pct > 70 && remDays > 10 && remDays <= 15 && (
                            <div className="budget-alert-card alert-info">
                                <span className="alert-icon">ℹ️</span>
                                <div>{`You've used ${pct}% for ${cat.name}. On track, but watch your remaining ${remDays} days.`}</div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BudgetAlerts;