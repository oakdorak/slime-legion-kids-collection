## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-10-28 - XSS vulnerability via innerHTML in AI dialogue mirroring
**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject AI-generated text and user input into the DOM (e.g., `document.getElementById('mirror-red-content').innerHTML = ...`). This is a potential DOM-based XSS vulnerability if the external API (or fallback mock) returns unescaped HTML, or if the user's input (`item.concept`) is malicious and rendered in the library.
**Learning:** Never trust external API responses or previously stored user inputs when rendering them directly to the DOM using `innerHTML`, even if the source is intended to be safe.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.
