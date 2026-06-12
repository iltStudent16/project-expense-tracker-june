# 💸 Expense Tracker SPA (Vite + TypeScript)

A modern, responsive **single-page expense tracker** built with **Vanilla TypeScript** and **Vite** (no frameworks).  
Track income/expenses, filter and sort transactions, visualize spending by category, import/export JSON, and undo changes with keyboard shortcuts.

---

## ✨ Highlights

- ✅ Add transactions: **income or expense** with amount, category, date, and optional notes
- ✅ Dashboard cards: **balance, total income, total expenses**
- ✅ Category breakdown chart using **pure DOM/CSS bars** (no chart library)
- ✅ Transaction list with:
  - sorting by **date** or **amount**
  - filtering by **category** and **date range**
  - inline delete via **event delegation**
- ✅ Persistence with **localStorage**
- ✅ **Import/Export JSON** using File API + async/await
- ✅ Generic, closure-based **UndoStack<T>** with `Ctrl+Z`
- ✅ Keyboard shortcut `Ctrl+N` for quick new transaction entry
- ✅ Responsive layout + manual dark mode toggle
- ✅ Strict TypeScript (`strict: true`) with strong typing patterns

---

## 🧠 TypeScript Patterns Used

- **Discriminated unions** for transaction types (`income | expense`)
- **Generic** undo stack (`UndoStack<T>`) for reversible state history
- **Mapped types** for validation error shape
- **Result<T, E>** error boundary style for storage/file operations
- Explicit use of `Object.entries`, `Object.keys`, and `Object.values`
- Default + rest parameters in utility logic

---

## 🏗️ Tech Stack

- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- Vanilla DOM APIs (no React/Vue/Svelte)
- File API + localStorage

---

## 📁 Project Structure

```text
src/
  data/
    selectors.ts      # Filtering/sorting/totals/breakdown selectors
    storage.ts        # localStorage + JSON import/export
  dom/
    template.ts       # App shell markup
    render.ts         # UI render functions (stats/list/chart)
  types/
    transaction.ts    # Domain models + unions + mapped types
    result.ts         # Result<T,E>
  utils/
    format.ts         # currency/date helpers
    undo.ts           # generic UndoStack<T>
  main.ts             # app controller + event wiring
  style.css           # responsive/dark-mode styles
```

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

- `Ctrl + Z` → Undo latest state change
- `Ctrl + N` → Focus/start a new transaction entry

---

## 📦 Data Import/Export

- **Export JSON** creates a downloadable snapshot of all transactions
- **Import JSON** replaces current transaction state with file contents
- File operations use async/await + typed `Result<T,E>` error handling

---

## 🧪 Quality Checks

- TypeScript strict mode enabled in `tsconfig.json`
- Build pipeline: `tsc && vite build`
- No framework dependencies (Vanilla template)

---

## 📚 Assessment Alignment

This project satisfies the core rubric items, including:

- Vite scaffold with Vanilla + TypeScript
- Strict TS config and modular ES import/export architecture
- Type-safe state and validation patterns
- Functional dashboard and interactive transaction management
- Persistent storage, async file handling, and undo behavior
- Written rationale document: see `RATIONALE.md`

---

## 🔗 Repository

Public repo: **https://github.com/iltStudent16/project-expense-tracker-june**

---

## 🙌 Author Notes

If you use this as a portfolio/assessment submission, consider adding:

- a short GIF demo of add/filter/export/undo flow
- 2–3 screenshots (light/dark mode)
- deployment URL (GitHub Pages / Netlify / Vercel)
