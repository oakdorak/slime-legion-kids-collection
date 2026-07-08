## 2024-05-18 - Splash Screen Accessibility
**Learning:** Custom `div`-based interactive elements (like splash screen emojis) require manual addition of `role="button"`, `tabindex="0"`, `aria-label`, and keyboard event handlers (`onkeydown`) to ensure they can be focused and activated by keyboard and screen reader users.
**Action:** Always verify that elements acting as buttons have these necessary ARIA attributes and keyboard event handlers.
