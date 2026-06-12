import type {
  DashboardTotals,
  FilterState,
  SortState,
  Transaction,
} from '../types/transaction'

export const applyFilters = (
  transactions: Transaction[],
  filters: FilterState,
): Transaction[] => {
  const categoryFilter = filters.category.trim().toLowerCase()

  return transactions.filter((transaction) => {
    const txDate = new Date(transaction.date).getTime()
    const startDate = filters.startDate
      ? new Date(filters.startDate).getTime()
      : Number.NEGATIVE_INFINITY
    const endDate = filters.endDate
      ? new Date(filters.endDate).getTime()
      : Number.POSITIVE_INFINITY

    const categoryOk =
      !categoryFilter || transaction.category.toLowerCase() === categoryFilter
    const dateOk = txDate >= startDate && txDate <= endDate

    return categoryOk && dateOk
  })
}

export const applySort = (
  transactions: Transaction[],
  sort: SortState,
): Transaction[] => {
  return [...transactions].sort((left, right) => {
    const factor = sort.direction === 'asc' ? 1 : -1

    if (sort.key === 'amount') {
      return (left.amount - right.amount) * factor
    }

    const leftDate = new Date(left.date).getTime()
    const rightDate = new Date(right.date).getTime()
    return (leftDate - rightDate) * factor
  })
}

export const calculateTotals = (transactions: Transaction[]): DashboardTotals => {
  return transactions.reduce<DashboardTotals>(
    (totals, transaction) => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount
      } else {
        totals.expenses += transaction.amount
      }

      totals.balance = totals.income - totals.expenses
      return totals
    },
    { balance: 0, income: 0, expenses: 0 },
  )
}

export const sumWithAdjustments = (
  base = 0,
  ...adjustments: number[]
): number => {
  return adjustments.reduce((total, value) => total + value, base)
}

export const categoryBreakdown = (
  transactions: Transaction[],
): Record<string, number> => {
  return transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const current = accumulator[transaction.category] ?? 0
    accumulator[transaction.category] = current + transaction.amount
    return accumulator
  }, {})
}

export const breakdownMeta = (
  breakdown: Record<string, number>,
): { categoryCount: number; totalAmount: number } => {
  const categoryCount = Object.keys(breakdown).length
  const totalAmount = Object.values(breakdown).reduce(
    (sum, amount) => sum + amount,
    0,
  )

  return { categoryCount, totalAmount }
}

export const uniqueCategories = (transactions: Transaction[]): string[] =>
  [...new Set(transactions.map((transaction) => transaction.category))].sort()
