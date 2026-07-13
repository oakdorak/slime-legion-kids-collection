## 2026-07-13 - Extract Mascot SVG Gaze Logic
**Learning:** For static HTML/JS projects lacking a build pipeline, code health tasks like refactoring large functions (e.g., SVG generation) into smaller helper functions help manage complexity without altering functionality, and require local verification via simple HTTP servers.
**Action:** Extracted `getGazeOffset` from `getMascotSVG` in `mini-zanahoria/app.js` to simplify the main generation function and verified using `python3 -m http.server`.
