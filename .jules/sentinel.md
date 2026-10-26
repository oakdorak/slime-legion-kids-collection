## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-08-16 - XSS vulnerability via innerHTML in Agora Library UI

**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject user-provided input (`item.concept` and potentially `result.*`) into the DOM. This introduces a DOM-based Cross-Site Scripting (XSS) vulnerability.
**Learning:** Even if data stems from local state (`State.library`) or API responses, if any part of it originated from raw user input, it must be considered untrusted. Assigning untrusted string interpolation directly to `innerHTML` allows arbitrary script execution.
**Prevention:** Always use secure DOM manipulation methods like `textContent` or `document.createTextNode()` when dealing with user-generated or external data, ensuring it is treated purely as text and never executed as markup.
