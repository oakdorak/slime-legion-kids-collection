## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-10-27 - Stored XSS in Agora Library via innerHTML

**Vulnerability:** In `shared/audio/agora.js`, user-provided input (`item.concept`) and AI-generated text (`item.green`, `result.red`, etc.) were directly injected into the DOM using `.innerHTML = \`<p>\${text}</p>\``.
**Learning:** Using template literals with variables mapped directly to `.innerHTML` exposes the application to XSS and Stored XSS attacks, as untrusted data can execute arbitrary scripts.
**Prevention:** Always construct DOM elements safely using `document.createElement()` and `textContent` for dynamic values, completely avoiding `.innerHTML` for any string that incorporates external or user-generated data.
