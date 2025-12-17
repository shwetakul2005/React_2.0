import { useFinance } from "../context/FinanceContext";

export default function useCategories () {
    const {transactions, categories} = useFinance();
    // let bl=0;
    const categoriesWithSpending = categories.map(category => {

        const categoryTransactions = transactions.filter(
            t => t.category_id === category.id && t.type === 'expense' && category.budgetLimit > 0
        )
    
        const spent = categoryTransactions.reduce(
            (sum, t) => sum + t.amount, 
            0
        )
    
        const remaining = category.budgetLimit - spent
        
        return {
            ...category,
            spent,
            remaining,
            percentUsed: ((spent / category.budgetLimit) * 100)
        }
    })

    const totalSpent = categoriesWithSpending.reduce(
    (sum, cat) => sum + cat.spent,0)
  
    const categoriesOverBudget = categoriesWithSpending.filter(
        cat => cat.spent > cat.budgetLimit
    )
  
  return {
    categories: categoriesWithSpending,
    totalSpent,
    categoriesOverBudget,
    categoryCount: categories.length
  }
}