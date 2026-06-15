import{j as e}from"./vendor-mui-ArKiFWmM.js";import{r as m,L as I}from"./vendor-react-DuuoFh8M.js";const C=m.createContext();function X({children:t}){const[a,n]=m.useState(()=>{const s=localStorage.getItem("darkMode");return s?JSON.parse(s):!1});m.useEffect(()=>{localStorage.setItem("darkMode",JSON.stringify(a)),a?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},[a]);const r=()=>{n(s=>!s)};return e.jsx(C.Provider,{value:{isDarkMode:a,toggleDarkMode:r},children:t})}function w(){return m.useContext(C)}const D="/api";async function y(t,a={}){try{return await(await fetch(`${D}${t}`,{headers:{"Content-Type":"application/json"},...a})).json()}catch(n){return{ok:!1,error:n.message}}}const P={subscribe(t){return y("/newsletter",{method:"POST",body:JSON.stringify({email:t})})},contact(t){return y("/contacts",{method:"POST",body:JSON.stringify(t)})},listNewsletter(){return y("/newsletter",{method:"GET"})},listContacts(){return y("/contacts",{method:"GET"})}},b={newsletter:"newsletter_subscribers",contacts:"contact_messages"};function F(t){try{const a=localStorage.getItem(t);return a?JSON.parse(a):[]}catch{return[]}}function T(t,a){try{return localStorage.setItem(t,JSON.stringify(a)),!0}catch{return!1}}async function q(t){const a=new Date().toISOString();if((await P.subscribe(t))?.ok)return{ok:!0};const r=F(b.newsletter);return r.find(s=>s.email?.toLowerCase()===t.toLowerCase())||(r.push({email:t,date:a}),T(b.newsletter,r)),{ok:!0,fallback:!0}}async function U({name:t,email:a,message:n}){const r=new Date().toISOString();if((await P.contact({name:t,email:a,message:n}))?.ok)return{ok:!0};const l=F(b.contacts);return l.push({name:t,email:a,message:n,date:r}),T(b.contacts,l),{ok:!0,fallback:!0}}const $=300*1e3,x={};function E(t){return x[t]&&Date.now()-x[t].ts<$}const S={"BTC-USD":"bitcoin","ETH-USD":"ethereum","BNB-USD":"binancecoin","SOL-USD":"solana","DOGE-USD":"dogecoin","USDT-USD":"tether","XRP-USD":"ripple","ADA-USD":"cardano"};async function L(t=[]){const a="crypto_"+t.join(",");if(E(a))return x[a].data;const n=t.map(r=>S[r]).filter(Boolean).join(",");if(!n)return[];try{const r=`https://api.coingecko.com/api/v3/simple/price?ids=${n}&vs_currencies=usd&include_24hr_change=true&include_market_cap=false`,s=await fetch(r,{signal:AbortSignal.timeout(8e3)});if(!s.ok)throw new Error("CoinGecko error "+s.status);const l=await s.json(),d=t.map(o=>{const u=S[o];if(!u||!l[u])return null;const g=l[u];return{symbol:o,shortName:o.replace("-USD",""),price:g.usd??null,changePercent:g.usd_24h_change??null,currency:"USD"}}).filter(Boolean);return x[a]={data:d,ts:Date.now()},d}catch(r){return console.warn("[quoteData] CoinGecko fetch failed:",r.message),x[a]?.data??[]}}const M=[{symbol:"^NSEI",shortName:"NIFTY 50",currency:"INR"},{symbol:"^BSESN",shortName:"SENSEX",currency:"INR"},{symbol:"^GSPC",shortName:"S&P 500",currency:"USD"},{symbol:"^DJI",shortName:"Dow Jones",currency:"USD"}];async function W(t){const n=`https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=2d`)}`,r=await fetch(n,{signal:AbortSignal.timeout(8e3)});if(!r.ok)throw new Error("proxy error "+r.status);const s=await r.json(),d=JSON.parse(s.contents)?.chart?.result?.[0]?.meta;if(!d)throw new Error("no meta");return{price:d.regularMarketPrice??null,prevClose:d.chartPreviousClose??d.previousClose??null}}async function A(){const t="indices";if(E(t))return x[t].data;const n=(await Promise.allSettled(M.map(r=>W(r.symbol).then(s=>({symbol:r.symbol,shortName:r.shortName,currency:r.currency,price:s.price,changePercent:s.prevClose&&s.price?(s.price-s.prevClose)/s.prevClose*100:null}))))).map(r=>r.status==="fulfilled"?r.value:null).filter(Boolean);return n.length>0&&(x[t]={data:n,ts:Date.now()}),n.length>0?n:x[t]?.data??[]}const G=new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}),O=new Intl.NumberFormat("en-US",{maximumFractionDigits:2}),R=new Intl.NumberFormat("en-US",{maximumFractionDigits:0});function Y(t,a){return t==null?"—":a==="INR"?"₹"+G.format(t):t>=1e3?"$"+R.format(t):"$"+O.format(t)}function N({name:t,price:a,changePercent:n,currency:r,isDarkMode:s,badge:l}){const d=(n??0)>=0,o=d?"▲":"▼",u=n!=null?`${o} ${Math.abs(n).toFixed(2)}%`:"—";return e.jsxs("div",{className:`flex-shrink-0 min-w-[130px] rounded-2xl p-4 border transition-all duration-300 ${s?"bg-[#0c1222]/80 border-slate-800 hover:border-emerald-500/30":"bg-white border-slate-200 hover:border-emerald-400/50 shadow-sm"}`,children:[l&&e.jsx("span",{className:`inline-block text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded mb-2 ${s?"bg-slate-800 text-slate-400":"bg-slate-100 text-slate-500"}`,children:l}),e.jsx("div",{className:`text-[11px] font-semibold mb-1 truncate ${s?"text-slate-400":"text-slate-500"}`,children:t}),e.jsx("div",{className:`text-base font-black tracking-tight mb-1 ${s?"text-white":"text-slate-900"}`,children:Y(a,r)}),e.jsx("div",{className:`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${d?s?"bg-emerald-950/60 text-emerald-400":"bg-emerald-50 text-emerald-700":s?"bg-red-950/60 text-red-400":"bg-red-50 text-red-600"}`,children:u})]})}function j({isDarkMode:t}){return e.jsxs("div",{className:`flex-shrink-0 min-w-[130px] rounded-2xl p-4 border animate-pulse ${t?"bg-[#0c1222]/80 border-slate-800":"bg-white border-slate-200"}`,children:[e.jsx("div",{className:`h-2 w-12 rounded mb-3 ${t?"bg-slate-800":"bg-slate-200"}`}),e.jsx("div",{className:`h-3 w-20 rounded mb-2 ${t?"bg-slate-800":"bg-slate-200"}`}),e.jsx("div",{className:`h-5 w-24 rounded mb-2 ${t?"bg-slate-800":"bg-slate-200"}`}),e.jsx("div",{className:`h-3 w-16 rounded-full ${t?"bg-slate-800":"bg-slate-200"}`})]})}const B=["BTC-USD","ETH-USD","BNB-USD","SOL-USD"],H=()=>{const{isDarkMode:t}=w(),[a,n]=m.useState([]),[r,s]=m.useState([]),[l,d]=m.useState(!0),[o,u]=m.useState(null),[g,p]=m.useState(!1),i=m.useCallback(async()=>{try{const[c,f]=await Promise.all([A(),L(B)]);n(c),s(f),u(new Date),p(!1)}catch{p(!0)}finally{d(!1)}},[]);m.useEffect(()=>{i();const c=setInterval(i,300*1e3);return()=>clearInterval(c)},[i]);const h=o?o.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}):null;return e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-1.5 h-4 bg-emerald-500 rounded-full inline-block"}),e.jsx("span",{className:`text-xs font-bold uppercase tracking-wider ${t?"text-slate-400":"text-slate-500"}`,children:"Live Market Data"}),!l&&e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"}),e.jsx("span",{className:`text-[10px] ${t?"text-slate-500":"text-slate-400"}`,children:"LIVE"})]})]}),h&&e.jsxs("button",{onClick:i,className:`text-[10px] px-2 py-1 rounded-lg border transition-colors ${t?"border-slate-700 text-slate-500 hover:text-emerald-400 hover:border-emerald-600":"border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-400"}`,children:["↻ Updated ",h]})]}),g&&!l&&e.jsx("p",{className:`text-xs text-center py-3 ${t?"text-slate-500":"text-slate-400"}`,children:"⚠ Could not load live data. Check your connection."}),(l||a.length>0)&&e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:`text-[10px] font-bold uppercase tracking-widest mb-2 ${t?"text-slate-600":"text-slate-400"}`,children:"Indices"}),e.jsx("div",{className:"flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide",children:l?[1,2,3,4].map(c=>e.jsx(j,{isDarkMode:t},c)):a.map(c=>e.jsx("div",{className:"snap-start",children:e.jsx(N,{name:c.shortName,price:c.price,changePercent:c.changePercent,currency:c.currency,isDarkMode:t,badge:c.currency==="INR"?"NSE":"NYSE"})},c.symbol))})]}),(l||r.length>0)&&e.jsxs("div",{children:[e.jsx("p",{className:`text-[10px] font-bold uppercase tracking-widest mb-2 ${t?"text-slate-600":"text-slate-400"}`,children:"Crypto"}),e.jsx("div",{className:"flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide",children:l?[1,2,3,4].map(c=>e.jsx(j,{isDarkMode:t},c)):r.map(c=>e.jsx("div",{className:"snap-start",children:e.jsx(N,{name:c.shortName,price:c.price,changePercent:c.changePercent,currency:c.currency,isDarkMode:t,badge:"Crypto"})},c.symbol))})]}),e.jsx("p",{className:`text-[9px] mt-3 text-center ${t?"text-slate-700":"text-slate-300"}`,children:"Prices from CoinGecko & Yahoo Finance · Indicative only · Not investment advice"})]})},_=[{id:"all",label:"All Questions",emoji:"💡"},{id:"why",label:"Why Invest",emoji:"🌱"},{id:"where",label:"Where to Invest",emoji:"📍"},{id:"how",label:"How to Invest",emoji:"🚀"},{id:"compare",label:"SIP vs Others",emoji:"⚖️"},{id:"tools",label:"Our Calculators",emoji:"🧮"}],k=[{category:"why",q:"Why should I start investing?",a:`Investing is the most powerful way to beat inflation and build long-term wealth. Money sitting idle in a savings account typically earns 3–4% p.a. — but inflation runs at 5–6%, meaning your money is silently losing purchasing power every year.

