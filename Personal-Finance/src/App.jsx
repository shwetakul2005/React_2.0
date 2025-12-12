import { useState } from 'react'
import './App.css'

import Layout from './components/layout/Layout'
import Budget from './pages/Budget'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout>
        <h1>Hello! I am the page content</h1>
        <p>This should appear in the content area</p>
      </Layout>  
    </>
    
  )
}

export default App
