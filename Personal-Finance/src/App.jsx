import { useState } from 'react'
import './App.css'

import Layout from './components/layout/Layout'
import Budget from './pages/Budget'
import { FinanceContextProvider } from './context/FinanceContext'
import Transactions from './pages/Transactions'
import { BrowserRouter } from 'react-router-dom'
import { Route ,Routes } from 'react-router-dom'
import Categories from './pages/Categories'
import Insights from './pages/Insights'
import Reports from './pages/Reports'
import Dashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <FinanceContextProvider>

        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
  
    
    </FinanceContextProvider>
    
  )
}

export default App
