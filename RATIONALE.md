# Expense Tracker Rationale

This project uses strict TypeScript to prevent common runtime mistakes while keeping a small, framework-free codebase. Type annotations and discriminated unions for `Transaction` (`income | expense`) helped catch issues early when branching logic for totals, list rendering, and display formatting. During implementation, strict mode surfaced unused code and type mismatches quickly, which made refactoring safer and kept the final build clean.

I organized the app by responsibility to keep each module focused: `src/types` defines shared contracts like `Transaction` and `Result<T,E>`, `src/data` holds selectors and persistence helpers, `src/dom` contains template/render functions, and `src/utils` contains cross-cutting helpers such as formatting and the generic `UndoStack<T>`. This structure keeps business logic independent from DOM wiring and makes each feature easier to test mentally and maintain.

Vite’s dev server improved the workflow significantly through fast startup and instant HMR feedback. Iterating on UI behavior (filters, sorting, keyboard shortcuts, and chart rendering) was much faster because changes appeared immediately without manual rebuild steps. Then `npm run build` gave a strict TypeScript + bundling gate to confirm production readiness.

The most useful JavaScript/TypeScript patterns were: event delegation for transaction delete actions, closure-based undo history for reversible state changes, and composable selectors (`applyFilters` + `applySort`) for predictable data flow. I also used `Object.entries` for chart rows, plus `Object.keys`/`Object.values` to compute category metadata, and a default+rest parameter helper (`sumWithAdjustments`) to demonstrate modern function signatures clearly in real app logic.
