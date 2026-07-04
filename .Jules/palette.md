## 2024-07-04 - Adding ARIA labels to icon-only buttons
**Learning:** Found multiple instances where icon-only buttons (like `#resetBtn` or `#themeBtn`) were using emojis or CSS `::after` elements for visual representation, without any semantic meaning for screen readers. This makes navigation and interaction difficult for assistive tech users.
**Action:** Always add `aria-label` attributes to icon-only buttons (or those relying on emoji/CSS content) to ensure they are accessible. This provides screen readers with context for the buttons.
