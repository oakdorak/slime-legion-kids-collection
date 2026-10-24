// characters.px.js — True pixel-art sprites for Minizanahoria (carrot) & Totopo (mole)
// Canonical 14-color palette from AGENTS.md (Robbitverse)
// All sprites use grid strings / primitives only — NEVER AI-rendered, always code-based.

pal({
  k: "#231f24",   // ink / outline / dark bg
  r: "#e67e22",   // carrot orange (light)
  R: "#d35400",   // carrot orange (dark) — ridges, point
  v: "#a8b28a",   // leaf green (light)
  V: "#3f8f8c",   // leaf green (dark) — stem
  w: "#ffffff",   // white (eye whites)
  e: "#222222",   // black (pupils, outlines on face)
  h: "#f187b8",   // pink (cheeks)
  d: "#e74c3c",   // red (mouths, angry details)
  B: "#3498db",   // blue (sad tears)
  p: "#502b5a",   // mole purple (robe light)
  P: "#5c2c93",   // mole purple (robe dark)
  s: "#b08b58",   // mole skin (light)
  S: "#8b5a2b",   // mole skin (dark) — snout, nose
  g: "#ffe066",   // gold (crown, staff, trim)
  G: "#d4af37",   // dark gold
  c: "#ebe6a6",   // cream (mouth interior, sleep z's)
  t: "#99845c",   // tan (mole details, wood)
})
ramps("krw", "krR", "kvV", "kpPsG", "kes", "khd", "kBdt")

// ===========================================================================
// FACE PATCHES — 6×5 transparent sprites, same position for all phases
// Stamped onto body parts at a character-specific offset.
// ===========================================================================

sprite("_face_normal", { w: 6, h: 5 }, grid(0, 0, `
.w..w.
.e..e.
......
h....h
..kk..`))

sprite("_face_happy", { w: 6, h: 5 }, grid(0, 0, `
.kk.kk
......
hh..hh
..dd..
......`))

sprite("_face_sad", { w: 6, h: 5 }, grid(0, 0, `
.w..w.
.e..e.
...B..
......
.kk...`))

sprite("_face_angry", { w: 6, h: 5 }, grid(0, 0, `
kk..kk
.ee.ee
......
..dd..
..kk..`))

sprite("_face_surprised", { w: 6, h: 5 }, grid(0, 0, `
.w..w.
.wwww.
......
..cc..
..cc..`))

sprite("_face_tired", { w: 6, h: 5 }, grid(0, 0, `
.c..c.
.w..w.
......
......
..dd..`))

// ===========================================================================
// MINIZANAHORIA (CARROT) BODY PARTS — 16×14, no outline, transparent bg
// ===========================================================================

sprite("_miniz_body_p1", { w: 16, h: 14 },
  // Leaves (2 small clusters)
  circ(4, 1, 1, "v"), circ(10, 1, 1, "v"),
  // Stem
  rect(6, 2, 4, 1, "V"),
  // Carrot body (small oval, tapering down)
  ellipse(8, 6, 3, 4, "r"),
  // Body ridge
  vline(8, 3, 6, "R"),
  // Point
  poly([5, 11, 8, 13, 11, 11], "R"))

sprite("_miniz_body_p2", { w: 16, h: 14 },
  // Leaves
  circ(4, 1, 1, "v"), circ(10, 1, 1, "v"),
  // Stem (slightly thicker)
  rect(6, 2, 4, 1, "V"),
  // Carrot body (taller)
  ellipse(8, 6, 3, 5, "r"),
  // Body bumps
  circ(6, 5, 1, "r"), circ(10, 5, 1, "r"),
  // Ridge
  vline(8, 3, 8, "R"),
  // Point
  poly([5, 12, 8, 13, 11, 12], "R"))

