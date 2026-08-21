## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## 2024-08-07 - XSS vulnerability via innerHTML in el-avion-azul
**Vulnerability:** The `el-avion-azul/app.js` file used `innerHTML` to construct a message, interpolating `colorNames[color]` directly into the string.
**Learning:** Using `innerHTML` with variable interpolation from objects, even if seemingly hardcoded locally, represents a potential DOM-based XSS vulnerability if the object data later comes from an untrusted source.
**Prevention:** Always use safe DOM APIs like `textContent` and `document.createElement()` for dynamic content insertion, especially when variables are involved.
