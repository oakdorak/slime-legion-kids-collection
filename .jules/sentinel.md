## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-10-29 - XSS mitigation via hybrid HTML templates
**Vulnerability:** Unescaped AI and user inputs were injected directly into the DOM using `innerHTML` in `shared/audio/agora.js`.
**Learning:** To fix XSS without creating verbose DOM manipulation code (`document.createElement`), we can use a hybrid pattern: inject static structure via `innerHTML` and populate dynamic values via `.querySelector().textContent`.
**Prevention:** Use this hybrid template pattern for vanilla JS components to balance XSS prevention with code maintainability.
