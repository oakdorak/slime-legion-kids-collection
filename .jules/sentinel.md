## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2026-08-09 - DOM-based XSS via innerHTML in Mini Zanahoria
**Vulnerability:** The `mini-zanahoria/app.js` file used `innerHTML` to dynamically construct DOM elements using data from `ROUTINE_DATA`.
**Learning:** This is an insecure pattern identical to the one previously found in the emotion mirror game. Data from arrays or objects should not be injected into the DOM as HTML, as this enables DOM-based XSS if the underlying data is tampered with or replaced dynamically.
**Prevention:** Strictly avoid using `innerHTML` for injecting variables. Always use `document.createElement` along with `textContent` or `appendChild` to handle dynamic text nodes.