sprite("_miniz_body_p3", { w: 16, h: 14 },
  // Leaves (2 big clusters)
  circ(3, 1, 2, "v"), circ(10, 1, 2, "v"),
  // Stem
  rect(5, 3, 5, 1, "V"),
  // Carrot body (largest)
  ellipse(8, 6, 4, 5, "r"),
  // Ridge + secondary ridges
  vline(8, 3, 6, "R"),
  vline(6, 5, 4, "R"),
  vline(10, 5, 4, "R"),
  // Point
  poly([5, 12, 8, 13, 11, 12], "R"))

sprite("_miniz_body_p4a", { w: 16, h: 14 },
  // Golden laurel crown
  circ(8, 1, 1, "g"),
  circ(6, 0, 1, "G"), circ(10, 0, 1, "G"),
  circ(7, 0, 0, "g"), circ(9, 0, 0, "g"),
  // Leaves
  circ(4, 2, 1, "v"), circ(11, 2, 1, "v"),
  // Stem
  rect(6, 3, 4, 1, "V"),
  // Carrot body
  ellipse(8, 7, 4, 5, "r"),
  vline(8, 4, 5, "R"),
  // Point
  poly([5, 12, 8, 13, 11, 12], "R"))

sprite("_miniz_body_p4b", { w: 16, h: 14 },
  // Leaves (thorny stem)
  circ(4, 1, 1, "v"), circ(11, 1, 1, "v"),
  px(4, 0, "R"), px(12, 0, "R"),
  // Stem
  rect(6, 2, 4, 1, "V"),
  // Carrot body
  ellipse(8, 7, 4, 5, "r"),
  // Thorny texture
  px(3, 5, "R"), px(13, 5, "R"),
  px(4, 7, "R"), px(12, 7, "R"),
  px(3, 9, "R"), px(13, 9, "R"),
  // Ridge
  vline(8, 4, 5, "R"),
  // Point
  poly([5, 12, 8, 13, 11, 12], "R"))

// ===========================================================================
// TOTOPO (MOLE) BODY PARTS — 16×14, no outline, transparent bg
// ===========================================================================

sprite("_totopo_body_p1", { w: 16, h: 14 },
  // Hood (purple)
  circ(8, 3, 4, "p"),
  // Face (mole skin)
  circ(8, 4, 3, "s"),
  // Snout
  rect(6, 6, 4, 2, "S"),
  px(6, 7, "S"), px(8, 7, "S"),
  // Robe
  rect(5, 9, 6, 4, "p"),
  hline(5, 12, 6, "P"),
  // Staff (held in left hand)
  vline(2, 1, 11, "g"),
  circ(2, 0, 1, "G"))

sprite("_totopo_body_p2", { w: 16, h: 14 },
  // Hood
  circ(8, 3, 5, "p"),
  // Face
  circ(8, 4, 3, "s"),
  // Snout (slightly longer)
  rect(6, 6, 4, 2, "S"),
  px(6, 7, "S"), px(8, 7, "S"),
  // Robe
  rect(4, 9, 8, 4, "p"),
  hline(4, 12, 8, "P"),
  // Robe folds
  rect(5, 13, 2, 1, "P"),
  rect(9, 13, 2, 1, "P"),
  // Staff
  vline(2, 1, 12, "g"),
  circ(2, 0, 1, "G"),
  circ(2, 14, 1, "G"))

sprite("_totopo_body_p3", { w: 16, h: 14 },
  // Hood with gold trim
  circ(8, 3, 5, "p"),
  circ(8, 2, 1, "g"),                    // gold center on hood
  // Face
  circ(8, 5, 3, "s"),
  // Beard
  rect(5, 7, 6, 2, "s"),
  px(4, 7, "s"), px(11, 7, "s"),
  // Snout
  rect(6, 9, 4, 2, "S"),
  px(6, 10, "S"), px(8, 10, "S"),
  // Robe
  rect(4, 11, 8, 3, "p"),
  hline(4, 13, 8, "P"),
  // Staff (ornate)
  vline(2, 1, 11, "g"),
  circ(2, 0, 1, "G"),
  circ(2, 3, 1, "G"),                  // staff gem
  poly([1, 12, 3, 13, 2, 13], "S"))    // cracked base

