## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-08-16 - Prevent XSS in dynamic variable DOM interpolation
**Vulnerability:** The `mini-zanahoria/app.js` file constructed DOM elements using `card.innerHTML = ...` with string interpolation of variables like `emojiPart` and `textPart`. This pattern could lead to DOM-based XSS if the underlying data sources (`ROUTINE_DATA`) were ever modified by an attacker or sourced externally.
**Learning:** Using `innerHTML` with template literals and dynamically split strings is a common anti-pattern that creates latent XSS risks, even if the data appears static initially.
**Prevention:** Strictly use safe DOM manipulation methods such as `document.createElement`, `className`, and `textContent` to construct nested elements and assign content. This guarantees that variables are treated safely as text nodes rather than executable HTML.
