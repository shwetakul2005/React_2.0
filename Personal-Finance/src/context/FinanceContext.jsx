import { createContext, useState, useEffect, useContext } from "react";
import CategoryForm from "../components/categories/CategoryForm";

// creating the context to use all the values/methods passed thru the provider to its children
const FinanceContext = createContext()

// passing various methods and data
function FinanceContextProvider({children}){
    const [transactions, setTransactions] = useState([
        // {id: 1, amount:6000, category_id:1, date:"2025-11-13", description: "twitter checkout", type: "income"},
        // {id: 2, amount:300, category:1, date:"2025-11-15", description: "burger", type: "expense", isFixedExpense:true}
    ])
    const [categories, setCategories] = useState([
        { id: 1, name: 'Food', color: '#ff6b6b', budgetLimit: 500, type: "variable", isRecurring: true},
        { id: 2, name: 'Transport', color: '#4ecdc4', budgetLimit: 1500, type: "variable", isRecurring: true },
        { id: 3, name: 'Entertainment', color: '#45b7d1', budgetLimit: 2500, type: "variable", isRecurring: false }
    ])

    const addTransaction = (transaction) => {
        //adds the new transaction to the og list of transactions
        //(...) this is called as Spread Operator 
        setTransactions([...transactions, transaction])
    }

    const addBulkTransaction = (newTransactionArray) => {
        setTransactions(transactions => [
            ...transactions,
            ...newTransactionArray
        ]);
    };

    const deleteTransaction = (id) => {
        // Set the transactions to be the current list, filtered so that we keep everything 
        // where the ID is not the one we want to remove.
        setTransactions(transactions.filter(t => t.id !== id))
    }

    const addCategory = (category) => {
        setCategories([...categories, category])
    }

    const deleteCategory = (id) => {
        setCategories(categories.filter(t => t.id !== id))
    }

    const updateCategory = (id, new_data) => {
        const up_cat = categories.map(t => {
            if (t.id === id) {
                return new_data;
            }
            return t;
        })
        setCategories(up_cat);
        
    }
    
    // const editCategory = (id) => {
    //     setCategories((prevCategories) => 
    //     prevCategories.map((cat) => 
    //         // If the ID matches, merge the new data; otherwise, keep the old one
    //         cat.id === id ? { ...cat, ...newData } : cat
    //     )
    // );
    // }


    // useEffect(() => {
    // const savedTransactions = JSON.parse(localStorage.getItem("transactions"))
    // if (savedTransactions && savedTransactions.length > 0){
    //     setTransactions(savedTransactions);
    // }
    // }, [])

    // useEffect(() => {
    // const savedCategories  = JSON.parse(localStorage.getItem("categories"))
    // if (savedCategories  && savedCategories .length > 0){
    //     setCategories(savedCategories );
    // }
    // }, [])

    // CORRECTED useEffect for Transactions
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        // 1. Get the raw string value
        const transactionsString = localStorage.getItem("transactions");
        
        // 2. CHECK if the value exists (is not null, undefined, or empty string)
        if (transactionsString) {
            try {
                // 3. ONLY parse if a value exists
                const savedTransactions = JSON.parse(transactionsString);
                
                // 4. Then, apply your existing check for length
                if (savedTransactions && savedTransactions.length > 0) {
                    setTransactions(savedTransactions);
                }
            } catch (e) {
                console.error("Could not parse transactions from localStorage:", e);
                // Optionally, clear the bad data if it exists
                localStorage.removeItem("transactions");
            }
        }
        setIsLoaded(true);
    }, [])

    // CORRECTED useEffect for Categories
    useEffect(() => {
        const categoriesString = localStorage.getItem("categories");
        
        if (categoriesString) {
            try {
                const savedCategories = JSON.parse(categoriesString);
                if (savedCategories && savedCategories.length > 0){
                    setCategories(savedCategories);
                }
            } catch (e) {
                console.error("Could not parse categories from localStorage:", e);
                localStorage.removeItem("categories");
            }
        }
        setIsLoaded(true);
    }, [])

    useEffect(() => {
        if (isLoaded) { // Only save after initial load
        console.log("--- SAVING TO LOCAL STORAGE ---");
        localStorage.setItem("transactions", JSON.stringify(transactions))
    }
    }, [transactions, isLoaded])

    useEffect(() => {
        if (isLoaded) { // Only save after initial load
        console.log("--- SAVING TO LOCAL STORAGE ---");
        localStorage.setItem("categories", JSON.stringify(categories))
    }
    }, [categories, isLoaded])

    const value = {
    transactions,
    setTransactions,
    categories,
    setCategories,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    updateCategory,
    addBulkTransaction
  }
  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}




// creating a custom hook to use the data directly passed through the provider function
// without using useContext always
function useFinance() {
    const context = useContext(FinanceContext)
  
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  
  return context
}

export {FinanceContextProvider, useFinance}