## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## 2026-08-22 - XSS vulnerability via innerHTML in el-avion-azul
**Vulnerability:** The `el-avion-azul/app.js` file used `innerHTML` to dynamically inject color names into a DOM element. This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even when interpolating seemingly safe variables, using `innerHTML` for DOM element construction is an insecure pattern that introduces risk.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM.
