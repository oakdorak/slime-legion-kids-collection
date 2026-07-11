## 2024-05-18 - Improve keyboard accessibility for icon buttons
**Learning:** Custom interactive elements (like splash screen divs) and icon-only buttons frequently lack ARIA attributes (`role`, `aria-label`, `tabindex`) and keyboard event handlers (`onkeydown`). This breaks accessibility for screen reader and keyboard-only users.
**Action:** Always verify that interactive elements, especially `div`-based ones and icon-only buttons, have appropriate ARIA attributes, keyboard support, and `:focus-visible` styling.