sprite("_totopo_body_p4a", { w: 16, h: 14 },
  // Golden hood trim
  circ(8, 3, 5, "p"),
  circ(8, 1, 1, "g"),                 // central gold
  circ(6, 0, 1, "G"), circ(10, 0, 1, "G"),  // gold points
  // Face
  circ(8, 5, 3, "s"),
  // Full beard
  rect(5, 7, 6, 3, "s"),
  px(4, 7, "s"), px(11, 7, "s"),
  px(4, 8, "s"), px(11, 8, "s"),
  // Snout
  rect(6, 10, 4, 2, "S"),
  px(6, 11, "S"), px(8, 11, "S"),
  // Robe
  rect(4, 12, 8, 2, "p"),
  hline(4, 13, 8, "g"),
  // Ornate staff
  vline(2, 1, 12, "g"),
  circ(2, 0, 1, "G"),
  poly([1, 3, 2, 4, 3, 3], "g"))      // staff gem

sprite("_totopo_body_p4b", { w: 16, h: 14 },
  // Shadow hood
  circ(8, 3, 5, "p"),
  px(6, 2, "P"), px(10, 2, "P"),      // shadow points
  // Face
  circ(8, 5, 3, "s"),
  // Beard (messy)
  rect(5, 7, 6, 3, "s"),
  px(3, 8, "s"), px(12, 8, "s"),
  // Snout
  rect(6, 10, 4, 2, "S"),
  px(7, 11, "S"),
  // Tattered robe
  rect(4, 12, 8, 2, "p"),
  px(3, 12, "P"), px(13, 12, "P"),
  // Cracked staff
  vline(2, 1, 12, "g"),
  circ(2, 0, 1, "G"),
  px(2, 6, "G"),                      // crack
  poly([1, 13, 3, 14, 2, 14], "S"))   // dark base

// ===========================================================================
// PORTRAITS — larger 3/4 view sprites (20×22)
// ===========================================================================

sprite("minizanahoria_portrait", { w: 20, h: 22, outline: "k" },
  // Leaves (3 clusters for portrait)
  circ(6, 2, 3, "v"), circ(13, 2, 3, "v"),
  // Golden crown
  circ(10, 1, 2, "g"),
  circ(8, 0, 1, "G"), circ(12, 0, 1, "G"),
  // Stem
  rect(8, 3, 4, 1, "V"),
  // Carrot body (large)
  ellipse(10, 9, 6, 7, "r"),
  // Body ridges
  vline(10, 4, 8, "R"),
  // Face
  circ(8, 9, 1, "w"), circ(13, 9, 1, "w"),
  px(8, 9, "e"), px(13, 9, "e"),
  px(7, 10, "h"), px(14, 10, "h"),
  line(8, 12, 13, 12, "k"),
  // Point
  poly([7, 17, 10, 21, 13, 17], "R"))

sprite("totopo_portrait", { w: 20, h: 22, outline: "k" },
  // Hood
  circ(10, 5, 6, "p"),
  circ(10, 4, 1, "g"),                 // gold center
  // Face
  circ(10, 7, 3, "s"),
  // Snout
  rect(8, 9, 5, 2, "S"),
  px(9, 10, "S"), px(11, 10, "S"),
  // Beard
  rect(8, 11, 5, 3, "s"),
  px(7, 11, "s"), px(13, 11, "s"),
  // Robe
  rect(4, 14, 13, 6, "p"),
  hline(4, 19, 13, "g"),
  // Staff
  vline(3, 2, 17, "g"),
  circ(3, 1, 2, "G"),
  circ(3, 20, 2, "G"))

// ===========================================================================
// COMPOSED SPRITES — body + face + outline
// ===========================================================================

const EMOTIONS = ["normal", "happy", "sad", "angry", "surprised", "tired"]

