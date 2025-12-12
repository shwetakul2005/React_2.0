import { useFinance } from "../context/FinanceContext";

export default function useTransactions(filters = {}) {
    const {transactions} = useFinance()
    const { searchTerm="", category = "", type = "" } = filters

    // const {startDate, endDate} = date

    let filtered = transactions
    // if(date) {
    //     filtered = filtered.filter(t => ((t.date >= endDate) && (t.date >= startDate) ))
    // }
    // console.log("search from usetransac:",searchTerm)
    if(searchTerm !== ""){
        filtered = filtered.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if(category !== ""){
        filtered = filtered.filter(t => t.category === category)
        // console.log("category from usetransac:",category)
    }
    if(type != "") {
        filtered = filtered.filter(t => t.type === type)
    }

    const totalIncome = filtered.filter(t => t.type === 'income')
                                .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = filtered.filter(t => t.type === 'expense')
                                .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    return ({
        transactions: filtered,
        totalIncome, 
        totalExpense, 
        balance,
        count: filtered.length
    })
}