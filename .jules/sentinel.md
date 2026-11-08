## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-11-08 - DOM XSS vulnerability in Agora module

**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to inject user input (`item.concept`) and AI responses directly into the DOM (e.g. `mirror-red-content`, `item-concept`). This allows for Cross-Site Scripting (XSS) if the user inputs malicious HTML tags.
**Learning:** Hybrid template patterns (using `innerHTML` for static HTML structure and `.textContent` for dynamic values) are necessary for securely rendering complex UI components when incorporating user-provided or external AI-generated strings.
**Prevention:** Avoid injecting dynamic variables directly into template literals used with `innerHTML`. Instead, build the structure and populate text fields via safe properties like `.textContent`.
