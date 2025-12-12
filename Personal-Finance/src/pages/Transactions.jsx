// Products.js
import { useNavigate } from 'react-router-dom';
import useTransactions from '../hooks/useTransactions';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import './Transactions.css'
import { useState } from 'react';
import { useFinance } from '../context/FinanceContext'; 

 
const Transactions = () => {
   const navigate = useNavigate();
   const {totalExpense, balance} = useTransactions();
   const [showForm, setShowForm] = useState(false);
   const {categories} = useFinance();
   
   // searching/filtering functionality
   const [searchTerm, setSearchTerm] = useState("")
   const [selectedCategory, setSelectedCategory] = useState("")
   const [selectedType, setSelectedType] = useState("")
   const filterResult = useTransactions({ 
        searchTerm, 
        category: selectedCategory, 
        type: selectedType 
    })
   return (
       <div className='page_content'>
        <h1 className="transactions-header">Transactions here</h1>  
        <div className="balance-stats">
            <h2>Your current Balance is: ${balance}</h2>
            <h2>Your Total Expense is ${totalExpense}</h2>
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
      </div>
   );
};
 
export default Transactions;