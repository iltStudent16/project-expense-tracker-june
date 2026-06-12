import './style.css'
import { appTemplate } from './dom/template'
import {
  clearError,
  renderAppState,
  renderCategoryFilter,
  renderError,
  renderFilters,
  renderTransactions,
} from './dom/render'
import { applyFilters, applySort } from './data/selectors'
import {
  exportTransactions,
  importTransactions,
  loadTransactions,
  saveTransactions,
} from './data/storage'
import type {
  AppState,
  FieldValueMap,
  FilterState,
  SortDirection,
  SortKey,
  SortState,
  Transaction,
  TransactionType,
  ValidationErrors,
} from './types/transaction'
import { createUndoStack } from './utils/undo'

const appElement = document.querySelector<HTMLDivElement>('#app')

if (!appElement) {
  throw new Error('App container not found.')
}

appElement.innerHTML = appTemplate()

const form = document.querySelector<HTMLFormElement>('#transactionForm')
const formErrors = document.querySelector<HTMLDivElement>('#formErrors')
const stats = document.querySelector<HTMLDivElement>('#stats')
const chart = document.querySelector<HTMLDivElement>('#chart')
const transactionList = document.querySelector<HTMLUListElement>('#transactionList')
const errorBanner = document.querySelector<HTMLDivElement>('#errorBanner')
const categoryFilter = document.querySelector<HTMLSelectElement>('#categoryFilter')
const startDateFilter = document.querySelector<HTMLInputElement>('#startDateFilter')
const endDateFilter = document.querySelector<HTMLInputElement>('#endDateFilter')
const sortKey = document.querySelector<HTMLSelectElement>('#sortKey')
const sortDirection = document.querySelector<HTMLSelectElement>('#sortDirection')
const exportBtn = document.querySelector<HTMLButtonElement>('#exportBtn')
const importInput = document.querySelector<HTMLInputElement>('#importInput')
const undoBtn = document.querySelector<HTMLButtonElement>('#undoBtn')
const newBtn = document.querySelector<HTMLButtonElement>('#newBtn')
const themeBtn = document.querySelector<HTMLButtonElement>('#themeBtn')

if (
  !form ||
  !formErrors ||
  !stats ||
  !chart ||
  !transactionList ||
  !errorBanner ||
  !categoryFilter ||
  !startDateFilter ||
  !endDateFilter ||
  !sortKey ||
  !sortDirection ||
  !exportBtn ||
  !importInput ||
  !undoBtn ||
  !newBtn ||
  !themeBtn
) {
  throw new Error('Required DOM elements are missing.')
}

const emptyValidationErrors = (): ValidationErrors<FieldValueMap> => ({
  type: [],
  amount: [],
  category: [],
  date: [],
  notes: [],
})

const defaultFilters: FilterState = {
  category: '',
  startDate: '',
  endDate: '',
}

const defaultSort: SortState = {
  key: 'date',
  direction: 'desc',
}

const loaded = loadTransactions()

const initialTransactions = loaded.ok ? loaded.value : []
if (!loaded.ok) {
  renderError(errorBanner, loaded.error)
}

let state: AppState = {
  transactions: initialTransactions,
  filters: { ...defaultFilters },
  sort: { ...defaultSort },
}

const undoStack = createUndoStack<AppState>(structuredClone(state))

const persist = (): void => {
  const result = saveTransactions(state.transactions)
  if (!result.ok) {
    renderError(errorBanner, result.error)
  }
}

const getVisibleTransactions = (): Transaction[] => {
  const filtered = applyFilters(state.transactions, state.filters)
  return applySort(filtered, state.sort)
}

const render = (): void => {
  clearError(errorBanner)

  renderAppState(state, {
    stats,
    chart,
    transactionList,
  })

  renderCategoryFilter(categoryFilter, state.transactions, state.filters.category)
  renderFilters(state.filters, state.sort, {
    start: startDateFilter,
    end: endDateFilter,
    sortKey,
    sortDirection,
  })

  const visible = getVisibleTransactions()
  renderTransactions(transactionList, visible)
}

