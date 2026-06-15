import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', emoji: '💡' },
  { id: 'why', label: 'Why Invest', emoji: '🌱' },
  { id: 'where', label: 'Where to Invest', emoji: '📍' },
  { id: 'how', label: 'How to Invest', emoji: '🚀' },
  { id: 'compare', label: 'SIP vs Others', emoji: '⚖️' },
  { id: 'tools', label: 'Our Calculators', emoji: '🧮' },
];

const FAQS = [
  // ── WHY INVEST ─────────────────────────────────────────────────────────────
  {
    category: 'why',
    q: 'Why should I start investing?',
    a: `Investing is the most powerful way to beat inflation and build long-term wealth. Money sitting idle in a savings account typically earns 3–4% p.a. — but inflation runs at 5–6%, meaning your money is silently losing purchasing power every year.

By investing in equity mutual funds or index funds, you can historically expect 10–15% p.a. returns over the long term. ₹10,000/month invested for 20 years at 12% p.a. grows to over ₹1 crore — without investing, you'd have only ₹24 lakh in a savings account.

The earlier you start, the more compounding works in your favour. Even starting at ₹500/month makes a difference.`,
  },
  {
    category: 'why',
    q: 'What is compounding and why does it matter?',
    a: `Compounding is earning returns on your returns — it's the "8th wonder of the world" according to Einstein.

Example: ₹1 lakh invested at 12% p.a.:
• Year 1: ₹1,12,000
• Year 5: ₹1,76,234
• Year 10: ₹3,10,585
• Year 20: ₹9,64,629

The growth is not linear — it's exponential. The longer you stay invested, the steeper the curve. This is why time in the market beats timing the market. Starting 5 years earlier can double your final corpus.`,
  },
  {
    category: 'why',
    q: 'Is investing risky? What if markets crash?',
    a: `Short-term volatility is real, but long-term equity returns have always recovered and grown. The Indian market (Nifty 50) has never given a negative return over any 7+ year period historically.

Key risk management strategies:
• **Diversify** — spread across equity, debt, gold
• **Stay invested** — SIP rupee-cost averaging smooths out crashes
• **Keep 6–12 months emergency fund** — so you never sell at a loss during a crisis
• **Match risk to time horizon** — equity for 5+ years, debt for <3 years

Biggest risk is NOT investing — inflation erodes idle savings silently.`,
  },
  {
    category: 'why',
    q: 'How much money do I need to start investing?',
    a: `You can start with as little as ₹100/month in many mutual funds. There is no minimum threshold. The mindset shift — starting early — matters far more than the starting amount.

A simple progression:
• Student/Early career: ₹500–₹2,000/month SIP
• Mid career: 20–30% of take-home salary
• Peak earning: Maximize tax-saving instruments + goal-based SIPs

Use our SIP Calculator to see how even ₹1,000/month compounds over time — you'll be motivated to start today.`,
  },

  // ── WHERE TO INVEST ────────────────────────────────────────────────────────
  {
    category: 'where',
    q: 'Where should I invest my money in India?',
    a: `The best investment options in India by risk level:

**Low Risk (Capital safety)**
• PPF (7.1% p.a., tax-free, 15-year lock-in)
• Fixed Deposits (6–8% p.a., taxable)
• Sukanya Samriddhi (8.2% for girl child)

**Medium Risk (Balanced growth)**
• Debt Mutual Funds (6–9% p.a.)
• Hybrid Funds (8–11% p.a.)
• NPS — National Pension System

**High Risk, High Reward**
• Equity Mutual Funds / Index Funds (10–15% p.a. historically)
• Direct Stocks (variable, requires research)
• REITs (Real Estate Investment Trusts)

Most financial advisors recommend a diversified portfolio with core exposure to low-cost index funds (Nifty 50, Sensex) for the equity portion.`,
  },
  {
    category: 'where',
    q: 'Which mutual fund should I choose for SIP?',
    a: `For beginners, index funds are the gold standard — low cost, no fund manager risk, and market-matching returns.

**Best categories for SIP:**
• **Large Cap Index Funds** (Nifty 50, Sensex) — Stable, 10–12% historical
• **Flexi Cap Funds** — Balanced exposure across company sizes
• **Mid Cap Funds** — Higher growth potential (12–15%), higher volatility

**Key metrics to check:**
• Expense Ratio: Below 0.5% for index, below 1.5% for active
• 5-year rolling returns vs. benchmark
• Fund House reputation (SBI, HDFC, ICICI, Axis, Mirae)

**Where to invest:** Zerodha Coin, Groww, Paytm Money, Kuvera — all allow zero-commission direct MF investments.`,
  },
  {
    category: 'where',
    q: 'Should I invest in stocks or mutual funds?',
    a: `**Mutual Funds** are better for most investors because:
• Professional management / index tracking
• Instant diversification (a single fund holds 50–500 stocks)
• Automatic rebalancing
• SIP discipline — automated monthly investing

**Direct Stocks** are better if you:
• Have time to research businesses deeply
• Understand financial statements
• Can handle 30–50% drawdowns without panic selling
• Want to build concentrated positions in specific sectors

**Verdict:** Start with index fund SIPs. Once you understand the market, allocate a small portion (10–20%) to direct stocks for learning.`,
  },
  {
    category: 'where',
    q: 'Is gold a good investment?',
    a: `Gold serves as a **hedge and safe haven**, not a primary growth asset. It performs well when equity markets crash or during geopolitical uncertainty.

**Gold investment options (best to worst):**
1. **Sovereign Gold Bonds (SGBs)** — 2.5% annual interest + gold price appreciation + tax-free on maturity. Best option.
2. **Gold ETFs** — Tradeable on stock exchanges, 0.5% expense ratio
3. **Digital Gold** (Groww, PhonePe) — Convenient but higher charges
4. **Physical Gold** — Making charges + storage risk, avoid for investment

**Ideal allocation:** 5–15% of portfolio in gold. Do not over-allocate. Use our Lumpsum Calculator to project SGB returns.`,
  },

  // ── HOW TO INVEST ──────────────────────────────────────────────────────────
  {
    category: 'how',
    q: 'How do I start investing as a complete beginner?',
    a: `A simple 5-step beginner roadmap:

**Step 1 — Emergency Fund First**
Save 6 months of expenses in a high-yield savings account or liquid fund before investing.

**Step 2 — Pay Off High-Interest Debt**
Clear credit card debt (36–40% p.a.) before any investment.

**Step 3 — Open a Demat + MF Account**
Zerodha + Coin, or Groww. Takes 15 minutes with Aadhaar + PAN.

**Step 4 — Start a SIP in an Index Fund**
₹1,000–₹5,000/month in Nifty 50 or Sensex index fund. Set it, forget it.

**Step 5 — Increase SIP Annually (Step-Up)**
Increase SIP by 10–15% each year as salary grows. Use our SIP Calculator's Step-Up feature to see the impact.`,
  },
  {
    category: 'how',
    q: 'What is SIP (Systematic Investment Plan)?',
    a: `SIP is an automated investment method where a fixed amount is debited from your bank account every month and invested in a mutual fund of your choice.

**How it works:**
• You choose ₹5,000/month → Nifty 50 Index Fund
• Every month on a fixed date, ₹5,000 is auto-invested
• You get more units when markets are down, fewer when up (Rupee Cost Averaging)
• Over time, your average cost stays lower than lump sum investing

**Why SIP beats lump sum for most people:**
• Removes timing risk — no need to "wait for the right time"
• Brings investing discipline
• Works perfectly with monthly salary cycles

Use our **SIP Calculator** to see exactly how much your monthly SIP will grow to.`,
  },
  {
    category: 'how',
    q: 'How much should I invest per month?',
    a: `A popular framework is the **50-30-20 Rule:**
• 50% of income → Needs (rent, food, EMIs)
• 30% of income → Wants (entertainment, dining)
• 20% of income → Savings & Investments

For aggressive wealth building, target **30–40% savings rate**.

**Quick benchmark by salary:**
• ₹30,000/month → Invest ₹5,000–₹8,000
• ₹60,000/month → Invest ₹12,000–₹20,000
• ₹1 lakh/month → Invest ₹20,000–₹35,000

Always use our **Goal Calculator** to work backwards — enter your target corpus and it tells you exactly the monthly SIP needed.`,
  },
  {
    category: 'how',
    q: 'What is Lumpsum investing? When is it better than SIP?',
    a: `Lumpsum investing means putting a large amount at once into a fund — like a bonus, inheritance, or maturity proceeds.

**Lumpsum is better when:**
• Markets have just corrected 20–30% (undervalued entry point)
• You have a sudden large inflow (bonus, property sale)
• Investment horizon is 10+ years (time smooths entry risk)

**SIP is better when:**
• You receive monthly salary
• You want to remove emotion from investing
• Market valuations seem high

**Pro tip:** If you have a large sum during high market conditions, use **Systematic Transfer Plan (STP)** — park in liquid fund, transfer small amounts monthly to equity.

Use our **Lumpsum Calculator** to project the exact future value.`,
  },

  // ── COMPARE ────────────────────────────────────────────────────────────────
  {
    category: 'compare',
    q: 'What is the difference between SIP and SWP?',
    a: `SIP and SWP are opposites — one builds wealth, the other distributes it.

| | **SIP** | **SWP** |
|---|---|---|
| **Full Form** | Systematic Investment Plan | Systematic Withdrawal Plan |
| **Direction** | Money flows IN | Money flows OUT |
| **Purpose** | Accumulation phase | Distribution/retirement phase |
| **Who uses it** | Working professionals | Retirees / passive income seekers |
| **Example** | ₹10,000/month invested for 20 years | ₹25,000/month withdrawn from ₹1 Cr corpus |

**Life cycle:** You do SIP for 25–30 years of career, then switch to SWP in retirement to create a pension-like monthly income.

Use our **SWP Calculator** to plan sustainable withdrawals that never exhaust your corpus.`,
  },
  {
    category: 'compare',
    q: 'SWP vs Lumpsum withdrawal — which is better?',
    a: `**Never withdraw a lumpsum unless absolutely necessary.** Here's why SWP wins:

**Lumpsum Withdrawal Problem:**
• Your entire corpus stops compounding immediately
• You bear full sequence-of-returns risk
• Tax on entire gains at once

**SWP Advantages:**
• Remaining corpus continues growing at 8–12% p.a.
• Creates predictable monthly income (like a pension)
• Tax-efficient — only withdrawn amount is taxed
• If withdrawal rate < growth rate, corpus can last indefinitely

**Example:** ₹1 Crore corpus at 8% p.a., withdrawing ₹50,000/month (6% rate):
• Corpus keeps growing, lasts 30+ years
• At 10% withdrawal rate, exhausted in ~15 years

Use our **SWP Calculator** to find your safe withdrawal rate.`,
  },
  {
    category: 'compare',
    q: 'SIP vs Lumpsum — which gives better returns?',
    a: `It depends on market conditions:

**In a bull market:** Lumpsum wins — you get full exposure to rising prices from day one.

**In a volatile/falling market:** SIP wins — rupee cost averaging buys more units at lower prices.

**In reality (long-term):** The difference is marginal over 10+ years. What matters more is:
1. Amount invested
2. Time horizon
3. Staying invested during crashes

**Historical data (Nifty 50, 2004–2024):**
• Monthly SIP of ₹10,000 for 20 years → ~₹1.5 Cr
• Lumpsum of ₹24 lakh in 2004 → ~₹2.2 Cr (but who had ₹24L in 2004?)

For regular salaried individuals, **SIP is the practical and psychological winner.**`,
  },
  {
    category: 'compare',
    q: 'FD vs Mutual Funds — where should I keep my money?',
    a: `**Fixed Deposits** are great for capital safety, but poor for wealth creation:
• Returns: 6–8% p.a. (fully taxable as per income slab)
• Real return after 30% tax + 6% inflation ≈ **−0.5% to 1%**

**Equity Mutual Funds** for 5+ year goals:
• Expected returns: 10–14% p.a.
• LTCG tax: Only 10% on gains above ₹1 lakh/year (very efficient)
• Real return after tax + inflation: **4–7%**

**Verdict by goal:**
• Emergency fund → Savings account + Liquid Fund
• 1–3 year goal → FD or Debt Mutual Fund
• 5+ year goal → Equity Mutual Fund / Index Fund
• Retirement (20+ years) → Equity SIP + NPS

Never use FDs for long-term wealth building. Use FDs only where capital protection is paramount.`,
  },

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  {
    category: 'tools',
    q: 'Why is the Goal Calculator the best way to plan?',
    a: `Most people save randomly and hope for the best. The Goal Calculator flips this — it works **backwards from your target:**

1. Set your goal: ₹1 Crore for retirement at age 60
2. Enter current age (30), return rate (12%), time horizon (30 years)
3. Calculator tells you: **You need ₹286/month**

This is revelatory — you realise goals are far more achievable than expected. It also shows:
• How inflation-adjusted goal is higher (₹1 Cr today = ₹5.7 Cr at 6% inflation in 30 years)
• Step-up SIP needed if you want to start small and increase annually
• Wealth gap — how much you need to accumulate vs. what you'll have at current savings rate

The **Goal Calculator** transforms abstract dreams into concrete monthly actions.`,
  },
  {
    category: 'tools',
    q: 'How does the SIP Calculator work?',
    a: `Our SIP Calculator uses the **Future Value of Annuity** formula:

**FV = P × [(1 + r)ⁿ − 1] / r × (1 + r)**

Where:
• **P** = Monthly investment amount
• **r** = Monthly rate (Annual rate ÷ 12)
• **n** = Total months

**Example:** ₹10,000/month for 15 years at 12% p.a.:
• r = 12%/12 = 1% per month
• n = 180 months
• FV = ₹50,45,760

**Advanced features in our calculator:**
• **Step-Up SIP** — automatically increases your investment by X% annually
• **Inflation Adjustment** — shows real purchasing power of future corpus
• **Tax estimation** — LTCG impact on your final returns
• **Year-by-year amortization table** — exportable as CSV`,
  },
  {
    category: 'tools',
    q: 'What is Step-Up SIP and why is it powerful?',
    a: `Step-Up SIP (also called Top-Up SIP) automatically increases your monthly investment by a fixed percentage each year — typically 10–15%.

**Why it's so powerful:**

**Regular SIP** — ₹10,000/month for 20 years at 12%:
→ Final corpus: **₹98 lakhs**

**Step-Up SIP** — ₹10,000/month, +10% each year, 20 years at 12%:
→ Final corpus: **₹1.92 Crores** — almost DOUBLE!

This aligns perfectly with career progression — as your salary grows, your investment grows too. The extra compounding in later years with higher amounts is where the magic happens.

Enable Step-Up in our **SIP Calculator** to see your personalised projection.`,
  },
  {
    category: 'tools',
    q: 'How accurate are these calculator results?',
    a: `Our calculators use standard financial mathematics (FV of annuity, compound interest, SWP amortization) — the same formulas used by banks and financial planners.

**Important caveats:**
• Results assume a **constant rate of return** — real markets fluctuate year to year
• Actual mutual fund returns vary: good years (30%+), bad years (−20%)
• Inflation rate is an estimate — actual inflation varies
• Tax laws can change

**How to use results wisely:**
• Use as a planning benchmark, not a guarantee
• Model conservative (8%), moderate (12%), and optimistic (15%) scenarios
• Review and recalculate every 6–12 months
• Always factor in emergency fund and insurance before investing

The calculators are a starting point for informed decisions — not a replacement for a SEBI-registered financial advisor.`,
  },
  {
    category: 'tools',
    q: 'What is the difference between India (₹) and Global ($) mode?',
    a: `Our calculator supports two locales:

**🇮🇳 India Mode (₹)**
• Values displayed in Indian number system (Lakhs, Crores)
• Tax calculations use Indian LTCG rules (10% above ₹1 lakh/year)
• Default rate benchmarks based on Nifty 50 historical returns
• Currency: Indian Rupee (₹)

**🇺🇸 Global Mode ($)**
• Values displayed in US number system (Thousands, Millions)
• Tax calculations use US capital gains rates (15–20%)
• Currency: US Dollar ($)
• Useful for NRIs, diaspora, or global portfolio planning

Switch between modes using the **🇮🇳/🇺🇸 toggle** in the calculator header. Your inputs and all results update instantly.`,
  },
];

