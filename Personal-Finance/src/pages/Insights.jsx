import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { url } from '../constants/constants';
import InsightCard from '../components/insights/InsightCard';
import './Insights.css';

const Insights = () => {
   const { transactions, categories } = useFinance();
   const [question, setQuestion] = useState('');
   const [answer, setAnswer] = useState('');
   const [loading, setLoading] = useState(false);

   // ── Computed financial summaries ──────────────────────────
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

      const sortedCategories = Object.entries(byCategory)
         .sort((a, b) => b[1] - a[1]);

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

      // Recent trend (last 7 days expense vs previous 7 days)
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

   // ── Build context string for Gemini ──────────────────────
   const buildContext = () => {
      if (!summary) return 'The user has no transactions yet.';

      const fmt = (n) => `₹${Number(n).toLocaleString()}`;
      const lines = [
         `FINANCIAL CONTEXT (this month):`,
         `- Total Income: ${fmt(summary.totalIncome)}`,
         `- Total Expenses: ${fmt(summary.totalExpense)}`,
         `- Savings Rate: ${summary.savingsRate}%`,
         `- Transactions this month: ${summary.monthTxCount}`,
         `- All-time transactions: ${summary.allTxCount}`,
         ``,
         `TOP SPENDING CATEGORIES:`,
         ...summary.sortedCategories.slice(0, 5).map(([name, amt], i) => `  ${i+1}. ${name}: ${fmt(amt)}`),
      ];

      if (summary.overBudget.length > 0) {
         lines.push(``, `BUDGET ALERTS:`);
         summary.overBudget.forEach(c => {
            lines.push(`  ⚠ ${c.name}: ${fmt(c.spent)} / ${fmt(c.budget)} (${c.pct}%)`);
         });
      }

      if (summary.weekTrend !== null) {
         const dir = Number(summary.weekTrend) >= 0 ? 'UP' : 'DOWN';
         lines.push(``, `WEEKLY TREND: Spending is ${dir} ${Math.abs(summary.weekTrend)}% vs last week`);
      }

      return lines.join('\n');
   };

   // ── Ask Gemini with context ──────────────────────────────
   const askQuestion = async (e) => {
      if (e?.preventDefault) e.preventDefault();
      if (loading || !question.trim()) return;

      setLoading(true);
      setAnswer('');

      const systemPrompt = `You are PocketPal AI, a friendly personal finance assistant. 
The user is tracking their finances in an app called PocketPal.
Below is their REAL financial data. Use it to give specific, actionable advice.
Keep answers concise (3-5 bullet points max). Use rupees for currency.
Be encouraging but honest about overspending.

${buildContext()}`;

      const payload = {
         system_instruction: {
            parts: [{ text: systemPrompt }]
         },
         contents: [{
            role: "user",
            parts: [{ text: question }]
         }]
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
               setAnswer('⏳ Rate limited — waiting 5 seconds and retrying...');
               await new Promise(res => setTimeout(res, backoff));
               return makeRequest(retries - 1, backoff * 2);
            }
            throw new Error(`Rate limited. Response: ${errBody.substring(0, 200)}`);
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

   // ── Quick-ask suggestions ────────────────────────────────
   const suggestions = [
      "How can I reduce my spending this month?",
      "Am I saving enough?",
      "Which category should I cut back on?",
      "Give me a weekly budget plan",
   ];

   const formatMoney = (n) => `₹${Number(n).toLocaleString()}`;

   // ── Render ───────────────────────────────────────────────
   return (
      <div className="insights-page">
         <h1>✨ AI Insights</h1>
         <p className="insights-subtitle">Smart, personalized analysis of your finances</p>

         {/* ── Auto-generated Insight Cards ── */}
         {summary && (
            <div className="insight-cards-grid">
               <InsightCard
                  icon="💰"
                  title="Savings Rate"
                  value={`${summary.savingsRate}%`}
                  detail={`${formatMoney(summary.totalIncome - summary.totalExpense)} saved this month`}
                  accent={Number(summary.savingsRate) >= 20 ? 'green' : Number(summary.savingsRate) >= 0 ? 'yellow' : 'red'}
               />
               <InsightCard
                  icon="📊"
                  title="Top Expense"
                  value={summary.sortedCategories[0]?.[0] || '—'}
                  detail={summary.sortedCategories[0] ? formatMoney(summary.sortedCategories[0][1]) : 'No expenses yet'}
                  accent="blue"
               />
               <InsightCard
                  icon="📈"
                  title="Weekly Trend"
                  value={summary.weekTrend !== null ? `${summary.weekTrend > 0 ? '+' : ''}${summary.weekTrend}%` : '—'}
                  detail={summary.weekTrend !== null 
                     ? `${formatMoney(summary.thisWeekExp)} this week vs ${formatMoney(summary.lastWeekExp)} last week`
                     : 'Not enough data'}
                  accent={summary.weekTrend === null ? 'gray' : Number(summary.weekTrend) <= 0 ? 'green' : 'red'}
               />
               {summary.overBudget.length > 0 && (
                  <InsightCard
                     icon="🚨"
                     title="Budget Alert"
                     value={`${summary.overBudget.length} categor${summary.overBudget.length === 1 ? 'y' : 'ies'}`}
                     detail={`${summary.overBudget[0].name} at ${summary.overBudget[0].pct}% of budget`}
                     accent="red"
                  />
               )}
            </div>
         )}

         {!summary && (
            <div className="insights-empty">
               <p>Add some transactions first &mdash; then I can analyze your spending! 🧠</p>
            </div>
         )}

         {/* ── Ask AI Section ── */}
         <div className="ask-ai-section">
            <h2>Ask PocketPal AI</h2>
            <p className="ask-subtitle">
               I have access to your <strong>{summary?.allTxCount || 0} transactions</strong> and 
               <strong> {categories.length} categories</strong>. Ask me anything!
            </p>

            <form className="ask-form" onSubmit={askQuestion}>
               <input 
                  type="text"
                  value={question} 
                  placeholder="e.g. How can I save more this month?"
                  onChange={(e) => setQuestion(e.target.value)} 
                  disabled={loading}
               />
               <button type="submit" disabled={loading || !question.trim()}>
                  {loading ? '⏳ Thinking...' : '🚀 Ask'}
               </button>
            </form>

            {/* Quick suggestions */}
            {!answer && (
               <div className="suggestions">
                  {suggestions.map((s, i) => (
                     <button 
                        key={i}
                        className="suggestion-chip"
                        onClick={() => { setQuestion(s); }}
                     >
                        {s}
                     </button>
                  ))}
               </div>
            )}

            {/* AI Answer */}
            {answer && (
               <div className="ai-answer">
                  <div className="ai-header">
                     <span className="ai-avatar">🤖</span>
                     <strong>PocketPal AI</strong>
                  </div>
                  <div className="ai-body">
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