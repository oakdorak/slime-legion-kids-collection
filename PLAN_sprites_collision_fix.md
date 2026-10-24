# PLAN: Sprite Unification + JS Collision Fix

**Repo:** `oakdorak/slime-legion-kids-collection` (`~/slime-legion-kids`)
**Branch:** `master` (post-commit `79d39b2`)
**Date:** 2026-10-24
**Status:** PLANNING / /plan

---

## 1. Síntoma

> *"Creo que hay un problema con el asset o el juego de minizanahoria, no sé si por
> la convención de que estan nombrados iguales o similares, ya no funciona.
> También, necesitamos que Totopo y Minizanahoria no sean solamente círculos con
> dibujos, tienen que ser sprites. Utiliza la habilidad de sprite generator que
> teníamos, para hacer los sprites que quedén todos perfectos y empaten todo."*

### Root-cause map

| # | Finding | Evidence |
|---|---------|----------|
| R1 | **Fatal `SyntaxError: Identifier 'State' has already been declared`** kills `mini-zanahoria/` game on load | `agora.js:277` declares `const State`; `mini-zanahoria/app.js:262` declares `const State` again. Both are `<script>` globals on the same page. Reproduced: `node -e VM` → confirmed. |
| R2 | **Folder-name collision confusion** — two near-identical modules: `mini-zanahoria/` (game, BROKEN) and `minizanahoria/` (aventura, works but duplicates code) | Both have their own `app.js` with `getMascotSVG`, `const State`, `const AudioEngine`. |
| R3 | **Mascot rendered as inline SVG circle** (`getMascotSVG` returns carrot-circle SVG), not a sprite image | 8 calls to `getMascotSVG` in each `app.js`; `.carrot-svg` CSS in styles.css line 635. |
| R4 | **Totopo sprites incomplete** — only `totopo_phase3.webp` + `totopo_portrait.webp`; missing phases 1, 2, 4a, 4b | `ls slime-evolution/sprites/` confirms. Other chars have all 5 phases. |
| R5 | **Existing sprites are AI-rendered (not pixel art)** — 3k–13k unique colors | robbit_phase1: 13098 colors, totopo: 3063, minizanahoria: 1976. Pixel art should have <50. |
| R6 | **Root `index.html` already uses real sprites** — but only there | Lines 135-238: loads `./slime-evolution/sprites/<char>_<phase>.webp` via `SlimeRewards.getSpritePath()`. |

### Why R1 is the actual blocker

