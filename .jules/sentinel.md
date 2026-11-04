## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-11-04 - XSS vulnerability via innerHTML with unescaped text variables
**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject AI responses and user input (`item.concept`, `result.red`, etc.). Since these strings were not escaped or validated, a user inputting a malicious script in the text box could execute an XSS payload.
**Learning:** External API inputs and user inputs should never be placed directly inside an `innerHTML` string interpolation without proper escaping, as this enables XSS attacks.
**Prevention:** Always use safe DOM manipulation methods (`document.createElement` and `.textContent`) or a hybrid approach where static layout uses `innerHTML` and variables are assigned safely through `.textContent`.
