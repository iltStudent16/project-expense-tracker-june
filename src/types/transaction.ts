export type TransactionType = 'income' | 'expense'

export interface BaseTransaction {
  id: string
  amount: number
  category: string
  date: string
  notes?: string
}

export interface IncomeTransaction extends BaseTransaction {
  type: 'income'
}

export interface ExpenseTransaction extends BaseTransaction {
  type: 'expense'
}

export type Transaction = IncomeTransaction | ExpenseTransaction

export type SortKey = 'date' | 'amount'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: SortKey
  direction: SortDirection
}

export interface FilterState {
  category: string
  startDate: string
  endDate: string
}

export interface DashboardTotals {
  balance: number
  income: number
  expenses: number
}

export type FieldValueMap = {
  type: TransactionType
  amount: string
  category: string
  date: string
  notes: string
}

export type ValidationErrors<T extends Record<string, unknown>> = {
  [K in keyof T]: string[]
}

export interface AppState {
  transactions: Transaction[]
  filters: FilterState
  sort: SortState
}
