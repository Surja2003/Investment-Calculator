import{j as e}from"./vendor-mui-aA8SLGVL.js";import{r as m,L as j}from"./vendor-react-DuuoFh8M.js";const M=m.createContext();function oe({children:t}){const[a,n]=m.useState(()=>{const r=localStorage.getItem("darkMode");return r?JSON.parse(r):!1});m.useEffect(()=>{localStorage.setItem("darkMode",JSON.stringify(a)),a?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},[a]);const s=()=>{n(r=>!r)};return e.jsx(M.Provider,{value:{isDarkMode:a,toggleDarkMode:s},children:t})}function S(){return m.useContext(M)}const B={width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round"},p=({size:t=24,children:a,...n})=>e.jsx("svg",{...B,width:t,height:t,"aria-hidden":"true",...n,children:a}),le=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M3 10.5 12 3l9 7.5"}),e.jsx("path",{d:"M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"}),e.jsx("path",{d:"M9.5 21v-6h5v6"})]}),ie=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M3 16.5 9 10l4 4 8-8"}),e.jsx("path",{d:"M15 6h6v6"})]}),ce=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M3 7.5A2.5 2.5 0 0 1 5.5 5H18a1 1 0 0 1 1 1v1.5"}),e.jsx("path",{d:"M3 7.5V18a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3"}),e.jsx("path",{d:"M20.5 11H16a2.5 2.5 0 0 0 0 5h4.5a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5Z"})]}),de=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M3 9.5 12 4l9 5.5"}),e.jsx("path",{d:"M4 9.5h16"}),e.jsx("path",{d:"M6 10v7M10 10v7M14 10v7M18 10v7"}),e.jsx("path",{d:"M3.5 20.5h17"})]}),ue=t=>e.jsxs(p,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.5"}),e.jsx("circle",{cx:"12",cy:"12",r:"5"}),e.jsx("circle",{cx:"12",cy:"12",r:"1.6",fill:"currentColor",stroke:"none"})]}),me=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M12 4v16"}),e.jsx("path",{d:"M6 20h12"}),e.jsx("path",{d:"M4.5 7.5 12 6l7.5 1.5"}),e.jsx("path",{d:"M4.5 7.5 2.5 13a3 3 0 0 0 6 0L6.5 7"}),e.jsx("path",{d:"M19.5 7.5 17.5 13a3 3 0 0 0 6 0L21.5 7",transform:"translate(-2 0)"})]}),he=t=>e.jsxs(p,{...t,children:[e.jsx("rect",{x:"5",y:"3",width:"14",height:"18",rx:"2.5"}),e.jsx("path",{d:"M8 7h8"}),e.jsx("path",{d:"M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14h.01M12 14h.01M8.5 17h.01M12 17h.01"}),e.jsx("path",{d:"M15.5 14v3.5"})]}),pe=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2Z"}),e.jsx("path",{d:"M4 19.5A2 2 0 0 1 6 18h14"}),e.jsx("path",{d:"M8 7.5h7M8 10.5h5"})]}),q=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M4 20V4"}),e.jsx("path",{d:"M4 20h16"}),e.jsx("rect",{x:"7",y:"12",width:"3",height:"5",rx:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("rect",{x:"12",y:"9",width:"3",height:"8",rx:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("rect",{x:"17",y:"6",width:"3",height:"11",rx:"0.8",fill:"currentColor",stroke:"none"})]}),$=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M5 3.5v17l2-1.3 2 1.3 2-1.3 2 1.3 2-1.3 2 1.3v-17a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1Z"}),e.jsx("path",{d:"M8.5 8h7M8.5 12h7"})]}),U=t=>e.jsxs(p,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.5"}),e.jsx("path",{d:"M3.5 12h17"}),e.jsx("path",{d:"M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z"})]}),A=t=>e.jsxs(p,{...t,children:[e.jsx("path",{d:"M12 3.5 5 6v5.5c0 4.3 2.9 7.4 7 8.9 4.1-1.5 7-4.6 7-8.9V6l-7-2.5Z"}),e.jsx("path",{d:"m9 12 2 2 4-4"})]}),xe=t=>e.jsxs(p,{...t,children:[e.jsx("circle",{cx:"5",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"12",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"19",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"})]}),ge=t=>e.jsx(p,{...t,children:e.jsx("path",{d:"M6 6l12 12M18 6 6 18"})}),L="/api";async function b(t,a={}){try{return await(await fetch(`${L}${t}`,{headers:{"Content-Type":"application/json"},...a})).json()}catch(n){return{ok:!1,error:n.message}}}const F={subscribe(t){return b("/newsletter",{method:"POST",body:JSON.stringify({email:t})})},contact(t){return b("/contacts",{method:"POST",body:JSON.stringify(t)})},listNewsletter(){return b("/newsletter",{method:"GET"})},listContacts(){return b("/contacts",{method:"GET"})}},v={newsletter:"newsletter_subscribers",contacts:"contact_messages"};function E(t){try{const a=localStorage.getItem(t);return a?JSON.parse(a):[]}catch{return[]}}function T(t,a){try{return localStorage.setItem(t,JSON.stringify(a)),!0}catch{return!1}}async function R(t){const a=new Date().toISOString();if((await F.subscribe(t))?.ok)return{ok:!0};const s=E(v.newsletter);return s.find(r=>r.email?.toLowerCase()===t.toLowerCase())||(s.push({email:t,date:a}),T(v.newsletter,s)),{ok:!0,fallback:!0}}async function W({name:t,email:a,message:n}){const s=new Date().toISOString();if((await F.contact({name:t,email:a,message:n}))?.ok)return{ok:!0};const l=E(v.contacts);return l.push({name:t,email:a,message:n,date:s}),T(v.contacts,l),{ok:!0,fallback:!0}}const O=300*1e3,g={};function D(t){return g[t]&&Date.now()-g[t].ts<O}const k={"BTC-USD":"bitcoin","ETH-USD":"ethereum","BNB-USD":"binancecoin","SOL-USD":"solana","DOGE-USD":"dogecoin","USDT-USD":"tether","XRP-USD":"ripple","ADA-USD":"cardano"};async function G(t=[]){const a="crypto_"+t.join(",");if(D(a))return g[a].data;const n=t.map(s=>k[s]).filter(Boolean).join(",");if(!n)return[];try{const s=`https://api.coingecko.com/api/v3/simple/price?ids=${n}&vs_currencies=usd&include_24hr_change=true&include_market_cap=false`,r=await fetch(s,{signal:AbortSignal.timeout(8e3)});if(!r.ok)throw new Error("CoinGecko error "+r.status);const l=await r.json(),d=t.map(o=>{const u=k[o];if(!u||!l[u])return null;const x=l[u];return{symbol:o,shortName:o.replace("-USD",""),price:x.usd??null,changePercent:x.usd_24h_change??null,currency:"USD"}}).filter(Boolean);return g[a]={data:d,ts:Date.now()},d}catch(s){return console.warn("[quoteData] CoinGecko fetch failed:",s.message),g[a]?.data??[]}}const H=[{symbol:"^NSEI",shortName:"NIFTY 50",currency:"INR"},{symbol:"^BSESN",shortName:"SENSEX",currency:"INR"},{symbol:"^GSPC",shortName:"S&P 500",currency:"USD"},{symbol:"^DJI",shortName:"Dow Jones",currency:"USD"}];async function Y(t){const n=`https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1d&range=2d`)}`,s=await fetch(n,{signal:AbortSignal.timeout(8e3)});if(!s.ok)throw new Error("proxy error "+s.status);const r=await s.json(),d=JSON.parse(r.contents)?.chart?.result?.[0]?.meta;if(!d)throw new Error("no meta");return{price:d.regularMarketPrice??null,prevClose:d.chartPreviousClose??d.previousClose??null}}async function _(){const t="indices";if(D(t))return g[t].data;const n=(await Promise.allSettled(H.map(s=>Y(s.symbol).then(r=>({symbol:s.symbol,shortName:s.shortName,currency:s.currency,price:r.price,changePercent:r.prevClose&&r.price?(r.price-r.prevClose)/r.prevClose*100:null}))))).map(s=>s.status==="fulfilled"?s.value:null).filter(Boolean);return n.length>0&&(g[t]={data:n,ts:Date.now()}),n.length>0?n:g[t]?.data??[]}const V=new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}),z=new Intl.NumberFormat("en-US",{maximumFractionDigits:2}),Q=new Intl.NumberFormat("en-US",{maximumFractionDigits:0});function J(t,a){return t==null?"—":a==="INR"?"₹"+V.format(t):t>=1e3?"$"+Q.format(t):"$"+z.format(t)}function N({name:t,price:a,changePercent:n,currency:s,isDarkMode:r,badge:l}){const d=(n??0)>=0,o=d?"▲":"▼",u=n!=null?`${o} ${Math.abs(n).toFixed(2)}%`:"—";return e.jsxs("div",{className:`flex-shrink-0 min-w-[130px] rounded-2xl p-4 border transition-all duration-300 ${r?"bg-[#141416]/80 border-slate-800 hover:border-[#3B6098]/30":"bg-white border-slate-200 hover:border-[#5E82BC]/50 shadow-sm"}`,children:[l&&e.jsx("span",{className:`inline-block text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded mb-2 ${r?"bg-slate-800 text-slate-400":"bg-slate-100 text-slate-500"}`,children:l}),e.jsx("div",{className:`text-[11px] font-semibold mb-1 truncate ${r?"text-slate-400":"text-slate-500"}`,children:t}),e.jsx("div",{className:`text-base font-black tracking-tight mb-1 ${r?"text-white":"text-slate-900"}`,children:J(a,s)}),e.jsx("div",{className:`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${d?r?"bg-[#060608]/60 text-[#5E82BC]":"bg-[#EAF0F8] text-[#243D63]":r?"bg-red-950/60 text-red-400":"bg-red-50 text-red-600"}`,children:u})]})}function C({isDarkMode:t}){return e.jsxs("div",{className:`flex-shrink-0 min-w-[130px] rounded-2xl p-4 border animate-pulse ${t?"bg-[#141416]/80 border-slate-800":"bg-white border-slate-200"}`,children:[e.jsx("div",{className:`h-2 w-12 rounded mb-3 ${t?"bg-slate-800":"bg-slate-200"}`}),e.jsx("div",{className:`h-3 w-20 rounded mb-2 ${t?"bg-slate-800":"bg-slate-200"}`}),e.jsx("div",{className:`h-5 w-24 rounded mb-2 ${t?"bg-slate-800":"bg-slate-200"}`}),e.jsx("div",{className:`h-3 w-16 rounded-full ${t?"bg-slate-800":"bg-slate-200"}`})]})}const K=["BTC-USD","ETH-USD","BNB-USD","SOL-USD"],Z=()=>{const{isDarkMode:t}=S(),[a,n]=m.useState([]),[s,r]=m.useState([]),[l,d]=m.useState(!0),[o,u]=m.useState(null),[x,f]=m.useState(!1),i=m.useCallback(async()=>{try{const[c,w]=await Promise.all([_(),G(K)]);n(c),r(w),u(new Date),f(!1)}catch{f(!0)}finally{d(!1)}},[]);m.useEffect(()=>{i();const c=setInterval(i,300*1e3);return()=>clearInterval(c)},[i]);const h=o?o.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}):null;return e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-1.5 h-4 bg-[#3B6098] rounded-full inline-block"}),e.jsx("span",{className:`text-xs font-bold uppercase tracking-wider ${t?"text-slate-400":"text-slate-500"}`,children:"Live Market Data"}),!l&&e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#3B6098] animate-pulse inline-block"}),e.jsx("span",{className:`text-[10px] ${t?"text-slate-500":"text-slate-400"}`,children:"LIVE"})]})]}),h&&e.jsxs("button",{onClick:i,className:`text-[10px] px-2 py-1 rounded-lg border transition-colors ${t?"border-slate-700 text-slate-500 hover:text-[#5E82BC] hover:border-[#2C4A78]":"border-slate-200 text-slate-400 hover:text-[#2C4A78] hover:border-[#5E82BC]"}`,children:["↻ Updated ",h]})]}),x&&!l&&e.jsx("p",{className:`text-xs text-center py-3 ${t?"text-slate-500":"text-slate-400"}`,children:"⚠ Could not load live data. Check your connection."}),(l||a.length>0)&&e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:`text-[10px] font-bold uppercase tracking-widest mb-2 ${t?"text-slate-600":"text-slate-400"}`,children:"Indices"}),e.jsx("div",{className:"flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide",children:l?[1,2,3,4].map(c=>e.jsx(C,{isDarkMode:t},c)):a.map(c=>e.jsx("div",{className:"snap-start",children:e.jsx(N,{name:c.shortName,price:c.price,changePercent:c.changePercent,currency:c.currency,isDarkMode:t,badge:c.currency==="INR"?"NSE":"NYSE"})},c.symbol))})]}),(l||s.length>0)&&e.jsxs("div",{children:[e.jsx("p",{className:`text-[10px] font-bold uppercase tracking-widest mb-2 ${t?"text-slate-600":"text-slate-400"}`,children:"Crypto"}),e.jsx("div",{className:"flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide",children:l?[1,2,3,4].map(c=>e.jsx(C,{isDarkMode:t},c)):s.map(c=>e.jsx("div",{className:"snap-start",children:e.jsx(N,{name:c.shortName,price:c.price,changePercent:c.changePercent,currency:c.currency,isDarkMode:t,badge:"Crypto"})},c.symbol))})]}),e.jsx("p",{className:`text-[9px] mt-3 text-center ${t?"text-slate-700":"text-slate-300"}`,children:"Prices from CoinGecko & Yahoo Finance · Indicative only · Not investment advice"})]})},X=[{id:"all",label:"All Questions",emoji:"💡"},{id:"why",label:"Why Invest",emoji:"🌱"},{id:"where",label:"Where to Invest",emoji:"📍"},{id:"how",label:"How to Invest",emoji:"🚀"},{id:"compare",label:"SIP vs Others",emoji:"⚖️"},{id:"tools",label:"Our Calculators",emoji:"🧮"}],P=[{category:"why",q:"Why should I start investing?",a:`Investing is the most powerful way to beat inflation and build long-term wealth. Money sitting idle in a savings account typically earns 3–4% p.a. — but inflation runs at 5–6%, meaning your money is silently losing purchasing power every year.

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

