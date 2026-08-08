## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## 2024-08-08 - XSS vulnerability via innerHTML in drag-and-drop game
**Vulnerability:** The `mini-zanahoria/app.js` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM cards during the initialization of the routine builder game. This is a potential XSS vulnerability.
**Learning:** Using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, even when injecting seemingly static data sources like routine configurations, as they could be manipulated or dynamically loaded in the future.
**Prevention:** Always prefer `document.createElement()` combined with `textContent` or `appendChild()` for dynamically constructing DOM elements to ensure inputs are safely treated as raw strings rather than executable HTML.
