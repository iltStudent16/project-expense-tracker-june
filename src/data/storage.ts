import type { Transaction } from '../types/transaction'
import type { Result } from '../types/result'
import { err, ok } from '../types/result'

const STORAGE_KEY = 'expense-tracker-transactions'

export const loadTransactions = (): Result<Transaction[], string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return ok([])
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return err('Stored data is not a valid transaction array.')
    }

    return ok(parsed as Transaction[])
  } catch {
    return err('Failed to load transactions from localStorage.')
  }
}

export const saveTransactions = (
  transactions: Transaction[],
): Result<null, string> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    return ok(null)
  } catch {
    return err('Failed to save transactions to localStorage.')
  }
}

export const exportTransactions = async (
  transactions: Transaction[],
): Promise<Result<null, string>> => {
  try {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `transactions-${new Date().toISOString().slice(0, 10)}.json`
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)

    return ok(null)
  } catch {
    return err('Failed to export JSON file.')
  }
}

const readFileText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Invalid file contents.'))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })

export const importTransactions = async (
  file: File,
): Promise<Result<Transaction[], string>> => {
  try {
    const text = await readFileText(file)
    const parsed: unknown = JSON.parse(text)

    if (!Array.isArray(parsed)) {
      return err('Imported JSON must be an array of transactions.')
    }

    return ok(parsed as Transaction[])
  } catch {
    return err('Failed to import JSON file.')
  }
}
