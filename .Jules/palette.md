## 2026-07-06 - Interactive Elements Accessibility Pattern
**Learning:** Custom div-based interactive elements (like splash screen start buttons) and CSS ::after icon-only buttons across these mini-games consistently lack keyboard support and accessible names.
**Action:** When adding or reviewing interactive elements, ensure we add role="button", tabindex="0", aria-label, and an onkeydown handler to support keyboard navigation.
