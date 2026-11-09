## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-11-09 - Stored XSS vulnerability via innerHTML in Agora Library
**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject user input (`item.concept`) and AI responses into the DOM when rendering the history library and mirror results, leading to a Stored XSS vulnerability.
**Learning:** Even when building complex UI components with template literals, inserting raw user input directly into `innerHTML` is insecure. The hybrid template pattern is safer.
**Prevention:** Use a hybrid template pattern: inject static structure via `innerHTML` and populate dynamic user/AI values safely via DOM methods like `.querySelector().textContent` to prevent DOM-based XSS.