By investing in equity mutual funds or index funds, you can historically expect 10–15% p.a. returns over the long term. ₹10,000/month invested for 20 years at 12% p.a. grows to over ₹1 crore — without investing, you'd have only ₹24 lakh in a savings account.

The earlier you start, the more compounding works in your favour. Even starting at ₹500/month makes a difference.`},{category:"why",q:"What is compounding and why does it matter?",a:`Compounding is earning returns on your returns — it's the "8th wonder of the world" according to Einstein.

Example: ₹1 lakh invested at 12% p.a.:
• Year 1: ₹1,12,000
• Year 5: ₹1,76,234
• Year 10: ₹3,10,585
• Year 20: ₹9,64,629

The growth is not linear — it's exponential. The longer you stay invested, the steeper the curve. This is why time in the market beats timing the market. Starting 5 years earlier can double your final corpus.`},{category:"why",q:"Is investing risky? What if markets crash?",a:`Short-term volatility is real, but long-term equity returns have always recovered and grown. The Indian market (Nifty 50) has never given a negative return over any 7+ year period historically.

Key risk management strategies:
• **Diversify** — spread across equity, debt, gold
• **Stay invested** — SIP rupee-cost averaging smooths out crashes
• **Keep 6–12 months emergency fund** — so you never sell at a loss during a crisis
• **Match risk to time horizon** — equity for 5+ years, debt for <3 years

