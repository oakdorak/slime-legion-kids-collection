## 2024-03-24 - Accessibility for Custom Interactive Elements
**Learning:** Custom `div`-based interactive elements (like splash screen sigils and dynamic game buttons) lack inherent accessibility features. They require manual addition of ARIA attributes (`role`, `aria-label`, `tabindex`) and keyboard event handlers (`keydown` for Enter/Space) to be usable by screen readers and keyboard users.
**Action:** When encountering custom interactive elements, always ensure they have `role="button"`, `tabindex="0"`, a descriptive `aria-label`, and both click and keyboard event handlers.
