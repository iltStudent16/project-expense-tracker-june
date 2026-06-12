export interface UndoStack<T> {
  push: (state: T) => void
  undo: () => T | null
  clear: () => void
  size: () => number
}

export const createUndoStack = <T>(initial: T): UndoStack<T> => {
  const stack: T[] = [initial]

  return {
    push: (state: T) => {
      stack.push(state)
    },
    undo: () => {
      if (stack.length <= 1) {
        return null
      }

      stack.pop()
      const previous = stack[stack.length - 1]
      return previous ?? null
    },
    clear: () => {
      stack.length = 0
      stack.push(initial)
    },
    size: () => stack.length,
  }
}
