import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
   BarChart, Bar, LineChart, Line, AreaChart, Area,
   CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import './Reports.css';

const Reports = () => {
   const { transactions, categories } = useFinance();
   const [timeRange, setTimeRange] = useState('6'); // months to show

   const fmt = (n) => `₹${Number(n).toLocaleString()}`;

   // ── Monthly aggregation ──
   const monthlyData = useMemo(() => {
      if (!transactions.length) return [];

      const months = {};
      transactions.forEach(t => {
         const d = new Date(t.date);
         const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
         if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
         if (t.type === 'income') months[key].income += Number(t.amount);
         else months[key].expense += Number(t.amount);
      });

      const sorted = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
      const sliced = sorted.slice(-Number(timeRange));

      // Add net savings
      return sliced.map(m => ({
         ...m,
         label: new Date(m.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
         net: m.income - m.expense
      }));
   }, [transactions, timeRange]);

   // ── Category spending per month (top 5) ──
   const categoryMonthly = useMemo(() => {
      if (!transactions.length) return [];

      const topCats = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
         topCats[t.category_id] = (topCats[t.category_id] || 0) + Number(t.amount);
      });
      const top5Ids = Object.entries(topCats)
         .sort((a, b) => b[1] - a[1])
         .slice(0, 5)
         .map(([id]) => Number(id));

      const months = {};
      transactions.filter(t => t.type === 'expense' && top5Ids.includes(t.category_id)).forEach(t => {
         const d = new Date(t.date);
         const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
         if (!months[key]) months[key] = { month: key };
         const cat = categories.find(c => c.id === t.category_id);
         const name = cat?.name || 'Unknown';
         months[key][name] = (months[key][name] || 0) + Number(t.amount);
      });

      const sorted = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
      return sorted.slice(-Number(timeRange)).map(m => ({
         ...m,
         label: new Date(m.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      }));
   }, [transactions, categories, timeRange]);

   const top5Names = useMemo(() => {
      const topCats = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
         const cat = categories.find(c => c.id === t.category_id);
         const name = cat?.name || 'Unknown';
         topCats[name] = (topCats[name] || 0) + Number(t.amount);
      });
      return Object.entries(topCats).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n]) => n);
   }, [transactions, categories]);

   // ── All-time summary stats ──
   const stats = useMemo(() => {
      const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      const avgMonthlyExp = monthlyData.length > 0
         ? monthlyData.reduce((s, m) => s + m.expense, 0) / monthlyData.length
         : 0;
      const highestMonth = monthlyData.reduce((max, m) => m.expense > (max?.expense || 0) ? m : max, null);
      return { income, expense, avgMonthlyExp, highestMonth };
   }, [transactions, monthlyData]);

   const PALETTE = ['#2196f3', '#16a34a', '#eab308', '#ef4444', '#8b5cf6'];

   const tooltipStyle = {
      backgroundColor: 'var(--background-color)',
      borderColor: 'var(--sidebar-border)',
      color: 'var(--text-color)',
      borderRadius: '8px',
      fontSize: '0.85rem'
   };

   if (!transactions.length) {
      return (
         <div className="page_content">
            <h1>Reports</h1>
            <div className="reports-empty">
               <p>Add some transactions to generate your financial reports.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="page_content">
         <div className="reports-header">
            <h1>Reports</h1>
            <div className="reports-header-actions">
               <div className="range-selector">
                  {['3', '6', '12'].map(n => (
                     <button
                        key={n}
                        className={`btn-filter ${timeRange === n ? 'active all' : ''}`}
                        onClick={() => setTimeRange(n)}
                     >
                        {n}M
                     </button>
                  ))}
               </div>
               <button className="add-btn no-print" onClick={() => window.print()}>
                  Download PDF
               </button>
            </div>
         </div>

         {/* ── Summary Stats ── */}
         <div className="reports-stats">
            <div className="stat-card">
               <h3>Total Income</h3>
               <p className="stat-value safe">{fmt(stats.income)}</p>
            </div>
            <div className="stat-card">
               <h3>Total Expenses</h3>
               <p className="stat-value danger">{fmt(stats.expense)}</p>
            </div>
            <div className="stat-card">
               <h3>Avg Monthly Expense</h3>
               <p className="stat-value">{fmt(Math.round(stats.avgMonthlyExp))}</p>
            </div>
            <div className="stat-card">
               <h3>Highest Spend Month</h3>
               <p className="stat-value">{stats.highestMonth?.label || '—'}</p>
               <span className="stat-detail">{stats.highestMonth ? fmt(stats.highestMonth.expense) : ''}</span>
            </div>
         </div>

         {/* ── Monthly Income vs Expense ── */}
         <div className="dashboard-grid">
            <div className="chart-card">
               <h3>Monthly Income vs Expense</h3>
               <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={monthlyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--sidebar-border)" />
                        <XAxis dataKey="label" stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* ── Net Savings Trend ── */}
            <div className="chart-card">
               <h3>Net Savings Trend</h3>
               <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--sidebar-border)" />
                        <XAxis dataKey="label" stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area
                           type="monotone"
                           dataKey="net"
                           name="Net Savings"
                           stroke="var(--nav-title-color)"
                           fill="var(--nav-title-color)"
                           fillOpacity={0.15}
                           strokeWidth={2}
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* ── Category Spending Over Time ── */}
         {categoryMonthly.length > 0 && (
            <div className="chart-card" style={{ marginTop: '1.5rem' }}>
               <h3>Category Spending Over Time (Top 5)</h3>
               <div className="chart-wrapper chart-wrapper-tall">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={categoryMonthly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--sidebar-border)" />
                        <XAxis dataKey="label" stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="var(--sidebar-text)" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        {top5Names.map((name, i) => (
                           <Line
                              key={name}
                              type="monotone"
                              dataKey={name}
                              stroke={PALETTE[i % PALETTE.length]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              connectNulls
                           />
                        ))}
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
         )}

         {/* ── Monthly Breakdown Table ── */}
         <div className="chart-card" style={{ marginTop: '1.5rem' }}>
            <h3>Monthly Summary</h3>
            <div className="reports-table-wrapper">
               <table className="reports-table">
                  <thead>
                     <tr>
                        <th>Month</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Net</th>
                     </tr>
                  </thead>
                  <tbody>
                     {[...monthlyData].reverse().map(m => (
                        <tr key={m.month}>
                           <td>{m.label}</td>
                           <td className="income-text">{fmt(m.income)}</td>
                           <td className="expense-text">{fmt(m.expense)}</td>
                           <td className={m.net >= 0 ? 'income-text' : 'expense-text'}>
                              {m.net >= 0 ? '+' : ''}{fmt(m.net)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default Reports;