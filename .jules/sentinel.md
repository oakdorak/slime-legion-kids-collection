## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
## $(date +%Y-%m-%d) - DOM-based XSS via innerHTML in el-avion-azul
**Vulnerability:** The el-avion-azul mini-game used innerHTML with string interpolation (e.g., `promptText.innerHTML = \`...${colorNames[color]}...\``) to update the UI prompt, which is a potential DOM-based XSS vulnerability.
**Learning:** Even when the interpolated data comes from seemingly safe local variables, using innerHTML with variables is a latent XSS risk and an insecure pattern. It's safer to always use textContent and document.createElement.
**Prevention:** Use document.createElement and appendChild for constructing elements dynamically, and textContent to safely insert user-controlled or dynamic strings instead of innerHTML.
