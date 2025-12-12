import { useState } from 'react'
import './App.css'

import Layout from './components/layout/Layout'
import Budget from './pages/Budget'
import { FinanceContextProvider } from './context/FinanceContext'
import Transactions from './pages/Transactions'

function App() {
  const [count, setCount] = useState(0)

  return (
    <FinanceContextProvider>

      <Layout>
        {/* <h1>Hello! I am the page content</h1>
        <p>This should appear in the content area</p> */}
      </Layout>  
    
    </FinanceContextProvider>
    
  )
}

export default App
