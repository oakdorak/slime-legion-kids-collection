## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-11-11 - XSS vulnerability via innerHTML in Agora UI

**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject AI-generated text or mocked responses directly into the DOM (e.g., `document.getElementById('mirror-red-content').innerHTML = \`<p>${result.red}</p>\`` and library items). This created a critical XSS risk, as the application relies on an external API that could return malicious payload responses.
**Learning:** External API responses must be considered untrusted data and should never be injected directly via `innerHTML`. Doing so breaks the application's boundaries and enables potential Remote Code Execution if the API is compromised or responds unpredictably.
**Prevention:** Use a hybrid template pattern where the static HTML structure is set safely via `innerHTML` (e.g., `<p></p>`), and the dynamic/untrusted data is injected into that structure using safe DOM properties like `.textContent`.
