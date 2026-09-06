## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2026-09-06 - XSS vulnerability via innerHTML string interpolation

**Vulnerability:** The `el-avion-azul/app.js` file used `innerHTML` with string interpolation to render dynamic text based on user interaction: `promptText.innerHTML = \`¡Pintaste el avión de ${colorNames[color]}! ...\``.
**Learning:** Constructing DOM structures dynamically by concatenating variables into strings and assigning them to `innerHTML` is a significant risk for DOM-based XSS. While the `colorNames` object currently acts as an allowlist, relying on this constraint rather than using secure APIs constitutes a fragile security posture.
**Prevention:** Strictly enforce the use of `textContent` for inserting textual content and explicit DOM creation APIs (`document.createElement`) to build structured elements containing dynamic data, completely eliminating the use of string interpolation for DOM rendering.
