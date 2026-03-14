import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { url } from '../constants/constants';
import './Insights.css';

const Insights = () => {
   const { transactions, categories } = useFinance();
   const [question, setQuestion] = useState('');
   const [answer, setAnswer] = useState('');
   const [loading, setLoading] = useState(false);

   // ── Computed financial summaries ──
   const summary = useMemo(() => {
      if (!transactions || transactions.length === 0) return null;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear  = now.getFullYear();

      const monthTx = transactions.filter(t => {
         const d = new Date(t.date);
         return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });

      const totalIncome  = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const totalExpense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      const savingsRate  = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

      // Group expenses by category
      const byCategory = {};
      monthTx.filter(t => t.type === 'expense').forEach(t => {
         const cat = categories.find(c => c.id === t.category_id);
         const name = cat ? cat.name : 'Unknown';
         byCategory[name] = (byCategory[name] || 0) + Number(t.amount);
      });

      const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

      // Budget alerts
      const overBudget = categories
         .filter(c => c.budgetLimit > 0)
         .map(c => {
            const spent = monthTx
               .filter(t => t.type === 'expense' && t.category_id === c.id)
               .reduce((s, t) => s + Number(t.amount), 0);
            const pct = (spent / c.budgetLimit * 100).toFixed(0);
            return { name: c.name, budget: c.budgetLimit, spent, pct: Number(pct), color: c.color };
         })
         .filter(c => c.pct >= 70)
         .sort((a, b) => b.pct - a.pct);

      // Weekly trend
      const today = now.getTime();
      const weekAgo = today - 7 * 86400000;
      const twoWeeksAgo = today - 14 * 86400000;
      const thisWeekExp = transactions
         .filter(t => t.type === 'expense' && new Date(t.date).getTime() >= weekAgo)
         .reduce((s, t) => s + Number(t.amount), 0);
      const lastWeekExp = transactions
         .filter(t => t.type === 'expense' && new Date(t.date).getTime() >= twoWeeksAgo && new Date(t.date).getTime() < weekAgo)
         .reduce((s, t) => s + Number(t.amount), 0);

      const weekTrend = lastWeekExp > 0 
         ? ((thisWeekExp - lastWeekExp) / lastWeekExp * 100).toFixed(0) 
         : null;

      return {
         totalIncome, totalExpense, savingsRate,
         sortedCategories, overBudget,
         thisWeekExp, lastWeekExp, weekTrend,
         monthTxCount: monthTx.length,
         allTxCount: transactions.length
      };
   }, [transactions, categories]);

   // ── Build context string for Gemini ──
   const buildContext = () => {
      if (!summary) return 'The user has no transactions yet.';
      const fmt = (n) => `Rs.${Number(n).toLocaleString()}`;
      const lines = [
         `FINANCIAL CONTEXT (this month):`,
         `- Total Income: ${fmt(summary.totalIncome)}`,
         `- Total Expenses: ${fmt(summary.totalExpense)}`,
         `- Savings Rate: ${summary.savingsRate}%`,
         `- Transactions this month: ${summary.monthTxCount}`,
         `- All-time transactions: ${summary.allTxCount}`,
         ``, `TOP SPENDING CATEGORIES:`,
         ...summary.sortedCategories.slice(0, 5).map(([name, amt], i) => `  ${i+1}. ${name}: ${fmt(amt)}`),
      ];
      if (summary.overBudget.length > 0) {
         lines.push(``, `BUDGET ALERTS:`);
         summary.overBudget.forEach(c => {
            lines.push(`  WARNING: ${c.name}: ${fmt(c.spent)} / ${fmt(c.budget)} (${c.pct}%)`);
         });
      }
      if (summary.weekTrend !== null) {
         const dir = Number(summary.weekTrend) >= 0 ? 'UP' : 'DOWN';
         lines.push(``, `WEEKLY TREND: Spending is ${dir} ${Math.abs(summary.weekTrend)}% vs last week`);
      }
      return lines.join('\n');
   };

   // ── Ask Gemini ──
   const askQuestion = async (e) => {
      if (e?.preventDefault) e.preventDefault();
      if (loading || !question.trim()) return;
      setLoading(true);
      setAnswer('');

      const systemPrompt = `You are a helpful personal finance assistant inside an app called PocketPal. 
Below is the user's real financial data. Use it to give specific, actionable advice.
Keep answers concise (3-5 bullet points). Use Rs. for currency. Be encouraging but honest.

${buildContext()}`;

      const payload = {
         system_instruction: { parts: [{ text: systemPrompt }] },
         contents: [{ role: "user", parts: [{ text: question }] }]
      };

      const makeRequest = async (retries = 1, backoff = 5000) => {
         const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
         });
         if (response.status === 429) {
            const errBody = await response.text().catch(() => '');
            console.error("429 response body:", errBody);
            if (retries > 0) {
               setAnswer('Waiting a few seconds and retrying...');
               await new Promise(res => setTimeout(res, backoff));
               return makeRequest(retries - 1, backoff * 2);
            }
            throw new Error("Rate limit reached. Wait 30-60 seconds and try again.");
         }
         if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            console.error("Gemini API error body:", errBody);
            throw new Error(`API error: ${response.status}`);
         }
         return response.json();
      };

      try {
         const result = await makeRequest();
         const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
         setAnswer(aiText);
      } catch (error) {
         setAnswer(`Error: ${error.message}`);
      } finally {
         setLoading(false);
      }
   };

   const suggestions = [
      "How can I reduce my spending?",
      "Am I saving enough?",
      "Which category should I cut back on?",
      "Give me a weekly budget plan",
   ];

   const fmt = (n) => `₹${Number(n).toLocaleString()}`;

   return (
      <div className="page_content">
         <h1>Insights</h1>

         {/* ── Stat Cards ── */}
         {summary ? (
            <div className="insights-grid">
               <div className="stat-card">
                  <h3>Savings Rate</h3>
                  <p className={`stat-value ${Number(summary.savingsRate) >= 20 ? 'safe' : Number(summary.savingsRate) >= 0 ? 'warn' : 'danger'}`}>
                     {summary.savingsRate}%
                  </p>
                  <span className="stat-detail">{fmt(summary.totalIncome - summary.totalExpense)} saved this month</span>
               </div>

               <div className="stat-card">
                  <h3>Top Expense</h3>
                  <p className="stat-value">{summary.sortedCategories[0]?.[0] || '—'}</p>
                  <span className="stat-detail">
                     {summary.sortedCategories[0] ? fmt(summary.sortedCategories[0][1]) : 'No expenses yet'}
                  </span>
               </div>

               <div className="stat-card">
                  <h3>Weekly Trend</h3>
                  <p className={`stat-value ${summary.weekTrend === null ? '' : Number(summary.weekTrend) <= 0 ? 'safe' : 'danger'}`}>
                     {summary.weekTrend !== null ? `${Number(summary.weekTrend) > 0 ? '+' : ''}${summary.weekTrend}%` : '—'}
                  </p>
                  <span className="stat-detail">
                     {summary.weekTrend !== null 
                        ? `${fmt(summary.thisWeekExp)} this week` 
                        : 'Not enough data yet'}
                  </span>
               </div>

               {summary.overBudget.length > 0 && (
                  <div className="stat-card alert">
                     <h3>Budget Alert</h3>
                     <p className="stat-value danger">
                        {summary.overBudget.length} categor{summary.overBudget.length === 1 ? 'y' : 'ies'}
                     </p>
                     <span className="stat-detail">{summary.overBudget[0].name} at {summary.overBudget[0].pct}%</span>
                  </div>
               )}
            </div>
         ) : (
            <div className="insights-empty">
               <p>Add some transactions to see your financial insights here.</p>
            </div>
         )}

         {/* ── Category Breakdown ── */}
         {summary && summary.sortedCategories.length > 0 && (
            <div className="chart-card breakdown-card">
               <h3>Spending Breakdown</h3>
               <div className="breakdown-list">
                  {summary.sortedCategories.map(([name, amt]) => {
                     const pct = summary.totalExpense > 0 ? (amt / summary.totalExpense * 100).toFixed(0) : 0;
                     return (
                        <div key={name} className="breakdown-row">
                           <span className="breakdown-name">{name}</span>
                           <div className="breakdown-bar-track">
                              <div className="breakdown-bar-fill" style={{ width: `${pct}%` }}></div>
                           </div>
                           <span className="breakdown-amount">{fmt(amt)}</span>
                           <span className="breakdown-pct">{pct}%</span>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}

         {/* ── Ask AI ── */}
         <div className="chart-card ask-card">
            <h3>Ask PocketPal AI</h3>
            <p className="ask-meta">
               Analyzing {summary?.allTxCount || 0} transactions across {categories.length} categories
            </p>

            <form className="ask-form" onSubmit={askQuestion}>
               <input 
                  type="text"
                  value={question} 
                  placeholder="e.g. How can I save more this month?"
                  onChange={(e) => setQuestion(e.target.value)} 
                  disabled={loading}
               />
               <button type="submit" className="add-btn" disabled={loading || !question.trim()}>
                  {loading ? 'Thinking...' : 'Ask'}
               </button>
            </form>

            {!answer && (
               <div className="suggestions">
                  {suggestions.map((s, i) => (
                     <button key={i} className="suggestion-chip" onClick={() => setQuestion(s)}>
                        {s}
                     </button>
                  ))}
               </div>
            )}

            {answer && (
               <div className="ai-response">
                  <div className="ai-response-header">PocketPal AI</div>
                  <div className="ai-response-body">
                     {answer.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Insights;