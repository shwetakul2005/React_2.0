import React, { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import './TransactionForm.css'

const TransactionForm = () => {
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [category_id, setCategoryID] = useState()
    const [date, setDate] = useState()
    const [type, setType] = useState("expense")

    const {addTransaction, categories} = useFinance();

    const handleSubmit = (e) => {
        e.preventDefault()
        // Validation
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount")
            return
        }
        
        if (!description) {
            alert("Please enter a description")
            return
        }
        
        if (!category_id) {
            alert("Please select a category")
            return
        }
        
        if (!date) {
            alert("Please select a date")
            return
        }
        
        if (!type) {
            alert("Please select a type")
            return
        }
        
        // Create transaction object
        const newTransaction = {
            id: Date.now(),  // Generate unique ID
            amount: Number(amount),  // Convert string to number
            description,
            category_id: Number(category_id),
            date,
            type
        }
        
        // Add to context
        addTransaction(newTransaction)
        
        // Clear form
        setAmount("")
        setDescription("")
        setCategoryID("")
        setDate("")
        setType("expense")
        
        alert("Transaction added successfully!")
    }

    function onChangeAmount(e) {
        setAmount(e.target.value);
    }

    function onChangeCategory(e) {
        const cat_id = e.target.value
        // if(cat_id === "fixed"){
        //     setAmount(e.budgetLimit);
            console.log(`type of cat here:${cat_id.type}`);
        // }
        // else if(e.type === "variable") {
            setCategoryID(e.target.value);
        // }
    }
    function onChangeDate(e) {
        setDate(e.target.value);
    }
    function onChangeDescription(e) {
        setDescription(e.target.value);
    }
    function onChangeType(e) {
        setType(e.target.value);
    }

    return(
        <form onSubmit={handleSubmit} className="transaction-form" >
            <label>enter category:    
                Category:
                <select
                    value={category_id}
                    onChange={onChangeCategory}
                >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </label>
            <div></div>
            <label>enter description:
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />  
            </label>
            <div></div>
            
            <label>enter amount:
                <input
                    type="number"
                    value={amount}
                    onChange={onChangeAmount}
                    placeholder={amount}
                /> 
            </label> 
            <div></div>
            <label>enter date:
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>
            <div></div>
            <label>enter date:
                Type:
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </label>
            <div></div>
        
        <button type="submit">Add Transaction</button>
        </form >
    )
}

export default TransactionForm