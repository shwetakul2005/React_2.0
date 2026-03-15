import React, { useState, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import { useToast } from "../ui/Toast";
import './TransactionForm.css'

const TransactionForm = ({ transactionToEdit = null, onClose }) => {
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [category_id, setCategoryID] = useState("")
    const [date, setDate] = useState("")
    const [type, setType] = useState("expense")

    const { addTransaction, updateTransaction, categories } = useFinance();
    const toast = useToast();

    // Pre-fill form when editing an existing transaction
    useEffect(() => {
        if (transactionToEdit) {
            setAmount(transactionToEdit.amount)
            setDescription(transactionToEdit.description)
            setCategoryID(transactionToEdit.category_id)
            setDate(transactionToEdit.date)
            setType(transactionToEdit.type)
        }
    }, [transactionToEdit])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!amount || amount <= 0) { toast.error("Please enter a valid amount"); return }
        if (!description)           { toast.error("Please enter a description"); return }
        if (!category_id)           { toast.error("Please select a category"); return }
        if (!date)                  { toast.error("Please select a date"); return }

        const transactionData = {
            id: transactionToEdit ? transactionToEdit.id : Date.now(),
            amount: Number(amount),
            description,
            category_id: Number(category_id),
            date,
            type
        }

        if (transactionToEdit) {
            updateTransaction(transactionToEdit.id, transactionData)
            toast.success("Transaction updated!");
        } else {
            addTransaction(transactionData)
            toast.success("Transaction added!");
        }

        // Reset form
        setAmount(""); setDescription(""); setCategoryID(""); setDate(""); setType("expense")

        if (onClose) onClose()
    }

    return(
        <form onSubmit={handleSubmit} className="transaction-form">
            <label>Category:
                <select value={category_id} onChange={(e) => setCategoryID(e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </label>

            <label>Description:
                <input
                    type="text"
                    value={description}
                    placeholder="e.g. Coffee at Starbucks"
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <label>Amount:
                <input
                    type="number"
                    value={amount}
                    placeholder="0"
                    onChange={(e) => setAmount(e.target.value)}
                />
            </label>

            <label>Date:
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>

            <label>Type:
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </label>

            <button type="submit">
                {transactionToEdit ? "Update Transaction" : "Add Transaction"}
            </button>
        </form>
    )
}

export default TransactionForm