Biggest risk is NOT investing — inflation erodes idle savings silently.`},{category:"why",q:"How much money do I need to start investing?",a:`You can start with as little as ₹100/month in many mutual funds. There is no minimum threshold. The mindset shift — starting early — matters far more than the starting amount.

A simple progression:
• Student/Early career: ₹500–₹2,000/month SIP
• Mid career: 20–30% of take-home salary
• Peak earning: Maximize tax-saving instruments + goal-based SIPs

Use our SIP Calculator to see how even ₹1,000/month compounds over time — you'll be motivated to start today.`},{category:"where",q:"Where should I invest my money in India?",a:`The best investment options in India by risk level:

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

Most financial advisors recommend a diversified portfolio with core exposure to low-cost index funds (Nifty 50, Sensex) for the equity portion.`},{category:"where",q:"Which mutual fund should I choose for SIP?",a:`For beginners, index funds are the gold standard — low cost, no fund manager risk, and market-matching returns.

**Best categories for SIP:**
• **Large Cap Index Funds** (Nifty 50, Sensex) — Stable, 10–12% historical
• **Flexi Cap Funds** — Balanced exposure across company sizes
• **Mid Cap Funds** — Higher growth potential (12–15%), higher volatility

**Key metrics to check:**
• Expense Ratio: Below 0.5% for index, below 1.5% for active
• 5-year rolling returns vs. benchmark
• Fund House reputation (SBI, HDFC, ICICI, Axis, Mirae)

