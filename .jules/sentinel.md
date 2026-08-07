## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## 2024-08-07 - XSS vulnerability via innerHTML in Routine Builder
**Vulnerability:** The `mini-zanahoria/app.js` file used `innerHTML` to dynamically inject card emoji symbols and text parts into DOM elements (`card.innerHTML = ...`). This is a potential DOM-based XSS vulnerability if the injected variables are manipulated.
**Learning:** Using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, even if data sources (like the `ROUTINE_DATA` array) seem static at the time of authoring, as they may later be modified or loaded dynamically.
**Prevention:** Always prefer `document.createElement()` combined with `textContent` or `appendChild()` instead of `innerHTML` when dynamically constructing UI components.