// --- Minizanahoria (face at x=4, y=3 on 16×14 body) ---
const MZ_FACE_X = 4, MZ_FACE_Y = 3

sprite("minizanahoria_phase1", { w: 16, h: 16, outline: "k" },
  stamp("_miniz_body_p1", 0, 0),
  stamp("_face_normal", MZ_FACE_X, MZ_FACE_Y + 1))

sprite("minizanahoria_phase2", { w: 16, h: 16, outline: "k" },
  stamp("_miniz_body_p2", 0, 0),
  stamp("_face_normal", MZ_FACE_X, MZ_FACE_Y + 1))

sprite("minizanahoria_phase3", { w: 16, h: 16, outline: "k" },
  stamp("_miniz_body_p3", 0, 0),
  stamp("_face_normal", MZ_FACE_X, MZ_FACE_Y + 1))

sprite("minizanahoria_phase4a", { w: 16, h: 16, outline: "k" },
  stamp("_miniz_body_p4a", 0, 0),
  stamp("_face_normal", MZ_FACE_X, MZ_FACE_Y + 1))

sprite("minizanahoria_phase4b", { w: 16, h: 16, outline: "k" },
  stamp("_miniz_body_p4b", 0, 0),
  stamp("_face_normal", MZ_FACE_X, MZ_FACE_Y + 1))

// Emotion variants (phases 1-3, not 4a/4b which are special)
for (const emo of ["happy", "sad", "angry", "surprised", "tired"]) {
  ;[1, 2, 3].forEach((p) => {
    sprite(`minizanahoria_phase${p}_${emo}`, { w: 16, h: 16, outline: "k" },
      stamp(`_miniz_body_p${p}`, 0, 0),
      stamp(`_face_${emo}`, MZ_FACE_X, MZ_FACE_Y + 1))
  })
}

// --- Totopo (face at x=5, y=2 on 16×14 body) ---
const TOP_FACE_X = 5, TOP_FACE_Y = 2

sprite("totopo_phase1", { w: 16, h: 16, outline: "k" },
  stamp("_totopo_body_p1", 0, 0),
  stamp("_face_normal", TOP_FACE_X, TOP_FACE_Y))

sprite("totopo_phase2", { w: 16, h: 16, outline: "k" },
  stamp("_totopo_body_p2", 0, 0),
  stamp("_face_normal", TOP_FACE_X, TOP_FACE_Y))

sprite("totopo_phase3", { w: 16, h: 16, outline: "k" },
  stamp("_totopo_body_p3", 0, 0),
  stamp("_face_normal", TOP_FACE_X, TOP_FACE_Y + 1))

sprite("totopo_phase4a", { w: 16, h: 16, outline: "k" },
  stamp("_totopo_body_p4a", 0, 0),
  stamp("_face_normal", TOP_FACE_X, TOP_FACE_Y + 1))

sprite("totopo_phase4b", { w: 16, h: 16, outline: "k" },
  stamp("_totopo_body_p4b", 0, 0),
  stamp("_face_normal", TOP_FACE_X, TOP_FACE_Y + 1))

// Emotion variants (phases 1-3)
for (const emo of ["happy", "sad", "angry", "surprised", "tired"]) {
  sprite(`totopo_phase1_${emo}`, { w: 16, h: 16, outline: "k" },
    stamp("_totopo_body_p1", 0, 0),
    stamp(`_face_${emo}`, TOP_FACE_X, TOP_FACE_Y))

  sprite(`totopo_phase2_${emo}`, { w: 16, h: 16, outline: "k" },
    stamp("_totopo_body_p2", 0, 0),
    stamp(`_face_${emo}`, TOP_FACE_X, TOP_FACE_Y))

  sprite(`totopo_phase3_${emo}`, { w: 16, h: 16, outline: "k" },
    stamp("_totopo_body_p3", 0, 0),
    stamp(`_face_${emo}`, TOP_FACE_X, TOP_FACE_Y + 1))
}
