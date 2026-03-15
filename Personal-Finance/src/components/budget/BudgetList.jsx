// import useCategories from "../../hooks/useCategories";
// import { useFinance } from "../../context/FinanceContext";
// import React from "react";


// const BudgetList = () => {
//     const {categories, percentUsed} = useCategories();
//      // 2. Determine Color Status based on your rules
//    let statusClass = "status-safe"; // Default Green (< 70%)
//    if (percentUsed > 90) {
//       statusClass = "status-danger"; // Red (> 90%)
//    } else if (percentUsed > 70) {
//       statusClass = "status-warning"; // Orange (70-90%)
//    }

//     return (
//         <>  
//         <div>
//             <ul>
//                 {categories.map((cat) => (
//                 <li key={cat.id}>
//                     {/* 2. Access the individual 'spent' amount here */}
//                     <strong>{cat.name}:</strong> ${cat.spent} 
                    
//                     {/* Optional: Show remaining budget */}
//                     <span> (Remaining: ${cat.remaining})</span>
//                     <span> (Percent Used: {Math.round(cat.percentUsed)}%)</span>

//                     <div className="progress-section">
//                         <div className="progress-labels">
//                             <span>Individual Budget Progress</span>
//                             <span className={statusClass}>{cat.percentUsed}% Used</span>
//                         </div>
                        
//                         <div className="progress-track">
//                             <div 
//                                 className={`progress-fill ${statusClass}`} 
//                                 style={{ width: `${cat.percentUsed}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 </li>
//                 ))}
//             </ul>
//         </div>
//         </>
//     );
// };

// export default BudgetList;

import React, { useState } from "react";
import useCategories from "../../hooks/useCategories";
import './BudgetList.css'
import { useNavigate } from "react-router-dom";
import useTransactions from "../../hooks/useTransactions";
import Transactions from "../../pages/Transactions";

const BudgetList = ({ startDate, endDate, type }) => {
    const { categories } = useCategories({startDate, endDate, type});
    const isFixed = type === "fixed";
    

    // Helper to format currency (Optional, makes it look cleaner)
    const formatMoney = (amount) => `₹${Number(amount).toLocaleString()}`;

    if (!categories || categories.length === 0) {
        return <div className="no-data">No budgets set yet.</div>;
    }

    return (
        <div className="budget-category-list">
            {categories.map((cat) =>{                
                if(cat.budgetLimit <=0 ) {
                    return ;
                }
                if(cat.type !== type) {
                    return ;
                }
                
                // --- LOGIC FIX: Calculate Status PER Category ---
                // Ensure we don't crash if percentUsed is missing
                const pct = Math.round(cat.percentUsed || 0);
                
                let statusClass = "status-safe"; // Default Green
                if (pct > 90) {
                    statusClass = "status-danger"; // Red
                } else if (pct > 70) {
                    statusClass = "status-warning"; // Orange
                }

                

                return (
                    <div key={cat.id} className="budget-card" >
                        
                        {/* Header: Name and Total Spent */}
                        <div className="budget-header">
                            <div className="cat-identity">
                                {/* Optional: color dot if cat.color exists */}
                                {cat.color && (
                                    <span 
                                        className="color-dot" 
                                        style={{ backgroundColor: cat.color }}
                                    ></span>
                                )}
                                <h3>{cat.name}</h3>
                            </div>
                            <div className="cat-amount">
                                <strong>{formatMoney(cat.spent)}</strong> 
                                <span className="text-muted"> / {formatMoney(cat.budgetLimit)}</span>
                            </div>
                        </div>

                        {/* Remaining */}
                        <div className="budget-meta">
                            {/* conditional rendering */}
                            {!isFixed && (
                                <span className={cat.remaining < 0 ? "text-danger" : "text-muted"}>
                                    {cat.remaining < 0 ? "Overspent by: " : "Remaining: "}
                                    {formatMoney(Math.abs(cat.remaining))}
                                </span>
                            )}
                            {isFixed && (cat.remaining===cat.budgetLimit)&&(
                                <span>
                                <div>Not Paid</div>
                                <div>Due Date: {(new Date(cat.dueDate).toDateString())}</div>     
                                </span>
                            )}
                            {isFixed && (cat.remaining===0)&&(
                                <span>Paid</span>     
                            )}
                        </div>

                        {/* Progress Bar (Reusing your existing classes) */}
                        {!isFixed && (
                            <div className="progress-section compact">
                                <div className="progress-labels">
                                    <span>Progress</span>
                                    <span className={statusClass}>{pct}%</span>
                                </div>
                                
                                <div className="progress-track">
                                    <div 
                                        className={`progress-fill ${statusClass}`} 
                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                        )}

                    </div>
                );
            })}
        </div>
    );
};

export default BudgetList;