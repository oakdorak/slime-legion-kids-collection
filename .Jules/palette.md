## 2024-05-18 - App-specific icon buttons lack ARIA
**Learning:** The application's custom CSS `::after` pseudo-elements for icon-only buttons and `div`-based splash screens consistently lack native semantic roles, ARIA labels, and keyboard event handlers, making them completely inaccessible to screen readers in this specific repository.
**Action:** Always manually apply `role="button"`, `tabindex="0"`, localized `aria-label`s, and `onkeydown` handlers to these specific custom elements in the NeuroDivertidos codebase.
