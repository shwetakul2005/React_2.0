import React from "react";
import { useFinance } from "../../context/FinanceContext";
import useTransactions from "../../hooks/useTransactions";
import { TransactionItem } from "./TransactionItem";


const TransactionList = () => {
    const { transactions, deleteTransaction } = useFinance();
    if (transactions.length === 0){
        return <p>No transactions yet. Add your first one!</p>
    }

    return (
        <>
        {transactions.map((transaction) => (
            // **Key Point:** Every item in a mapped list must have a unique 'key' prop.
             <div key={transaction.id} style={{ 
                 border: '1px solid #ccc', 
                 margin: '10px 0', 
                 padding: '10px' 
             }}>
                 <h3>{transaction.description}</h3>
                 <p>
                     Amount: 
                     <span style={{ 
                         color: transaction.type === 'income' ? 'green' : 'red', 
                         fontWeight: 'bold' 
                     }}>
                         ${transaction.amount}
                     </span>
                 </p>
                 <p>Category: {transaction.category}</p>
                 <p>Date: {transaction.date}</p>
                 <button 
                     style={{ backgroundColor: 'crimson', color: 'white' }}
                     // Assuming you have a deleteTransaction method in your context
                    //  onClick={handleOnClick(transaction.id)}
                     onClick={() => {
                        const isConfirmed = confirm("Are you sure you want to delete this transaction?");
                        if (isConfirmed) {
                            // Only call the deletion function if the user clicked 'OK'
                            deleteTransaction(transaction.id);
                        }
                     }}
                 >
                     Delete
                 </button>
             </div>
            
         ))}

        </>
    )
};

export default TransactionList
