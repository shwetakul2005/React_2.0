import { useFinance } from "../context/FinanceContext";

export default function useTransactions(filters = {}) {
    const {transactions} = useFinance()
    const { date={}, searchTerm="", category = "", type = "" } = filters

    
    let filtered = transactions
    // const {startDate, endDate} = date[0]
    // console.log("date here:")
    // console.log(date[0]);

    if (date && Array.isArray(date) && date[0]) {
    
        const { startDate, endDate } = date[0];

        // Double check that startDate is not null before filtering
        if (startDate && endDate) {
            filtered = filtered.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= new Date(startDate) && 
                    transactionDate <= new Date(endDate);
            });
        }
    }

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