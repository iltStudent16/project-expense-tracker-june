# Expense Tracker (Vite + TypeScript)

A responsive single-page expense tracker built with Vanilla TypeScript and Vite.
It supports transaction management, dashboard summaries, filtering/sorting, local persistence, JSON import/export, and undo.

Live demo: https://iltstudent16.github.io/project-expense-tracker-june/

## Features

- Add income and expense transactions with amount, category, date, and optional notes
- View total balance, income, and expenses in the dashboard
- See category breakdown in a simple DOM/CSS bar chart
- Sort transactions by date or amount
- Filter transactions by category and date range
- Delete transactions inline (event delegation)
- Persist data in localStorage
- Import and export transactions as JSON
- Undo state changes with keyboard shortcut support
- Toggle dark mode and use a responsive layout

## Technical Notes

- Strict TypeScript configuration (`strict: true`)
- Discriminated unions for transaction modeling
- Generic closure-based undo stack (`UndoStack<T>`)
- Mapped types for form validation errors
- Result type for storage and file operation boundaries (`Result<T, E>`)
- Use of `Object.entries`, `Object.keys`, and `Object.values`
- Default and rest parameters in selector utilities

## Project Structure

```text
src/
  data/
    selectors.ts
    storage.ts
  dom/
    template.ts
    render.ts
  types/
    transaction.ts
    result.ts
  utils/
    format.ts
    undo.ts
  main.ts
  style.css
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Keyboard Shortcuts

- `Ctrl + Z`: undo latest state change
- `Ctrl + N`: reset and focus new transaction entry

## Deployment

- Repository: https://github.com/iltStudent16/project-expense-tracker-june
- GitHub Pages: https://iltstudent16.github.io/project-expense-tracker-june/

## Assessment Notes

- Built from Vite Vanilla + TypeScript scaffold
- Uses ES modules (`import`/`export`) and modular folder organization
- Includes written rationale in `RATIONALE.md`
