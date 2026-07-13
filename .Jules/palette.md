## 2026-07-13 - Improve DOM appending for emotion guess cards
**Learning:** Appending DOM nodes individually inside a loop causes unnecessary layout thrashing, recalculations and reflows which impacts performance.
**Action:** Use a `DocumentFragment` to batch append operations into a single DOM update.
