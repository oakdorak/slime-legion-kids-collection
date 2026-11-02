## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-11-02 - XSS vulnerability via innerHTML handling AI response in UI
**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject AI responses and user input into the DOM (e.g. `document.getElementById('mirror-red-content').innerHTML = \`<p>\${result.red}</p>\`;`). This is a potential XSS vulnerability if the LLM responses are poisoned via prompt injection.
**Learning:** AI-generated content or user responses must be treated as untrusted input. Injecting them directly using `innerHTML` introduces XSS risks.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting LLM-generated dynamic text into the DOM, even if the AI output format is expected to be safe.
