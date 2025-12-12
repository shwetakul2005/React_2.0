// Products.js
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useFinance } from '../context/FinanceContext';
import useTransactions from '../hooks/useTransactions';
import { BarChart,Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Bar  } from 'recharts';
 
const Dashboard = () => {
   const navigate = useNavigate();
   const {transactions} = useFinance();
   const{totalExpense} = useTransactions();

   const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);

   const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

   const barData = [
      { name: "Income", value: income },
      { name: "Expense", value: expense }
   ];
   
   const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

   let runningBalance = 0;
   const balanceData = sorted.map(t => {
      runningBalance += t.type === "income" ? t.amount : -t.amount;

      return {
         date: t.date,
         balance: runningBalance
      };
   });

   return (
      <div>

      <div>
        
         <h3>Balance Chart</h3>
         <LineChart width={500} height={300} data={balanceData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Line
               type="monotone"
               dataKey="balance"
               stroke="#82ca9d"
               strokeWidth={2}
               />
            <Tooltip />
         </LineChart>
      </div>
      <div>
         <h3>Income vs Expense</h3>
         <BarChart width={500} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
         </BarChart>   
      </div>
   </div>
   );
};
 
export default Dashboard;