const validateForm = (values: FieldValueMap): ValidationErrors<FieldValueMap> => {
  const errors = emptyValidationErrors()

  if (values.type !== 'income' && values.type !== 'expense') {
    errors.type.push('Transaction type is invalid.')
  }

  const amount = Number(values.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount.push('Amount must be greater than 0.')
  }

  if (!values.category.trim()) {
    errors.category.push('Category is required.')
  }

  if (!values.date) {
    errors.date.push('Date is required.')
  }

  return errors
}

const showFormErrors = (errors: ValidationErrors<FieldValueMap>): boolean => {
  const messages = Object.values(errors).flat()
  formErrors.innerHTML = messages.map((message) => `<p>${message}</p>`).join('')
  return messages.length > 0
}

const toTransaction = (values: FieldValueMap): Transaction => {
  const base = {
    id: crypto.randomUUID(),
    amount: Number(values.amount),
    category: values.category.trim(),
    date: values.date,
    notes: values.notes.trim() || undefined,
  }

  if (values.type === 'income') {
    return { ...base, type: 'income' }
  }

  return { ...base, type: 'expense' }
}

const commitState = (nextState: AppState): void => {
  state = nextState
  undoStack.push(structuredClone(state))
  persist()
  render()
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const data = new FormData(form)
  const values: FieldValueMap = {
    type: (data.get('type') as TransactionType) ?? 'expense',
    amount: String(data.get('amount') ?? ''),
    category: String(data.get('category') ?? ''),
    date: String(data.get('date') ?? ''),
    notes: String(data.get('notes') ?? ''),
  }

  const errors = validateForm(values)
  if (showFormErrors(errors)) {
    return
  }

  const transaction = toTransaction(values)
  commitState({
    ...state,
    transactions: [transaction, ...state.transactions],
  })

  form.reset()
  formErrors.textContent = ''
})

transactionList.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) {
    return
  }

  const action = target.dataset.action
  if (action !== 'delete') {
    return
  }

  const id = target.dataset.id
  if (!id) {
    return
  }

  commitState({
    ...state,
    transactions: state.transactions.filter((transaction) => transaction.id !== id),
  })
})

categoryFilter.addEventListener('change', () => {
  state.filters.category = categoryFilter.value
  render()
})

startDateFilter.addEventListener('change', () => {
  state.filters.startDate = startDateFilter.value
  render()
})

endDateFilter.addEventListener('change', () => {
  state.filters.endDate = endDateFilter.value
  render()
})

sortKey.addEventListener('change', () => {
  state.sort.key = sortKey.value as SortKey
  render()
})

sortDirection.addEventListener('change', () => {
  state.sort.direction = sortDirection.value as SortDirection
  render()
})

exportBtn.addEventListener('click', async () => {
  const result = await exportTransactions(state.transactions)
  if (!result.ok) {
    renderError(errorBanner, result.error)
  }
})

importInput.addEventListener('change', async () => {
  const file = importInput.files?.item(0)
  if (!file) {
    return
  }

  const result = await importTransactions(file)
  importInput.value = ''

  if (!result.ok) {
    renderError(errorBanner, result.error)
    return
  }

  commitState({
    ...state,
    transactions: result.value,
  })
})

const handleUndo = (): void => {
  const previous = undoStack.undo()
  if (!previous) {
    return
  }

  state = previous
  persist()
  render()
}

undoBtn.addEventListener('click', handleUndo)
newBtn.addEventListener('click', () => {
  form.reset()
  const firstField = form.querySelector<HTMLInputElement>('input[name="amount"]')
  firstField?.focus()
})

themeBtn.addEventListener('click', () => {
  const root = document.documentElement
  root.classList.toggle('dark')
})

document.addEventListener('keydown', (event) => {
  const isCtrl = event.ctrlKey || event.metaKey
  if (!isCtrl) {
    return
  }

  if (event.key.toLowerCase() === 'z') {
    event.preventDefault()
    handleUndo()
    return
  }

  if (event.key.toLowerCase() === 'n') {
    event.preventDefault()
    form.reset()
    const firstField = form.querySelector<HTMLInputElement>('input[name="amount"]')
    firstField?.focus()
  }
})

render()