**Where to invest:** Zerodha Coin, Groww, Paytm Money, Kuvera — all allow zero-commission direct MF investments.`},{category:"where",q:"Should I invest in stocks or mutual funds?",a:`**Mutual Funds** are better for most investors because:
• Professional management / index tracking
• Instant diversification (a single fund holds 50–500 stocks)
• Automatic rebalancing
• SIP discipline — automated monthly investing

**Direct Stocks** are better if you:
• Have time to research businesses deeply
• Understand financial statements
• Can handle 30–50% drawdowns without panic selling
• Want to build concentrated positions in specific sectors

**Verdict:** Start with index fund SIPs. Once you understand the market, allocate a small portion (10–20%) to direct stocks for learning.`},{category:"where",q:"Is gold a good investment?",a:`Gold serves as a **hedge and safe haven**, not a primary growth asset. It performs well when equity markets crash or during geopolitical uncertainty.

**Gold investment options (best to worst):**
1. **Sovereign Gold Bonds (SGBs)** — 2.5% annual interest + gold price appreciation + tax-free on maturity. Best option.
2. **Gold ETFs** — Tradeable on stock exchanges, 0.5% expense ratio
3. **Digital Gold** (Groww, PhonePe) — Convenient but higher charges
4. **Physical Gold** — Making charges + storage risk, avoid for investment

**Ideal allocation:** 5–15% of portfolio in gold. Do not over-allocate. Use our Lumpsum Calculator to project SGB returns.`},{category:"how",q:"How do I start investing as a complete beginner?",a:`A simple 5-step beginner roadmap:

**Step 1 — Emergency Fund First**
Save 6 months of expenses in a high-yield savings account or liquid fund before investing.

**Step 2 — Pay Off High-Interest Debt**
Clear credit card debt (36–40% p.a.) before any investment.

**Step 3 — Open a Demat + MF Account**
Zerodha + Coin, or Groww. Takes 15 minutes with Aadhaar + PAN.

**Step 4 — Start a SIP in an Index Fund**
₹1,000–₹5,000/month in Nifty 50 or Sensex index fund. Set it, forget it.

**Step 5 — Increase SIP Annually (Step-Up)**
Increase SIP by 10–15% each year as salary grows. Use our SIP Calculator's Step-Up feature to see the impact.`},{category:"how",q:"What is SIP (Systematic Investment Plan)?",a:`SIP is an automated investment method where a fixed amount is debited from your bank account every month and invested in a mutual fund of your choice.

**How it works:**
• You choose ₹5,000/month → Nifty 50 Index Fund
• Every month on a fixed date, ₹5,000 is auto-invested
• You get more units when markets are down, fewer when up (Rupee Cost Averaging)
• Over time, your average cost stays lower than lump sum investing

**Why SIP beats lump sum for most people:**
• Removes timing risk — no need to "wait for the right time"
• Brings investing discipline
• Works perfectly with monthly salary cycles

