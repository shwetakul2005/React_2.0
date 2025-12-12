// Products.js
import { useNavigate } from 'react-router-dom';
import useTransactions from '../hooks/useTransactions';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import './Transactions.css'
import { useState } from 'react';
 
const Transactions = () => {
   const navigate = useNavigate();
   const {transactions, totalIncome, totalExpense, balance,count} = useTransactions();
   const [showForm, setShowForm] = useState(false);
   
   return (
      <div className='page_content'>
        <h1 className="transactions-header">Transactions here</h1>  
        <div className="balance-stats">
            <h2>Your current Balance is: ${balance}</h2>
            <h2>Your Total Expense is ${totalExpense}</h2>
        </div>
        <div className="transaction-container">
            {/* 2. The Button toggles the state */}
            <button 
                className="add-btn" 
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel Transaction" : "+ Add New Transaction"}
            </button>

            {/* 3. Conditional Rendering: Only show form if showForm is TRUE */}
            {showForm && (
                <div className="form-wrapper">
                    <TransactionForm />
                </div>
            )}
        </div>
        <TransactionList />
      </div>
   );
};
 
export default Transactions;