`mini-zanahoria/index.html` loads three scripts at global scope:
```html
<script src="../shared/audio/agora.js"></script>      <!-- const State @line 277 -->
<script src="../shared/slime-rewards.js"></script>     <!-- OK (namespaced: window.SlimeRewards) -->
<script src="app.js"></script>                        <!-- const State @line 262 → SyntaxError -->
```
`const` redeclaration in the same scope is a **fatal SyntaxError** — it aborts *both* scripts.
`function getMascotSVG` is also duplicated (function declarations *don't* throw on redeclaration,
but agora.js loads first so its version wins, and mini-zanahoria/app.js's is dead).

The `minizanahoria/` module (adventure) does **not** load `shared/audio/agora.js`, so it
doesn't hit this exact collision — but it carries its **own** copy of `AudioEngine`,
`getMascotSVG`, and `State`, violating DRY and making the naming confusion real.

---

## 2. Tools available

| Tool | Path | Role | Image import? |
|------|------|------|:---:|
| **pxl-pixel-art** | `node ~/.agents/skills/pxl-pixel-art/bin/pxl.js` | Code-based pixel-art DSL: `sprite()`, `sheet()`, `anim()`, `--scale`, `--serve` (live preview) | ❌ (writes from grid strings + shape ops) |
| **slime-pixelizer** | `/tmp/spz/scripts/pixelize.py` (unpacked from `~/slime-pixelizer.skill`) | Image→pixel-art converter: NEAREST resize + 6-color palette quantize | ✅ (converts existing webp) |
| **pack_sprites.py** | `scripts/pack_sprites.py` | Packs `.webp` sprites → per-char sheets + `master_sheet.webp` + `sprite-manifest.json` | N/A |

### pxl quick test (verified working)
```bash
node ~/.agents/skills/pxl-pixel-art/bin/pxl.js build ~/.agents/skills/pxl-pixel-art/examples/basics.px.js --out /tmp/pxl_test --no-preview
# → sprites/slime.png (16×10), sprites/chest.png (18×14), sheet chars.png (67×25) ... OK
```

### Sprite specs (from existing assets)
- **Format:** `.webp` (existing), 315×270 or 416×347 (varies per phase)
- **Manifest:** `slime-evolution/sprite-manifest.json` — TexturePacker-style hash with `x/y/w/h` + `spriteOffsetX/Y`
- **Master sheet:** `slime-evolution/spritesheets/master_sheet.webp`
- **Palette (AGENTS.md canonical):** `#231F24` bg, `#4E5EB4` Robledo purple, `#FFE066` gold,
  `#AA73B2` lavanda, `#E3E0A4` cream, `#00BFA5` teal, `#A39A70` sage, `#99845C` brown
- **Root index.html display:** `width:72px; height:72px; image-rendering: pixelated; filter: drop-shadow(...)`

---

## 3. Phase 1 — Fix JS collision (CRITICAL blocker)

**Goal:** `mini-zanahoria/` game loads and runs without `SyntaxError`.

### Approach: IIFE namespace + shared module extraction

**Step 1a — Namespace `shared/audio/agora.js`:**
Wrap the entire file body in an IIFE so only `window.AgoraAudio` (and any other
explicit `window.X` exports) reach global scope. Specifically:
- `const State` → stays inside IIFE; add `window.AgoraState = State` if mini-zanahoria/app.js needs it (it doesn't — it has its own State)
- `function getMascotSVG` → the SHARED one. mini-zanahoria/app.js should NOT redefine it
- `function initSpeech()`, `function initEventListeners()`, etc. → IIFE internals (already not on window except via DOMContentLoaded)
- Keep `window.AgoraAudio = AgoraAudio` (line 693) as-is

**Step 1b — Fix `mini-zanahoria/app.js`:**
- Rename local `const State` → `const GameState` (line 262). All 8 internal `State.` references get updated.
- **Delete** the local `function getMascotSVG` (line 128) — use the one from `agora.js` (loaded first). Verify the shared version's signature `getMascotSVG(emotion, status)` is compatible with the 8 call sites (which use `getMascotSVG('normal', 'center')`, `getMascotSVG('happy', 'center')`, etc.).
- Actually: the shared agora.js `getMascotSVG(emotion='happy', status='normal')` uses `status` but the mini-zanahoria calls use `gazeDirection`. They produce the same SVG structure (carrot body + eyes + mouth). After we switch to sprites (Phase 4), all these calls get replaced anyway.

**Step 1c — Fix `minizanahoria/app.js` (adventure module):**
- Same treatment: rename `const State` → `const GameState`, remove duplicate `getMascotSVG` + `AudioEngine` (or namespace as `MiniAudioEngine`). Since this module doesn't load shared scripts, it's self-contained — but the duplication is the smell. **Decision:** extract `AudioEngine` into `shared/audio/audio-engine.js` and have BOTH modules load it.

**Step 1d — Extract shared AudioEngine:**
Create `shared/audio/audio-engine.js`:
```js
const AudioEngine = { /* init, playSuccess, playError, playClick */ };
window.AudioEngine = AudioEngine;  // expose for all consumers
```
Then remove `AudioEngine` from both `agora.js` and both `app.js` files, and add a `<script src="../shared/audio/audio-engine.js">` to both module index.html files.

**Verification:**
```bash
node -e "
const vm = require('vm'); const fs = require('fs');
const ctx = {window:{}, document:{addEventListener:()=>{}}, localStorage:{getItem:()=>null,setItem:()=>{}}, console};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('shared/audio/agora.js','utf8'), ctx);
vm.runInContext(fs.readFileSync('shared/audio/audio-engine.js','utf8'), ctx);
vm.runInContext(fs.readFileSync('mini-zanahoria/app.js','utf8'), ctx);
console.log('OK — no SyntaxError');
"
# Should print "OK — no SyntaxError"
```

---

## 4. Phase 2 — Sprite generation strategy

### Decision matrix

| Criterion | pxl (code-based) | pixelize.py (image→art) |
|-----------|:----------------:|:-----------------------:|
| True pixel art | ✅ From scratch | ✅ Converts to 6-color palette |
| Matches existing style | ⚠️ Must hand-design to match | ⚠️ Converts existing (but existing is 13k-color rendered) |
| Handles Totopo phase1/2/4 (missing) | ✅ Must create from lore | ❌ No source image |
| Handles emotion variants (happy/sad/angry) | ✅ Easy via `swap`/params | ❌ One image → one emotion |
| Animation support | ✅ `anim()`, `frames:` | ❌ Static only |
| Effort | High (design each sprite) | Low (run converter) |

### Decision: **Hybrid**

- **Totopo** — use **pxl** (all phases must be created from scratch; the existing
  `totopo_phase3.webp` and `totopo_portrait.webp` are rendered, not pixel art — redesign from lore)
- **Minizanahoria** — use **pxl** (same reasoning; the existing sprite is rendered)
- **Other characters** (robbit, cherry, etc.) — use **pixelize.py** as a quick conversion
  to get them onto the same pixel-art grid; refine in pxl if time permits

> **Rationale:** The user said "el sprite generator que teníamos" — that's `pxl-pixel-art`.
> For characters with NO source (Totopo phases 1/2/4a/4b), pxl is the only path.
> For characters with existing rendered sprites, pixelize.py is a fast starting point.

---

## 5. Phase 3 — Create pixel art sprites via pxl

### Palette (canonical from AGENTS.md):
```js
pal({
  bg: "#231f24",    // dark background
  p:  "#4e5eb4",    // Robbit purple (Robledo)
  P:  "#5c2c93",    // dark purple (Robbit ears)
  g:  "#e8a15c",    // gold (Totopo staff)
  G:  "#f2e9a8",    // lighter gold
  l:  "#aa73b2",    // lavanda
  L:  "#896ab0",    // dark lavanda
  c:  "#e3e0a4",    // cream
  t:  "#00bfa5",    // teal
  s:  "#a39a70",    // sage
  S:  "#99845c",    // brown
  k:  "#000000",    // ink/black
  w:  "#ffffff",    // white
  r:  "#e67e22",    // carrot orange (Minizanahoria)
  R:  "#d35400",    // carrot dark orange
  v:  "#a8b28a",    // leaf green
  V:  "#3f8f8c",    // dark leaf
  bl: "#3498db",    // blue (sad tears / details)
  re:"#e74c3c",     // red (happy mouth / angry)
})
```

### Sprite specifications

**Minizanahoria (carrot slime)** — 9 phases (5 phases × emotion variants):
- Base size: 16×18 (carrot body), outline grows to 18×20
- Phase 1: small sprout, simple face
- Phase 2: taller, eyes more defined
- Phase 3: full leaves, smile
- Phase 4A (Light): golden crown, radiant
- Phase 4B (Dark): thorny, shadow
- Emotions: `normal`, `happy`, `sad`, `angry`, `surprised`, `tired`
- Portrait: 416×347 (head only, matching other portraits)

**Totopo (sage mole/bardo)** — 6 phases:
- Base size: 16×20 (head + robe folds)
- Phase 1: young sage, simple
- Phase 2: beard slightly longer
- Phase 3: full beard, staff (current phase3 redesigned)
- Phase 4A (Light): radiant auras, golden eyes
- Phase 4B (Dark): shadow tendrils, cracked staff
- Portrait: 416×347

### pxl source file: `scripts/sprites/characters.px.js`
```js
// One .px.js file for ALL characters, built with:
// node ~/path/pxl.js build scripts/sprites/characters.px.js --scale 18 --out slime-evolution/sprites
// (32×18 base → 576×324 at scale 18... but we want ~315-416 to match)

// Better: design at 16-32px base, scale to ~315px
// 315/32 ≈ 10 → --scale 10 for phase sprites (≈320px)
// 416/32 ≈ 13 → portrait at --scale 13
```

### Build command:
```bash
mkdir -p scripts/sprites scripts/out-sprites
node ~/.agents/skills/pxl-pixel-art/bin/pxl.js build \
  scripts/sprites/characters.px.js \
  --scale 10 --out slime-evolution/sprites \
  --no-preview
```

> **Note:** pxl outputs `.png`. We convert to `.webp` with ImageMagick or PIL afterward
> (existing sprites are webp, and CSP allows `img-src 'self'`).

---

## 6. Phase 4 — Replace SVG `getMascotSVG` with sprite `<img>` rendering

### Current flow (8 call sites in each app.js):
```js
container.innerHTML = getMascotSVG('happy', 'center');
// → sets container.innerHTML to an SVG string
```

### New flow:
```js
container.innerHTML = '';  // clear
const img = document.createElement('img');
img.src = getMascotSprite(emotion, gazeDirection);
img.className = 'mascot-sprite';
container.appendChild(img);
```

### `getMascotSprite(emotion, gazeDirection)` (shared, in `shared/audio/agora.js` or new `shared/slime-mascot.js`):
```js
function getMascotSprite(emotion = 'happy', gazeDirection = 'center') {
  const char = window.SlimeRewards?.getCharacter() || 'minizanahoria';
  const phase = window.SlimeRewards?.getPhaseInfo()?.key || 'phase1';
  const emotionSuffix = emotion === 'normal' ? '' : '_' + emotion;
  // Sprite naming: <char>_<phase>_<emotion>.webp
  // Falls back to <char>_<phase>.webp if emotion variant doesn't exist
  return `../slime-evolution/sprites/${char}_${phase}${emotionSuffix}.webp`;
}
```

### Emotion sprite frames:
- `minizanahoria_phase1.webp` (normal)
- `minizanahoria_phase1_happy.webp`, `_sad.webp`, `_angry.webp`, `_surprised.webp`, `_tired.webp`
- Same for totopo

### CSS updates (`styles.css`):
```css
.mascot-sprite {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 0 8px rgba(137, 106, 176, 0.5));
  user-select: none;
}
.mascot-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Remove .carrot-svg styles (no longer needed) */
```

### Gaze/head rotation → CSS transforms:
Instead of SVG `transform: rotate()`, use CSS:
```css
.mascot-sprite.gaze-NW { transform: rotate(-8deg) translate(-3px, -2px); }
.mascot-sprite.gaze-NE { transform: rotate(8deg) translate(3px, -2px); }
```
Applied dynamically in JS based on `gazeDirection` parameter.

---

## 7. Phase 5 — Regenerate atlas + update CHARACTERS

### Step 5a: Add new emotion sprite variants to `slime-evolution/sprites/`
After Phase 3 + 4, the sprites directory has:
- `minizanahoria_phase{1,2,3,4a,4b}.webp` (updated to pixel art)
- `minizanahoria_phase{1..5}_{happy,sad,angry,surprised,tired}.webp` (new emotion variants)
- `totopo_phase{1,2,3,4a,4b}.webp` (new, pixel art)
- `totopo_{emotions}.webp` (new)
- `totopo_portrait.webp` (updated to pixel art)
- `minizanahoria_portrait.webp` (new — didn't exist before, add for consistency)

### Step 5b: Update `shared/slime-rewards.js`
```js
CHARACTERS: {
  ...
  totopo: { id: 'totopo', name: 'Totopo', title: 'El Sabio Subterráneo', phases: 5 },  // was 1
  ...
},
getSpritePath(charId, phaseKey) {
  // totopo now has all phases — remove the special-case
  const cid = charId || this.getCharacter();
  const pkey = phaseKey || this.getPhaseInfo().key;
  return `../slime-evolution/sprites/${cid}_${pkey}.webp`;  // uniform
}
```

### Step 5c: Update `scripts/pack_sprites.py`
The `parse_filename` regex already handles `{char}_{phase}`:
```python
m = re.match(r"^(.+)_(phase[0-9a-z]+|portrait)$", base)
```
But it does NOT handle emotion variants (`minizanahoria_phase1_happy`). **Decision:** keep emotion variants as separate files NOT in the manifest/sheet (they're loaded directly by JS for the game mascot). Only put the canonical phase + portrait sprites in the master sheet.

Actually — simpler: the emotion variants are only used by the game mascot (dynamic). They don't need to be in the atlas. The manifest/sheet is for the evolution showcase in root `index.html`. So:
- Atlas contains: `<char>_phase{1,2,3,4a,4b}.webp` + `<char>_portrait.webp`
- Direct sprite files (emotion variants) live alongside but aren't packed

### Step 5d: Regenerate atlas:
```bash
python3 scripts/pack_sprites.py
# → slime-evolution/spritesheets/{cherry,totopo,...}.webp + master_sheet.webp
# → slime-evolution/sprite-manifest.json (updated)
```

### Step 5e: Fix `root index.html`
The root index.html line 237:
```js
const spriteFile = char === 'totopo' ? 'totopo_phase3.webp' : `${char}_${phase.key}.webp`;
```
→ now totopo has phase1, remove the special case:
```js
const spriteFile = `${char}_${phase.key}.webp`;
```

---

## 8. Phase 6 — Tests + verification

### Test 1: Collision test (NEW)
```js
// tests/collision.test.js
const fs = require('fs');
const vm = require('vm');
// Load agora.js + audio-engine.js + app.js in same context
// Assert: no SyntaxError, both getMascotSVG and State exist
// Assert: GameState !== State (no collision)
```

### Test 2: SlimeRewards tests (EXISTING)
```bash
node tests/slime-rewards.test.js
# → expect 6/6 passing
```

### Test 3: pxl build verification
```bash
node ~/.agents/skills/pxl-pixel-art/bin/pxl.js build scripts/sprites/characters.px.js --scale 10 --out /tmp/pxl_verify --no-preview
# → expect all sprites generated, 0 errors
ls /tmp/pxl_verify/sprites/ | wc -l  # expect ≥24 (2 chars × ~6 phases/emotions)
```

### Test 4: Sprite format verification
```bash
# All new sprites must be webp, ~315-416px, pixel art (<50 unique colors)
for f in slime-evolution/sprites/totopo_phase*.webp slime-evolution/sprites/minizanahoria_phase*.webp; do
  file "$f" | grep -q "Web/P" && echo "✅ $f" || echo "❌ $f"
done
```

### Test 5: Manifest integrity
```bash
python3 -c "
import json; m = json.load(open('slime-evolution/sprite-manifest.json'))
chars = [c['id'] for c in m['characters']]
assert 'totopo' in chars
for c in m['characters']:
    phases = [f['phase'] for f in c['frames']]
    assert 'phase1' in phases, f\"{c['id']} missing phase1\"
    assert 'phase4b' in phases, f\"{c['id']} missing phase4b\"
print('✅ Manifest has all phases for all chars')
"
```

### Test 6: Git dry-run
```bash
git diff --stat  # review all changed files
git status       # untracked sprites
```

---

## 9. Execution order (timeline)

| Step | Action | Est. time |
|------|--------|-----------|
| 1 | Fix JS collision (Phase 1: namespace + extract AudioEngine) | 30 min |
| 2 | Verify mini-zanahoria game loads (collision test) | 5 min |
| 3 | Design + build pixel art sprites via pxl (Phase 3) | 2-3h |
| 4 | Convert to webp + emotion variants | 15 min |
| 5 | Replace getMascotSVG with sprite loading (Phase 4) | 45 min |
| 6 | Update slime-rewards.js CHARACTERS + pack_sprites.py | 20 min |
| 7 | Regenerate atlas + manifest | 10 min |
| 8 | Run all tests + verify | 20 min |
| 9 | Commit + push | 5 min |

**Total: ~4-5 hours**

> **Risk:** The existing rendered sprites (robbit, cherry, etc.) won't match the new
> true-pixel-art sprites (Totopo, Minizanahoria). If the user wants ALL characters
> converted, Phase 3 expands to ~10 sprites × design time. **Defer to Phase 7.**