Switch between modes using the **🇮🇳/🇺🇸 toggle** in the calculator header. Your inputs and all results update instantly.`}];function ee({faq:t,index:a,isOpen:n,onToggle:s}){return e.jsxs("div",{className:`border rounded-2xl overflow-hidden transition-all duration-300 ${n?"border-[#5E82BC]/50 bg-[#EAF0F8]/60 dark:border-[#3B6098]/40 dark:bg-[#060608]/10":"border-slate-200 bg-white hover:border-slate-300 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:hover:border-slate-700"}`,children:[e.jsxs("button",{id:`faq-btn-${a}`,"aria-expanded":n,"aria-controls":`faq-panel-${a}`,onClick:()=>s(a),className:"w-full flex items-start justify-between gap-4 p-5 text-left cursor-pointer bg-transparent",children:[e.jsx("span",{className:`text-sm sm:text-base font-semibold leading-snug transition-colors ${n?"text-[#3B6098]":"text-slate-800 dark:text-slate-100"}`,children:t.q}),e.jsx("span",{className:`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${n?"bg-[#3B6098] text-white rotate-45":"bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"}`,children:"+"})]}),e.jsx("div",{id:`faq-panel-${a}`,role:"region","aria-labelledby":`faq-btn-${a}`,className:`transition-all duration-300 ease-in-out overflow-hidden ${n?"max-h-[2000px] opacity-100":"max-h-0 opacity-0"}`,children:e.jsx("div",{className:"px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700",children:e.jsx("div",{className:"mt-4 text-sm leading-relaxed whitespace-pre-line space-y-2 text-slate-600 dark:text-slate-300",children:t.a.split(`
`).map((r,l)=>{if(!r.trim())return e.jsx("br",{},l);const d=r.split(/\*\*(.*?)\*\*/g);return e.jsx("p",{className:"leading-relaxed",children:d.map((o,u)=>u%2===1?e.jsx("strong",{className:"text-[#243D63] dark:text-[#5E82BC] font-semibold",children:o},u):o)},l)})})})})]})}const te=()=>{const{isDarkMode:t}=S(),[a,n]=m.useState(null),[s,r]=m.useState("all"),l=o=>{n(u=>u===o?null:o)},d=s==="all"?P:P.filter(o=>o.category===s);return e.jsx("section",{"aria-label":"Frequently Asked Questions",className:`py-16 px-4 transition-colors duration-200 ${t?"bg-[#060608]":"bg-[#F1F0EC]"}`,children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-10",children:[e.jsxs("span",{className:`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border ${t?"bg-[#060608]/40 border-[#1D3251] text-[#5E82BC]":"bg-[#EAF0F8] border-[#C3D3E8] text-[#243D63]"}`,children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#3B6098] inline-block"}),"Investor FAQ"]}),e.jsx("h2",{className:"text-3xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white",children:"Everything you need to know"}),e.jsx("p",{className:"text-base max-w-2xl mx-auto text-slate-500 dark:text-slate-400",children:"From your first investment to retirement planning — all your questions answered clearly."})]}),e.jsx("div",{className:"flex flex-wrap gap-2 justify-center mb-8",children:X.map(o=>e.jsxs("button",{onClick:()=>{r(o.id),n(null)},className:`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${s===o.id?"bg-[#3B6098] text-white border-[#3B6098] shadow-lg shadow-[#3B6098]/20":t?"bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200":"bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"}`,children:[e.jsx("span",{children:o.emoji}),e.jsx("span",{children:o.label})]},o.id))}),e.jsxs("p",{className:`text-center text-xs mb-6 ${t?"text-slate-600":"text-slate-400"}`,children:["Showing ",d.length," question",d.length!==1?"s":""]}),e.jsx("div",{className:"flex flex-col gap-3",children:d.map((o,u)=>e.jsx(ee,{faq:o,index:u,isOpen:a===u,onToggle:l},`${s}-${u}`))}),e.jsxs("div",{className:`mt-12 rounded-2xl p-6 text-center border ${t?"bg-[#060608]/20 border-[#1D3251]/40":"bg-[#EAF0F8] border-[#C3D3E8]"}`,children:[e.jsx("p",{className:`text-base font-semibold mb-1 ${t?"text-[#9DB6D6]":"text-[#1D3251]"}`,children:"Ready to start your investment journey?"}),e.jsx("p",{className:`text-sm mb-4 ${t?"text-slate-400":"text-slate-500"}`,children:"Use our free calculators — no sign-up required."}),e.jsx("div",{className:"flex flex-wrap gap-3 justify-center",children:[{to:"/sip",label:"📈 SIP Calculator"},{to:"/lumpsum",label:"💰 Lumpsum Calculator"},{to:"/swp",label:"🏦 SWP Calculator"},{to:"/goals",label:"🎯 Goal Calculator"}].map(o=>e.jsx(j,{to:o.to,className:`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${t?"bg-slate-800 border-slate-700 text-slate-200 hover:bg-[#2C4A78] hover:border-[#3B6098] hover:text-white":"bg-white border-slate-200 text-slate-700 hover:bg-[#3B6098] hover:border-[#3B6098] hover:text-white shadow-sm"}`,children:o.label},o.to))})]})]})})};function y({as:t="div",delay:a=0,className:n="",style:s,children:r,...l}){const d=m.useRef(null),[o,u]=m.useState(!1);return m.useEffect(()=>{const x=d.current;if(!x)return;if(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||typeof IntersectionObserver>"u"){u(!0);return}const i=new IntersectionObserver(h=>{h.forEach(c=>{c.isIntersecting&&(u(!0),i.unobserve(c.target))})},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return i.observe(x),()=>i.disconnect()},[]),e.jsx(t,{ref:d,className:`reveal ${o?"is-visible":""} ${n}`.trim(),style:{transitionDelay:a?`${a}ms`:void 0,...s},...l,children:r})}const ae=[{Icon:q,label:"Year-by-year charts",desc:"Clear visual projections"},{Icon:$,label:"Tax estimation",desc:"LTCG & STCG built in"},{Icon:U,label:"India & global",desc:"₹ and $ modes"},{Icon:A,label:"Private by design",desc:"Runs in your browser"}],se=()=>{const[t,a]=m.useState(""),[n,s]=m.useState(null),[r,l]=m.useState({name:"",email:"",message:""}),[d,o]=m.useState(null),{isDarkMode:u}=S(),x=async i=>{if(i.preventDefault(),!t)return;s("Saving...");const h=await R(t);s(h?.ok?"Subscribed!":"Failed. Try again"),h?.ok&&a("")},f=async i=>{i.preventDefault();const{name:h,email:c,message:w}=r;if(!h||!c||!w)return;o("Saving...");const I=await W(r);o(I?.ok?"Sent!":"Failed. Try again"),I?.ok&&l({name:"",email:"",message:""})};return e.jsxs("div",{className:"w-full",children:[e.jsx(y,{className:"mx-auto max-w-6xl px-1 pt-2 sm:pt-4",children:e.jsxs("section",{className:"glass-card relative overflow-hidden rounded-3xl px-5 py-12 text-center sm:px-10 sm:py-16",style:{background:u?"linear-gradient(160deg, #141416 0%, #0C0C0E 55%, #060608 100%)":"linear-gradient(160deg, #FCFBF9 0%, #F3F2EE 55%, #ECEBE6 100%)"},children:[e.jsx("span",{className:"brand-glow",style:{top:"-15%",left:"5%",width:320,height:320,background:"rgba(59,96,152,0.28)"}}),e.jsx("span",{className:"brand-glow",style:{bottom:"-20%",right:"0%",width:280,height:280,background:"rgba(76,154,130,0.20)"}}),e.jsxs("div",{className:"relative z-10 mx-auto max-w-3xl",children:[e.jsxs("span",{className:"mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold sm:text-sm",style:{border:"1px solid var(--color-border)",background:"var(--glass-bg)",color:"var(--color-primary)"},children:[e.jsx("span",{className:"inline-block h-1.5 w-1.5 animate-pulse rounded-full",style:{background:"var(--color-secondary)"}}),"Free · No sign-up · Private"]}),e.jsxs("h1",{className:"mb-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl",style:{color:"var(--color-text)"},children:["Plan your money with"," ",e.jsx("span",{className:"bg-clip-text text-transparent",style:{backgroundImage:"linear-gradient(90deg, var(--color-primary), var(--color-secondary))"},children:"confidence"})]}),e.jsx("p",{className:"mx-auto mb-8 max-w-2xl text-base leading-relaxed sm:text-lg",style:{color:"var(--color-text-secondary)"},children:"SIP, Lumpsum, SWP, EMI and Goal planning with real-time projections, inflation adjustments and tax estimates. Built for India, works globally."}),e.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-3",children:[e.jsx(j,{to:"/sip",className:"rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5",style:{background:"var(--color-primary)",boxShadow:"0 10px 24px rgba(59,96,152,0.28)"},children:"Start planning"}),e.jsx(j,{to:"/compare",className:"glass rounded-xl px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5",style:{color:"var(--color-text)"},children:"Compare tools"})]})]})]})}),e.jsx("div",{className:"mx-auto max-w-6xl px-1 py-8 sm:py-10",children:e.jsx("div",{className:"grid grid-cols-2 gap-3 sm:grid-cols-4",children:ae.map((i,h)=>e.jsx(y,{delay:h*70,children:e.jsxs("div",{className:"glass-card h-full rounded-2xl p-4 text-center",children:[e.jsx("div",{className:"mb-2 flex justify-center",style:{color:"var(--color-primary)"},children:e.jsx(i.Icon,{size:26})}),e.jsx("div",{className:"text-sm font-bold",style:{color:"var(--color-text)"},children:i.label}),e.jsx("div",{className:"mt-0.5 text-xs",style:{color:"var(--color-text-secondary)"},children:i.desc})]})},i.label))})}),e.jsx("div",{className:"mx-auto max-w-6xl px-1 pb-6",children:e.jsx(y,{children:e.jsx("div",{className:"glass-card rounded-2xl p-4 sm:p-5",children:e.jsx(Z,{})})})}),e.jsx(y,{className:"mx-auto max-w-6xl px-1",children:e.jsx(te,{})}),e.jsxs("div",{className:"mx-auto max-w-6xl px-1 py-12",children:[e.jsxs(y,{className:"mb-8 text-center",children:[e.jsx("h2",{className:"mb-2 text-2xl font-bold md:text-3xl",style:{color:"var(--color-text)"},children:"Stay connected"}),e.jsx("p",{className:"text-sm md:text-base",style:{color:"var(--color-text-secondary)"},children:"Get market insights and ask planning questions anytime."})]}),e.jsxs("div",{className:"grid grid-cols-1 items-start gap-6 md:grid-cols-2",children:[e.jsx(y,{children:e.jsxs("div",{className:"form-box",children:[e.jsx("h3",{children:"Subscribe to our newsletter"}),e.jsxs("form",{onSubmit:x,children:[e.jsx("label",{className:"sr-only",htmlFor:"newsletter-email",children:"Enter your email"}),e.jsx("input",{id:"newsletter-email",type:"email",className:"input",placeholder:"Enter your email",value:t,onChange:i=>a(i.target.value),required:!0}),e.jsx("button",{type:"submit",className:"button-primary",children:"Subscribe"})]}),n&&e.jsx("p",{className:"mt-2 text-xs",style:{color:"var(--color-text-secondary)"},children:n})]})}),e.jsx(y,{delay:80,children:e.jsxs("div",{className:"form-box",children:[e.jsx("h3",{children:"Contact us"}),e.jsxs("form",{onSubmit:f,children:[e.jsx("label",{className:"sr-only",htmlFor:"contact-name",children:"Your name"}),e.jsx("input",{id:"contact-name",type:"text",className:"input",placeholder:"Your name",value:r.name,onChange:i=>l(h=>({...h,name:i.target.value})),required:!0}),e.jsx("label",{className:"sr-only",htmlFor:"contact-email",children:"Your email"}),e.jsx("input",{id:"contact-email",type:"email",className:"input",placeholder:"Your email",value:r.email,onChange:i=>l(h=>({...h,email:i.target.value})),required:!0}),e.jsx("label",{className:"sr-only",htmlFor:"contact-message",children:"Message"}),e.jsx("textarea",{id:"contact-message",className:"input",placeholder:"Message",rows:"4",value:r.message,onChange:i=>l(h=>({...h,message:i.target.value})),required:!0}),e.jsx("button",{className:"button-primary",children:"Send"})]}),d&&e.jsx("p",{className:"mt-2 text-xs",style:{color:"var(--color-text-secondary)"},children:d})]})})]})]})]})},ye=Object.freeze(Object.defineProperty({__proto__:null,default:se},Symbol.toStringTag,{value:"Module"}));export{ye as H,de as I,oe as T,he as a,me as b,pe as c,le as d,ie as e,ce as f,ue as g,ge as h,xe as i,S as u};
