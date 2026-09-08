## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## 2025-02-06 - XSS vulnerability via innerHTML string interpolation in game UI
**Vulnerability:** The `el-avion-azul/app.js` file used `innerHTML` to dynamically inject variables via string interpolation (`promptText.innerHTML = \`...${colorNames[color]}...\``) into the DOM. While the data source (`colorNames`) was currently hardcoded, this interpolation pattern creates a latent XSS risk.
**Learning:** Using `innerHTML` with string interpolation for DOM construction is an insecure pattern, even if the data appears static initially. It introduces risk if the data source is ever refactored or becomes dynamic.
**Prevention:** Always use safe DOM manipulation methods like `textContent`, `document.createElement()`, and `appendChild()` instead of `innerHTML` when incorporating variables or dynamic content.
