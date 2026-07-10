## 2025-05-18 - Accessibility on Custom Interactive Elements
**Learning:** Custom `div`-based interactive elements (like the grid quadrants in Focus Orbit) are not inherently accessible and lack keyboard focusability and interaction logic.
**Action:** When using non-semantic elements for interaction, manually add `role="button"`, `tabindex="0"`, descriptive `aria-label`s, `:focus-visible` styling, and `keydown` event listeners for `Enter` and `Space` to ensure screen reader support and keyboard accessibility.
