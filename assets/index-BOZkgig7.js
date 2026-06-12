(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=()=>`
  <div class="app-shell">
    <header class="header">
      <h1>Expense Tracker</h1>
      <div class="header-actions">
        <button id="undoBtn" class="btn secondary" type="button" title="Undo (Ctrl+Z)">Undo</button>
        <button id="newBtn" class="btn secondary" type="button" title="New transaction (Ctrl+N)">New</button>
        <button id="themeBtn" class="btn" type="button">Toggle Dark Mode</button>
      </div>
    </header>

    <main class="grid-layout">
      <section class="panel form-panel">
        <h2>Add Transaction</h2>
        <form id="transactionForm" novalidate>
          <div class="form-row two-col">
            <label>
              Type
              <select name="type" required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <label>
              Amount
              <input name="amount" type="number" min="0.01" step="0.01" required />
            </label>
          </div>
          <div class="form-row two-col">
            <label>
              Category
              <input name="category" type="text" required />
            </label>
            <label>
              Date
              <input name="date" type="date" required />
            </label>
          </div>
          <label>
            Notes (optional)
            <textarea name="notes" rows="2"></textarea>
          </label>
          <div id="formErrors" class="errors" role="alert" aria-live="polite"></div>
          <button class="btn" type="submit">Add Transaction</button>
        </form>
      </section>

      <section class="panel dashboard-panel">
        <h2>Dashboard</h2>
        <div class="stats" id="stats"></div>
        <div>
          <h3>Category Breakdown</h3>
          <div id="chart" class="chart"></div>
        </div>
      </section>

      <section class="panel list-panel">
        <div class="list-header">
          <h2>Transactions</h2>
          <div class="actions-inline">
            <button id="exportBtn" class="btn secondary" type="button">Export JSON</button>
            <label class="btn secondary file-label" for="importInput">Import JSON</label>
            <input id="importInput" type="file" accept="application/json" hidden />
          </div>
        </div>

        <div class="filters">
          <label>
            Category
            <select id="categoryFilter"></select>
          </label>
          <label>
            Start date
            <input id="startDateFilter" type="date" />
          </label>
          <label>
            End date
            <input id="endDateFilter" type="date" />
          </label>
          <label>
            Sort by
            <select id="sortKey">
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </label>
          <label>
            Direction
            <select id="sortDirection">
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </label>
        </div>

        <div id="errorBanner" class="errors" role="alert" aria-live="polite"></div>

        <ul id="transactionList" class="tx-list"></ul>
      </section>
    </main>
  </div>
`,t=(e,t)=>{let n=t.category.trim().toLowerCase();return e.filter(e=>{let r=new Date(e.date).getTime(),i=t.startDate?new Date(t.startDate).getTime():-1/0,a=t.endDate?new Date(t.endDate).getTime():1/0;return(!n||e.category.toLowerCase()===n)&&r>=i&&r<=a})},n=(e,t)=>[...e].sort((e,n)=>{let r=t.direction===`asc`?1:-1;return t.key===`amount`?(e.amount-n.amount)*r:(new Date(e.date).getTime()-new Date(n.date).getTime())*r}),r=e=>e.reduce((e,t)=>(t.type===`income`?e.income+=t.amount:e.expenses+=t.amount,e.balance=e.income-e.expenses,e),{balance:0,income:0,expenses:0}),i=(e=0,...t)=>t.reduce((e,t)=>e+t,e),a=e=>e.reduce((e,t)=>{let n=e[t.category]??0;return e[t.category]=n+t.amount,e},{}),o=e=>({categoryCount:Object.keys(e).length,totalAmount:Object.values(e).reduce((e,t)=>e+t,0)}),s=e=>[...new Set(e.map(e=>e.category))].sort(),c=e=>new Intl.NumberFormat(void 0,{style:`currency`,currency:`USD`,maximumFractionDigits:2}).format(e),l=e=>{let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString()},u=(e,t)=>{e.innerHTML=`
    <article class="stat-card">
      <h3>Balance</h3>
      <p>${c(i(0,t.income,-t.expenses))}</p>
    </article>
    <article class="stat-card">
      <h3>Total Income</h3>
      <p class="income">${c(t.income)}</p>
    </article>
    <article class="stat-card">
      <h3>Total Expenses</h3>
      <p class="expense">${c(t.expenses)}</p>
    </article>
  `},d=(e,t)=>{let n=a(t),r=Object.entries(n),i=o(n);if(r.length===0){e.innerHTML=`<p class="muted">No data yet.</p>`;return}let s=Math.max(...r.map(([,e])=>e),1);e.innerHTML=`
    <p class="muted">${i.categoryCount} categories • ${c(i.totalAmount)} tracked</p>
  `+r.sort((e,t)=>t[1]-e[1]).map(([e,t])=>`
      <div class="bar-row">
        <span class="label">${e}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${Math.round(t/s*100)}%"></div>
        </div>
        <span class="value">${c(t)}</span>
      </div>`).join(``)},f=(e,t,n)=>{let r=s(t),i=[`<option value="">All categories</option>`];i.push(...r.map(e=>`<option value="${e}" ${e===n?`selected`:``}>${e}</option>`)),e.innerHTML=i.join(``)},p=e=>{let t=e.type===`income`?`+`:`-`;return`
    <li class="tx-item" data-id="${e.id}">
      <div>
        <strong>${e.category}</strong>
        <p class="muted">${l(e.date)}${e.notes?` • ${e.notes}`:``}</p>
      </div>
      <div class="tx-meta">
        <span class="amount ${e.type}">${t}${c(e.amount)}</span>
        <button class="btn danger" type="button" data-action="delete" data-id="${e.id}">Delete</button>
      </div>
    </li>
  `},m=(e,t)=>{if(t.length===0){e.innerHTML=`<li class="empty">No transactions match current filters.</li>`;return}e.innerHTML=t.map(p).join(``)},h=(e,t,n)=>{n.start.value=e.startDate,n.end.value=e.endDate,n.sortKey.value=t.key,n.sortDirection.value=t.direction},ee=(e,t)=>{let n=r(e.transactions);u(t.stats,n),d(t.chart,e.transactions),m(t.transactionList,e.transactions)},g=(e,t)=>{e.textContent=t},_=e=>{e.textContent=``},v=e=>({ok:!0,value:e}),y=e=>({ok:!1,error:e}),b=`expense-tracker-transactions`,te=()=>{try{let e=localStorage.getItem(b);if(!e)return v([]);let t=JSON.parse(e);return Array.isArray(t)?v(t):y(`Stored data is not a valid transaction array.`)}catch{return y(`Failed to load transactions from localStorage.`)}},ne=e=>{try{return localStorage.setItem(b,JSON.stringify(e)),v(null)}catch{return y(`Failed to save transactions to localStorage.`)}},x=async e=>{try{let t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);return r.href=n,r.download=`transactions-${new Date().toISOString().slice(0,10)}.json`,document.body.append(r),r.click(),r.remove(),URL.revokeObjectURL(n),v(null)}catch{return y(`Failed to export JSON file.`)}},S=e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{if(typeof r.result==`string`){t(r.result);return}n(Error(`Invalid file contents.`))},r.onerror=()=>n(r.error),r.readAsText(e)}),C=async e=>{try{let t=await S(e),n=JSON.parse(t);return Array.isArray(n)?v(n):y(`Imported JSON must be an array of transactions.`)}catch{return y(`Failed to import JSON file.`)}},w=e=>{let t=[e];return{push:e=>{t.push(e)},undo:()=>t.length<=1?null:(t.pop(),t[t.length-1]??null),clear:()=>{t.length=0,t.push(e)},size:()=>t.length}},T=document.querySelector(`#app`);if(!T)throw Error(`App container not found.`);T.innerHTML=e();var E=document.querySelector(`#transactionForm`),D=document.querySelector(`#formErrors`),O=document.querySelector(`#stats`),k=document.querySelector(`#chart`),A=document.querySelector(`#transactionList`),j=document.querySelector(`#errorBanner`),M=document.querySelector(`#categoryFilter`),N=document.querySelector(`#startDateFilter`),P=document.querySelector(`#endDateFilter`),F=document.querySelector(`#sortKey`),I=document.querySelector(`#sortDirection`),L=document.querySelector(`#exportBtn`),R=document.querySelector(`#importInput`),z=document.querySelector(`#undoBtn`),B=document.querySelector(`#newBtn`),V=document.querySelector(`#themeBtn`);if(!E||!D||!O||!k||!A||!j||!M||!N||!P||!F||!I||!L||!R||!z||!B||!V)throw Error(`Required DOM elements are missing.`);var H=()=>({type:[],amount:[],category:[],date:[],notes:[]}),U={category:``,startDate:``,endDate:``},W={key:`date`,direction:`desc`},G=te(),K=G.ok?G.value:[];G.ok||g(j,G.error);var q={transactions:K,filters:{...U},sort:{...W}},J=w(structuredClone(q)),Y=()=>{let e=ne(q.transactions);e.ok||g(j,e.error)},X=()=>n(t(q.transactions,q.filters),q.sort),Z=()=>{_(j),ee(q,{stats:O,chart:k,transactionList:A}),f(M,q.transactions,q.filters.category),h(q.filters,q.sort,{start:N,end:P,sortKey:F,sortDirection:I}),m(A,X())},re=e=>{let t=H();e.type!==`income`&&e.type!==`expense`&&t.type.push(`Transaction type is invalid.`);let n=Number(e.amount);return(!Number.isFinite(n)||n<=0)&&t.amount.push(`Amount must be greater than 0.`),e.category.trim()||t.category.push(`Category is required.`),e.date||t.date.push(`Date is required.`),t},ie=e=>{let t=Object.values(e).flat();return D.innerHTML=t.map(e=>`<p>${e}</p>`).join(``),t.length>0},ae=e=>{let t={id:crypto.randomUUID(),amount:Number(e.amount),category:e.category.trim(),date:e.date,notes:e.notes.trim()||void 0};return e.type===`income`?{...t,type:`income`}:{...t,type:`expense`}},Q=e=>{q=e,J.push(structuredClone(q)),Y(),Z()};E.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(E),n={type:t.get(`type`)??`expense`,amount:String(t.get(`amount`)??``),category:String(t.get(`category`)??``),date:String(t.get(`date`)??``),notes:String(t.get(`notes`)??``)};if(ie(re(n)))return;let r=ae(n);Q({...q,transactions:[r,...q.transactions]}),E.reset(),D.textContent=``}),A.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof HTMLElement)||t.dataset.action!==`delete`)return;let n=t.dataset.id;n&&Q({...q,transactions:q.transactions.filter(e=>e.id!==n)})}),M.addEventListener(`change`,()=>{q.filters.category=M.value,Z()}),N.addEventListener(`change`,()=>{q.filters.startDate=N.value,Z()}),P.addEventListener(`change`,()=>{q.filters.endDate=P.value,Z()}),F.addEventListener(`change`,()=>{q.sort.key=F.value,Z()}),I.addEventListener(`change`,()=>{q.sort.direction=I.value,Z()}),L.addEventListener(`click`,async()=>{let e=await x(q.transactions);e.ok||g(j,e.error)}),R.addEventListener(`change`,async()=>{let e=R.files?.item(0);if(!e)return;let t=await C(e);if(R.value=``,!t.ok){g(j,t.error);return}Q({...q,transactions:t.value})});var $=()=>{let e=J.undo();e&&(q=e,Y(),Z())};z.addEventListener(`click`,$),B.addEventListener(`click`,()=>{E.reset(),E.querySelector(`input[name="amount"]`)?.focus()}),V.addEventListener(`click`,()=>{document.documentElement.classList.toggle(`dark`)}),document.addEventListener(`keydown`,e=>{if(e.ctrlKey||e.metaKey){if(e.key.toLowerCase()===`z`){e.preventDefault(),$();return}e.key.toLowerCase()===`n`&&(e.preventDefault(),E.reset(),E.querySelector(`input[name="amount"]`)?.focus())}}),Z();