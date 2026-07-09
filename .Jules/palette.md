## 2024-05-30 - Interactive Div Accessibility
**Learning:** The application heavily relies on custom `div`-based interactive elements (especially for splash screens and emojis) that act as buttons. These elements lack native button accessibility semantics and keyboard interaction support.
**Action:** Always add `role="button"`, `tabindex="0"`, `aria-label`, and `onkeydown="if(event.key==='Enter'||event.key===' ') handler()"` to `div`s that function as interactive buttons to ensure they are accessible via keyboard and screen readers.
