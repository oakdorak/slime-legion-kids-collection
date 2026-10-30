## 2024-08-06 - XSS vulnerability via innerHTML in game UI

**Vulnerability:** The `emotion-mirror/index.html` file used `innerHTML` to dynamically inject emoji symbols and labels into DOM buttons (`btn.innerHTML = ...`). This is a potential XSS vulnerability if the injected variables are manipulated.
**Learning:** Even in seemingly static arrays of objects (like the `EMOTIONS` array), using `innerHTML` for DOM element construction is an insecure pattern that introduces risk, especially if data sources are later modified or imported dynamically.
**Prevention:** Always use safe DOM manipulation methods like `document.createElement`, `textContent`, and `appendChild` when inserting dynamic variables into the DOM, even if the current context appears fully trusted.

## 2024-10-30 - XSS vulnerability via innerHTML in Agora UI
**Vulnerability:** The `shared/audio/agora.js` file used `innerHTML` to dynamically inject query results and library item properties (`result.red`, `item.concept`) into the DOM. This introduces an XSS risk if the AI responses or saved concepts are maliciously crafted or manipulated in storage.
**Learning:** Even when populating complex UI elements like multi-line list items, interpolating external or stored data directly into template strings for `innerHTML` remains insecure.
**Prevention:** Use a hybrid template pattern: inject the static structure using `innerHTML`, and then populate the dynamic text content safely using `querySelector` and `textContent` for each respective node.
