export const appTemplate = (): string => `
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
`
