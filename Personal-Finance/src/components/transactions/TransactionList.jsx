import React from "react";
import { useFinance } from "../../context/FinanceContext";
import useTransactions from "../../hooks/useTransactions";
import { TransactionItem } from "./TransactionItem";
import './TransactionList.css'

// const TransactionList = (props) => {
//     const filtered_transactions = props.transactions;
//     const {deleteTransaction, categories } = useFinance();
    
//     const cat_name = (cat_id) => {
//         const sele_cat = categories.find(cat => cat.id == cat_id);
//         return sele_cat?.name
//     }
//     // const transactions_to_display = filtered_transactions ;
//     if (filtered_transactions === null){
//         return <p>No transactions yet. Add your first one!</p>
//     }

//     const formatMoney = (amount) => `₹${Number(amount).toLocaleString()}`;

//     return (
//         <>
//         {filtered_transactions.map((transaction) => (
//             // **Key Point:** Every item in a mapped list must have a unique 'key' prop.
//              <div key={transaction.id} style={{ 
//                  border: '1px solid #ccc', 
//                  margin: '10px 0', 
//                  padding: '10px' 
//              }}>
//                  <h3>{transaction.description}</h3>
//                  <p>
//                      Amount: 
//                      <span style={{ 
//                          color: transaction.type === 'income' ? 'green' : 'red', 
//                          fontWeight: 'bold' 
//                      }}>
//                         {` ${formatMoney(transaction.amount)}`}
//                      </span>
//                  </p>
//                  <p>Category: {cat_name(transaction.category_id)|| "Unknown"}</p>
//                  <p>Date: {transaction.date}</p>
//                  <button 
//                      style={{ backgroundColor: 'crimson', color: 'white' }}
//                      // Assuming you have a deleteTransaction method in your context
//                     //  onClick={handleOnClick(transaction.id)}
//                      onClick={() => {
//                         const isConfirmed = confirm("Are you sure you want to delete this transaction?");
//                         if (isConfirmed) {
//                             // Only call the deletion function if the user clicked 'OK'
//                             deleteTransaction(transaction.id);
//                         }
//                      }}
//                  >
//                     Delete
//                  </button>
//              </div>
            
//         ))}

//         </>
//     )
// };




const TransactionList = (props) => {
    const filtered_transactions = props.transactions;
    const { deleteTransaction, categories } = useFinance();
    
    const cat_name = (cat_id) => {
        const sele_cat = categories.find(cat => cat.id == cat_id);
        return sele_cat?.name
    }

    if (!filtered_transactions || filtered_transactions.length === 0){
        return <p className="no-data">No transactions yet. Add your first one!</p>
    }

    const formatMoney = (amount) => `₹${Number(amount).toLocaleString()}`;

    return (
        <div className="transactions-list-vertical">
            {filtered_transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-row">
                    
                    {/* Left Section: Icon & Info */}
                    <div className="t-info-group">
                        <div className={`t-type-indicator ${transaction.type}`}>
                            {transaction.type === 'income' ? '↑' : '↓'}
                        </div>
                        <div>
                            <h3>{transaction.description}</h3>
                            <p className="t-subtext">
                                {cat_name(transaction.category_id) || "Unknown"} • {transaction.date}
                            </p>
                        </div>
                    </div>

                    {/* Right Section: Amount & Actions */}
                    <div className="t-action-group">
                        <span className={`t-amount ${transaction.type}`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatMoney(transaction.amount)}
                        </span>
                        <button 
                            className="btn-delete"
                            title="Delete Transaction"
                            onClick={() => {
                                if (confirm("Delete this transaction?")) {
                                    deleteTransaction(transaction.id);
                                }
                            }}
                        >
                            Delete
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
};
export default TransactionList