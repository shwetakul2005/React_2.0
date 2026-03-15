// Products.js (Dashboard)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import useTransactions from '../hooks/useTransactions';
// IMPORT ResponsiveContainer HERE
import { Pie, BarChart, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css'; // Don't forget to import the CSS

const Dashboard = () => {
   const navigate = useNavigate();
   const { transactions, categories } = useFinance();
   // const { totalExpense } = useTransactions(); // Unused in snippet, but okay

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
      return { date: t.date, balance: runningBalance };
   });

   // Group ONLY expenses by category_id, then resolve name via lookup
   const categoryTotals = {};
   transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
         const catId = t.category_id;
         if (!categoryTotals[catId]) categoryTotals[catId] = 0;
         categoryTotals[catId] += t.amount;
      });

   const pieData = Object.keys(categoryTotals).map(catId => {
      const cat = categories.find(c => c.id === Number(catId));
      return {
         name: cat?.name || 'Unknown',
         value: categoryTotals[catId],
         color: cat?.color || '#8884d8'
      };
   });

   const fmt = (n) => `₹${Number(n).toLocaleString()}`;
   const balance = income - expense;

   return (
      <div className="dashboard-container">
         <h2>Financial Overview</h2>

         {/* ── Summary Cards ── */}
         <div className="dashboard-stats">
            <div className="stat-card">
               <h3>Total Income</h3>
               <p className="stat-value safe">{fmt(income)}</p>
            </div>
            <div className="stat-card">
               <h3>Total Expenses</h3>
               <p className="stat-value danger">{fmt(expense)}</p>
            </div>
            <div className="stat-card">
               <h3>Net Balance</h3>
               <p className={`stat-value ${balance >= 0 ? 'safe' : 'danger'}`}>{fmt(balance)}</p>
            </div>
            <div className="stat-card">
               <h3>Transactions</h3>
               <p className="stat-value">{transactions.length}</p>
               <span className="stat-detail">{categories.length} categories</span>
            </div>
         </div>

         <div className='dashboard-grid'>

            {/* Balance Chart Card */}
            <div className="chart-card">
               <h3>Balance History</h3>
               <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={balanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--sidebar-border)" />
                        <XAxis dataKey="date" stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <Tooltip
                           contentStyle={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--sidebar-border)', color: 'var(--text-color)' }}
                        />
                        <Line type="monotone" dataKey="balance" stroke="var(--nav-title-color)" strokeWidth={2} dot={false} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Income vs Expense Card */}
            <div className="chart-card">
               <h3>Income vs Expense</h3>
               <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--sidebar-border)" />
                        <XAxis dataKey="name" stroke="var(--sidebar-text)" />
                        <YAxis stroke="var(--sidebar-text)" />
                        <Tooltip
                           cursor={{ fill: 'var(--sidebar-hover-bg)' }}
                           contentStyle={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--sidebar-border)', color: 'var(--text-color)' }}
                        />
                        <Bar dataKey="value" fill="#82ca9d" barSize={50}>
                           {
                              barData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#16a34a' : '#dc2626'} />
                              ))
                           }
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Pie Chart Card */}
            <div className="chart-card">
               <h3>Category Distribution</h3>
               <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={pieData}
                           dataKey="value"
                           nameKey="name"
                           cx="50%"
                           cy="50%"
                           outerRadius={80}
                           label
                        >
                           {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip
                           cursor={{ fill: 'var(--sidebar-hover-bg)' }}
                           contentStyle={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--sidebar-border)', color: 'var(--text-color)' }} />
                        {/* <Legend wrapperStyle={{ color: 'var(--text-color)' }}/> */}
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

         </div>
      </div>
   );
};

export default Dashboard;