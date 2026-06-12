import {
  calculateTotals,
  breakdownMeta,
  categoryBreakdown,
  sumWithAdjustments,
  uniqueCategories,
} from '../data/selectors'
import { formatCurrency, formatDate } from '../utils/format'
import type {
  AppState,
  DashboardTotals,
  FilterState,
  SortState,
  Transaction,
} from '../types/transaction'

const renderStats = (container: HTMLElement, totals: DashboardTotals): void => {
  const balance = sumWithAdjustments(0, totals.income, -totals.expenses)

  container.innerHTML = `
    <article class="stat-card">
      <h3>Balance</h3>
      <p>${formatCurrency(balance)}</p>
    </article>
    <article class="stat-card">
      <h3>Total Income</h3>
      <p class="income">${formatCurrency(totals.income)}</p>
    </article>
    <article class="stat-card">
      <h3>Total Expenses</h3>
      <p class="expense">${formatCurrency(totals.expenses)}</p>
    </article>
  `
}

const renderChart = (container: HTMLElement, transactions: Transaction[]): void => {
  const breakdown = categoryBreakdown(transactions)
  const entries = Object.entries(breakdown)
  const meta = breakdownMeta(breakdown)

  if (entries.length === 0) {
    container.innerHTML = '<p class="muted">No data yet.</p>'
    return
  }

  const max = Math.max(...entries.map(([, value]) => value), 1)

  container.innerHTML = `
    <p class="muted">${meta.categoryCount} categories • ${formatCurrency(meta.totalAmount)} tracked</p>
  ` + entries
    .sort((left, right) => right[1] - left[1])
    .map(([category, value]) => {
      const percent = Math.round((value / max) * 100)
      return `
      <div class="bar-row">
        <span class="label">${category}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${percent}%"></div>
        </div>
        <span class="value">${formatCurrency(value)}</span>
      </div>`
    })
    .join('')
}

export const renderCategoryFilter = (
  select: HTMLSelectElement,
  transactions: Transaction[],
  activeValue: string,
): void => {
  const categories = uniqueCategories(transactions)
  const options = ['<option value="">All categories</option>']

  options.push(
    ...categories.map((category) => {
      const selected = category === activeValue ? 'selected' : ''
      return `<option value="${category}" ${selected}>${category}</option>`
    }),
  )

  select.innerHTML = options.join('')
}

const transactionItemTemplate = (transaction: Transaction): string => {
  const sign = transaction.type === 'income' ? '+' : '-'

  return `
    <li class="tx-item" data-id="${transaction.id}">
      <div>
        <strong>${transaction.category}</strong>
        <p class="muted">${formatDate(transaction.date)}${
          transaction.notes ? ` • ${transaction.notes}` : ''
        }</p>
      </div>
      <div class="tx-meta">
        <span class="amount ${transaction.type}">${sign}${formatCurrency(transaction.amount)}</span>
        <button class="btn danger" type="button" data-action="delete" data-id="${transaction.id}">Delete</button>
      </div>
    </li>
  `
}

export const renderTransactions = (
  list: HTMLElement,
  transactions: Transaction[],
): void => {
  if (transactions.length === 0) {
    list.innerHTML = '<li class="empty">No transactions match current filters.</li>'
    return
  }

  list.innerHTML = transactions.map(transactionItemTemplate).join('')
}

export const renderFilters = (
  filters: FilterState,
  sort: SortState,
  elements: {
    start: HTMLInputElement
    end: HTMLInputElement
    sortKey: HTMLSelectElement
    sortDirection: HTMLSelectElement
  },
): void => {
  elements.start.value = filters.startDate
  elements.end.value = filters.endDate
  elements.sortKey.value = sort.key
  elements.sortDirection.value = sort.direction
}

export const renderAppState = (
  state: AppState,
  elements: {
    stats: HTMLElement
    chart: HTMLElement
    transactionList: HTMLElement
  },
): void => {
  const totals = calculateTotals(state.transactions)
  renderStats(elements.stats, totals)
  renderChart(elements.chart, state.transactions)
  renderTransactions(elements.transactionList, state.transactions)
}

export const renderError = (errorBanner: HTMLElement, message: string): void => {
  errorBanner.textContent = message
}

export const clearError = (errorBanner: HTMLElement): void => {
  errorBanner.textContent = ''
}
