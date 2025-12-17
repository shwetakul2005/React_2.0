// Products.js
import { useNavigate } from 'react-router-dom';
import useTransactions from '../hooks/useTransactions';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import './Transactions.css'
import { useState } from 'react';
import { useFinance } from '../context/FinanceContext'; 
// import { date } from '@mui/x-date-pickers-pro';

 
const Transactions = (props) => {
   const navigate = useNavigate();
   const {totalExpense, balance} = useTransactions();
   const [showForm, setShowForm] = useState(false);
   const {categories} = useFinance();
   const [searchTerm, setSearchTerm] = useState("")
   const [selectedCategory, setSelectedCategory] = useState("")
   const [selectedType, setSelectedType] = useState("")
   
   const effectiveSearch = props.searchTerm || searchTerm;
   const effectiveCategory = props.category || selectedCategory;
   const effectiveType = props.type || selectedType;

   const filterResult = useTransactions({ 
        searchTerm: effectiveSearch, 
        category: effectiveCategory, 
        type: effectiveType 
    });

    const formatMoney = (amount) => `₹${Number(amount).toLocaleString()}`;

   return (
    <>
        {/* <DateRangePicker /> */}
        <h1 className="transactions-header">Transactions here</h1>  
        <div className="balance-stats">
            <h2>Your current Balance is: {formatMoney(balance)}</h2>
            <h2>Your Total Expense is: {formatMoney(totalExpense)}</h2>
        </div>
        <div className='controls-wrapper'>
            <div className='search-box'>

            <input
                type="text"
                placeholder='Search transactions'
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value)}}
                /> 
                {/* {console.log(searchTerm)} */}
            </div>

            <div className='filter-box'>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                    <option  value="">All categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {/* {console.log(selectedCategory)} */}
                
            </div>
            <div className='type-btns'>
                <button className={`btn-filter all ${selectedType === "" ? "active" : ""}`}
                    onClick={() => {setSelectedType("")}}
                    >All</button>
                <button className={`btn-filter income ${selectedType === "income" ? "active" : ""}`}
                    onClick={() => {setSelectedType("income")}}
                    >Income</button>
                <button className={`btn-filter expense ${selectedType === "expense" ? "active" : ""}`}
                    onClick={() => {setSelectedType("expense")}}
                    >Expense</button>

                    {/* {console.log(selectedType)} */}
            </div>
                
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
        {/* {console.log(filterResult)} */}
        <TransactionList  transactions={filterResult.transactions}/>
    
            </>
   );
};
 
export default Transactions;