// ── Accordion Item ────────────────────────────────────────────────────────────
function AccordionItem({ faq, index, isOpen, onToggle }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'border-emerald-400/50 bg-emerald-50/60 dark:border-emerald-500/40 dark:bg-emerald-950/10'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:hover:border-slate-700'
      }`}
    >
      {/* Question header */}
      <button
        id={`faq-btn-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={() => onToggle(index)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left cursor-pointer"
      >
        <span
          className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
            isOpen
              ? 'text-emerald-500'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {faq.q}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            isOpen
              ? 'bg-emerald-500 text-white rotate-45'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          +
        </span>
      </button>

      {/* Answer panel */}
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700">
          <div className="mt-4 text-sm leading-relaxed whitespace-pre-line space-y-2 text-slate-600 dark:text-slate-300">
            {faq.a.split('\n').map((line, i) => {
              if (!line.trim()) return <br key={i} />;
              // Bold text between **
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} className="leading-relaxed">
                  {parts.map((part, j) =>
                    j % 2 === 1 ? (
                      <strong
                        key={j}
                        className="text-emerald-700 dark:text-emerald-400 font-semibold"
                      >
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main FAQSection component ─────────────────────────────────────────────────
const FAQSection = () => {
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const filtered =
    activeCategory === 'all'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <section
      aria-label="Frequently Asked Questions"
      className={`py-16 px-4 transition-colors duration-200 ${
        isDarkMode ? 'bg-[#090d16]' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border ${
              isDarkMode
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Investor FAQ
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white"
          >
            Everything you need to know
          </h2>
          <p
            className="text-base max-w-2xl mx-auto text-slate-500 dark:text-slate-400"
          >
            From your first investment to retirement planning — all your questions answered clearly.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Count badge */}
        <p className={`text-center text-xs mb-6 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          Showing {filtered.length} question{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {filtered.map((faq, i) => (
            <AccordionItem
              key={`${activeCategory}-${i}`}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* CTA at bottom */}
        <div
          className={`mt-12 rounded-2xl p-6 text-center border ${
            isDarkMode
              ? 'bg-emerald-950/20 border-emerald-800/40'
              : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <p className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
            Ready to start your investment journey?
          </p>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Use our free calculators — no sign-up required.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { to: '/sip', label: '📈 SIP Calculator' },
              { to: '/lumpsum', label: '💰 Lumpsum Calculator' },
              { to: '/swp', label: '🏦 SWP Calculator' },
              { to: '/goals', label: '🎯 Goal Calculator' },
            ].map((btn) => (
              <Link
                key={btn.to}
                to={btn.to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white shadow-sm'
                }`}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