Use our **SIP Calculator** to see exactly how much your monthly SIP will grow to.`},{category:"how",q:"How much should I invest per month?",a:`A popular framework is the **50-30-20 Rule:**
• 50% of income → Needs (rent, food, EMIs)
• 30% of income → Wants (entertainment, dining)
• 20% of income → Savings & Investments

For aggressive wealth building, target **30–40% savings rate**.

**Quick benchmark by salary:**
• ₹30,000/month → Invest ₹5,000–₹8,000
• ₹60,000/month → Invest ₹12,000–₹20,000
• ₹1 lakh/month → Invest ₹20,000–₹35,000

Always use our **Goal Calculator** to work backwards — enter your target corpus and it tells you exactly the monthly SIP needed.`},{category:"how",q:"What is Lumpsum investing? When is it better than SIP?",a:`Lumpsum investing means putting a large amount at once into a fund — like a bonus, inheritance, or maturity proceeds.

**Lumpsum is better when:**
• Markets have just corrected 20–30% (undervalued entry point)
• You have a sudden large inflow (bonus, property sale)
• Investment horizon is 10+ years (time smooths entry risk)

**SIP is better when:**
• You receive monthly salary
• You want to remove emotion from investing
• Market valuations seem high

**Pro tip:** If you have a large sum during high market conditions, use **Systematic Transfer Plan (STP)** — park in liquid fund, transfer small amounts monthly to equity.

Use our **Lumpsum Calculator** to project the exact future value.`},{category:"compare",q:"What is the difference between SIP and SWP?",a:`SIP and SWP are opposites — one builds wealth, the other distributes it.

| | **SIP** | **SWP** |
|---|---|---|
| **Full Form** | Systematic Investment Plan | Systematic Withdrawal Plan |
| **Direction** | Money flows IN | Money flows OUT |
| **Purpose** | Accumulation phase | Distribution/retirement phase |
| **Who uses it** | Working professionals | Retirees / passive income seekers |
| **Example** | ₹10,000/month invested for 20 years | ₹25,000/month withdrawn from ₹1 Cr corpus |

**Life cycle:** You do SIP for 25–30 years of career, then switch to SWP in retirement to create a pension-like monthly income.

Use our **SWP Calculator** to plan sustainable withdrawals that never exhaust your corpus.`},{category:"compare",q:"SWP vs Lumpsum withdrawal — which is better?",a:`**Never withdraw a lumpsum unless absolutely necessary.** Here's why SWP wins:

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

Use our **SWP Calculator** to find your safe withdrawal rate.`},{category:"compare",q:"SIP vs Lumpsum — which gives better returns?",a:`It depends on market conditions:

**In a bull market:** Lumpsum wins — you get full exposure to rising prices from day one.

**In a volatile/falling market:** SIP wins — rupee cost averaging buys more units at lower prices.

**In reality (long-term):** The difference is marginal over 10+ years. What matters more is:
1. Amount invested
2. Time horizon
3. Staying invested during crashes

**Historical data (Nifty 50, 2004–2024):**
• Monthly SIP of ₹10,000 for 20 years → ~₹1.5 Cr
• Lumpsum of ₹24 lakh in 2004 → ~₹2.2 Cr (but who had ₹24L in 2004?)

For regular salaried individuals, **SIP is the practical and psychological winner.**`},{category:"compare",q:"FD vs Mutual Funds — where should I keep my money?",a:`**Fixed Deposits** are great for capital safety, but poor for wealth creation:
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

Never use FDs for long-term wealth building. Use FDs only where capital protection is paramount.`},{category:"tools",q:"Why is the Goal Calculator the best way to plan?",a:`Most people save randomly and hope for the best. The Goal Calculator flips this — it works **backwards from your target:**

1. Set your goal: ₹1 Crore for retirement at age 60
2. Enter current age (30), return rate (12%), time horizon (30 years)
3. Calculator tells you: **You need ₹286/month**

This is revelatory — you realise goals are far more achievable than expected. It also shows:
• How inflation-adjusted goal is higher (₹1 Cr today = ₹5.7 Cr at 6% inflation in 30 years)
• Step-up SIP needed if you want to start small and increase annually
• Wealth gap — how much you need to accumulate vs. what you'll have at current savings rate

