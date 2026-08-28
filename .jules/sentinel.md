## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## 2024-08-06 - XSS vulnerability via innerHTML and template literals
**Vulnerability:** The `el-avion-azul/app.js` file used `innerHTML` with template literals (e.g. `innerHTML = \`...\${var}...\``) to dynamically construct UI elements. This introduces a DOM-based XSS risk if the variables are untrusted or altered later.
**Learning:** Even if data seems static initially, string interpolation with `innerHTML` is a latent vulnerability. Always use secure methods.
**Prevention:** Avoid `innerHTML`. Build DOM trees programmatically using `document.createElement`, `textContent`, and `appendChild`.
