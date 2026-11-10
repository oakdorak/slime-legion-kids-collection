## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-11-10 - XSS vulnerability via innerHTML in Agora UI

**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject query results and library items directly into the DOM (e.g., `document.getElementById('mirror-red-content').innerHTML = \`<p>\${result.red}</p>\`;`). This is a critical XSS vulnerability since `result.red`, `result.blue`, and `result.green` stem from untrusted AI responses.
**Learning:** Never trust outputs from external AI engines (like Ollama or Sakana Fugu) in a web application context. Interpolating untrusted text directly into HTML elements via template literals and `innerHTML` creates an execution path for malicious payloads.
**Prevention:** Avoid interpolating variables into `innerHTML`. Use a hybrid approach where `innerHTML` defines the static DOM structure (with empty placeholders), followed immediately by `.textContent` to safely populate the dynamic, untrusted values into those placeholders.