The **Goal Calculator** transforms abstract dreams into concrete monthly actions.`},{category:"tools",q:"How does the SIP Calculator work?",a:`Our SIP Calculator uses the **Future Value of Annuity** formula:

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
• **Year-by-year amortization table** — exportable as CSV`},{category:"tools",q:"What is Step-Up SIP and why is it powerful?",a:`Step-Up SIP (also called Top-Up SIP) automatically increases your monthly investment by a fixed percentage each year — typically 10–15%.

**Why it's so powerful:**

**Regular SIP** — ₹10,000/month for 20 years at 12%:
→ Final corpus: **₹98 lakhs**

**Step-Up SIP** — ₹10,000/month, +10% each year, 20 years at 12%:
→ Final corpus: **₹1.92 Crores** — almost DOUBLE!

This aligns perfectly with career progression — as your salary grows, your investment grows too. The extra compounding in later years with higher amounts is where the magic happens.

Enable Step-Up in our **SIP Calculator** to see your personalised projection.`},{category:"tools",q:"How accurate are these calculator results?",a:`Our calculators use standard financial mathematics (FV of annuity, compound interest, SWP amortization) — the same formulas used by banks and financial planners.

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

The calculators are a starting point for informed decisions — not a replacement for a SEBI-registered financial advisor.`},{category:"tools",q:"What is the difference between India (₹) and Global ($) mode?",a:`Our calculator supports two locales:

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

Switch between modes using the **🇮🇳/🇺🇸 toggle** in the calculator header. Your inputs and all results update instantly.`}];function z({faq:t,index:a,isOpen:n,onToggle:r}){return e.jsxs("div",{className:`border rounded-2xl overflow-hidden transition-all duration-300 ${n?"border-emerald-400/50 bg-emerald-50/60 dark:border-emerald-500/40 dark:bg-emerald-950/10":"border-slate-200 bg-white hover:border-slate-300 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:hover:border-slate-700"}`,children:[e.jsxs("button",{id:`faq-btn-${a}`,"aria-expanded":n,"aria-controls":`faq-panel-${a}`,onClick:()=>r(a),className:"w-full flex items-start justify-between gap-4 p-5 text-left cursor-pointer",children:[e.jsx("span",{className:`text-sm sm:text-base font-semibold leading-snug transition-colors ${n?"text-emerald-500":"text-slate-800 dark:text-slate-100"}`,children:t.q}),e.jsx("span",{className:`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${n?"bg-emerald-500 text-white rotate-45":"bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"}`,children:"+"})]}),e.jsx("div",{id:`faq-panel-${a}`,role:"region","aria-labelledby":`faq-btn-${a}`,className:`transition-all duration-300 ease-in-out overflow-hidden ${n?"max-h-[2000px] opacity-100":"max-h-0 opacity-0"}`,children:e.jsx("div",{className:"px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700",children:e.jsx("div",{className:"mt-4 text-sm leading-relaxed whitespace-pre-line space-y-2 text-slate-600 dark:text-slate-300",children:t.a.split(`
`).map((s,l)=>{if(!s.trim())return e.jsx("br",{},l);const d=s.split(/\*\*(.*?)\*\*/g);return e.jsx("p",{className:"leading-relaxed",children:d.map((o,u)=>u%2===1?e.jsx("strong",{className:"text-emerald-700 dark:text-emerald-400 font-semibold",children:o},u):o)},l)})})})})]})}const Q=()=>{const{isDarkMode:t}=w(),[a,n]=m.useState(null),[r,s]=m.useState("all"),l=o=>{n(u=>u===o?null:o)},d=r==="all"?k:k.filter(o=>o.category===r);return e.jsx("section",{"aria-label":"Frequently Asked Questions",className:`py-16 px-4 transition-colors duration-200 ${t?"bg-[#090d16]":"bg-slate-50"}`,children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-10",children:[e.jsxs("span",{className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border ${t?"bg-emerald-950/40 border-emerald-800 text-emerald-400":"bg-emerald-50 border-emerald-200 text-emerald-700"}`,children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"}),"Investor FAQ"]}),e.jsx("h2",{className:"text-3xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white",children:"Everything you need to know"}),e.jsx("p",{className:"text-base max-w-2xl mx-auto text-slate-500 dark:text-slate-400",children:"From your first investment to retirement planning — all your questions answered clearly."})]}),e.jsx("div",{className:"flex flex-wrap gap-2 justify-center mb-8",children:_.map(o=>e.jsxs("button",{onClick:()=>{s(o.id),n(null)},className:`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${r===o.id?"bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20":t?"bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200":"bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"}`,children:[e.jsx("span",{children:o.emoji}),e.jsx("span",{children:o.label})]},o.id))}),e.jsxs("p",{className:`text-center text-xs mb-6 ${t?"text-slate-600":"text-slate-400"}`,children:["Showing ",d.length," question",d.length!==1?"s":""]}),e.jsx("div",{className:"flex flex-col gap-3",children:d.map((o,u)=>e.jsx(z,{faq:o,index:u,isOpen:a===u,onToggle:l},`${r}-${u}`))}),e.jsxs("div",{className:`mt-12 rounded-2xl p-6 text-center border ${t?"bg-emerald-950/20 border-emerald-800/40":"bg-emerald-50 border-emerald-200"}`,children:[e.jsx("p",{className:`text-base font-semibold mb-1 ${t?"text-emerald-300":"text-emerald-800"}`,children:"Ready to start your investment journey?"}),e.jsx("p",{className:`text-sm mb-4 ${t?"text-slate-400":"text-slate-500"}`,children:"Use our free calculators — no sign-up required."}),e.jsx("div",{className:"flex flex-wrap gap-3 justify-center",children:[{to:"/sip",label:"📈 SIP Calculator"},{to:"/lumpsum",label:"💰 Lumpsum Calculator"},{to:"/swp",label:"🏦 SWP Calculator"},{to:"/goals",label:"🎯 Goal Calculator"}].map(o=>e.jsx(I,{to:o.to,className:`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${t?"bg-slate-800 border-slate-700 text-slate-200 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white":"bg-white border-slate-200 text-slate-700 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white shadow-sm"}`,children:o.label},o.to))})]})]})})},V=()=>{const[t,a]=m.useState(""),[n,r]=m.useState(null),[s,l]=m.useState({name:"",email:"",message:""}),[d,o]=m.useState(null),u=async i=>{if(i.preventDefault(),!t)return;r("Saving...");const h=await q(t);r(h?.ok?"Subscribed!":"Failed. Try again"),h?.ok&&a("")},g=async i=>{i.preventDefault();const{name:h,email:c,message:f}=s;if(!h||!c||!f)return;o("Saving...");const v=await U(s);o(v?.ok?"Sent!":"Failed. Try again"),v?.ok&&l({name:"",email:"",message:""})},{isDarkMode:p}=w();return e.jsxs("div",{className:"min-h-screen",children:[e.jsxs("div",{className:p?"relative overflow-hidden bg-[#090d16] min-h-[88dvh] md:min-h-[78vh] flex items-center":"relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 min-h-[88dvh] md:min-h-[78vh] flex items-center",children:[e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"}),e.jsx("div",{className:"absolute bottom-[-5%] right-[5%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]"}),e.jsx("div",{className:"absolute top-[30%] right-[20%] w-[200px] h-[200px] bg-emerald-400/5 rounded-full blur-[60px]"})]}),e.jsx("div",{className:"relative z-10 container mx-auto px-4 py-10 md:py-16",children:e.jsxs("div",{className:"max-w-5xl mx-auto text-center",children:[e.jsxs("span",{className:"inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 mb-6 backdrop-blur-sm",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"}),"Free · No sign-up · SIP · Lumpsum · SWP · EMI · Goals"]}),e.jsxs("h1",{className:"text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight",children:["Smart"," ",e.jsx("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400",children:"Investment"})," ","Calculator"]}),e.jsx("p",{className:"text-base sm:text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed",children:"Plan SIP, Lumpsum, SWP, EMI & Goals with real-time projections, inflation adjustments and tax estimates. Built for India, works globally."}),e.jsx("div",{className:"flex flex-wrap justify-center gap-3 mb-10",children:[{to:"/sip",label:"📈 SIP Calculator",primary:!0},{to:"/lumpsum",label:"💰 Lumpsum",primary:!1},{to:"/emi",label:"🏠 EMI Calculator",primary:!1},{to:"/goals",label:"🎯 Goal Planner",primary:!1},{to:"/compare",label:"⚖️ Compare",primary:!1}].map(i=>e.jsx(I,{to:i.to,className:i.primary?"px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/25 text-sm":"px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 backdrop-blur-sm text-sm",children:i.label},i.to))}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto",children:[{icon:"📊",label:"Year-by-Year Charts",desc:"Visual projections"},{icon:"🧾",label:"Tax Estimation",desc:"LTCG & STCG"},{icon:"🌍",label:"India & Global",desc:"₹ & $ modes"},{icon:"📤",label:"Share Results",desc:"WhatsApp & Link"}].map(i=>e.jsxs("div",{className:"rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm",children:[e.jsx("div",{className:"text-xl mb-1",children:i.icon}),e.jsx("div",{className:"text-xs font-bold text-white mb-0.5",children:i.label}),e.jsx("div",{className:"text-[10px] text-slate-400",children:i.desc})]},i.label))})]})})]}),e.jsx("div",{className:p?"bg-[#0c1222] border-b border-slate-800":"bg-white border-b border-slate-200",children:e.jsx("div",{className:"container mx-auto px-4 py-6",children:e.jsx("div",{className:p?"max-w-6xl mx-auto rounded-2xl border border-slate-800 bg-[#090d16]/70 p-5":"max-w-6xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-5",children:e.jsx(H,{})})})}),e.jsx(Q,{}),e.jsx("div",{className:p?"bg-slate-950/40":"bg-slate-50",children:e.jsxs("div",{className:"container mx-auto px-4 py-12",children:[e.jsxs("div",{className:"max-w-6xl mx-auto mb-8 text-center",children:[e.jsx("h2",{className:p?"text-2xl md:text-3xl font-bold text-gray-100 mb-2":"text-2xl md:text-3xl font-bold text-gray-900 mb-2",children:"Stay connected"}),e.jsx("p",{className:p?"text-sm md:text-base text-gray-400":"text-sm md:text-base text-gray-600",children:"Get market insights and ask planning questions anytime."})]}),e.jsxs("div",{className:"max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start",children:[e.jsxs("div",{className:"form-box",children:[e.jsx("h3",{children:"Subscribe to Our Newsletter"}),e.jsxs("form",{onSubmit:u,children:[e.jsx("label",{className:"sr-only",htmlFor:"newsletter-email",children:"Enter your email"}),e.jsx("input",{id:"newsletter-email",type:"email",className:"input",placeholder:"Enter your email",value:t,onChange:i=>a(i.target.value),required:!0}),e.jsx("button",{type:"submit",className:"button-primary",children:"Subscribe"})]}),n&&e.jsx("p",{className:"mt-2 text-xs",style:{color:"var(--color-text-secondary)"},children:n})]}),e.jsxs("div",{className:"form-box",children:[e.jsx("h3",{children:"Contact Us"}),e.jsxs("form",{onSubmit:g,children:[e.jsx("label",{className:"sr-only",htmlFor:"contact-name",children:"Your name"}),e.jsx("input",{id:"contact-name",type:"text",className:"input",placeholder:"Your name",value:s.name,onChange:i=>l(h=>({...h,name:i.target.value})),required:!0}),e.jsx("label",{className:"sr-only",htmlFor:"contact-email",children:"Your email"}),e.jsx("input",{id:"contact-email",type:"email",className:"input",placeholder:"Your email",value:s.email,onChange:i=>l(h=>({...h,email:i.target.value})),required:!0}),e.jsx("label",{className:"sr-only",htmlFor:"contact-message",children:"Message"}),e.jsx("textarea",{id:"contact-message",className:"input",placeholder:"Message",rows:"4",value:s.message,onChange:i=>l(h=>({...h,message:i.target.value})),required:!0}),e.jsx("button",{className:"button-primary",children:"Send"})]}),d&&e.jsx("p",{className:"mt-2 text-xs",style:{color:"var(--color-text-secondary)"},children:d})]})]})]})})]})},Z=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"}));export{Z as H,X as T,w as u};
