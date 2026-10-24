# Slime Legion — DeepSeek Implementation Instructions

## 1. Complete Character Roster

### Mentors (fixed-form, no evolution)
| Character | Role | Sprite Status |
|---|---|---|
| **Robbit** | Creator/guide, purple rabbit | ✅ Complete in `sprites/robbit_phase*.webp` |
| **Madre Cerebro** | Ancient hive-mind, organic CPU | ✅ Complete in `sprites/madrecerebro_phase*.webp` |
| **Totopo** | Albino mole sage/bard, rescued from Dr. Cerdito's lab | ✅ NEW in `sprites/totopo_phase3.webp`, `totopo_portrait.webp` |
| **Dr. 100tifiko** | Mad scientist who created all conscious vegetables | ❌ No sprite yet |
| **Gatito Princesa** | Cat princess | ❌ No sprite yet (concept exists in `Lol.png` sticker sheet) |

### Evolving Characters (5 phases each: 1→2→3→4A/4B)
| Character | Sprite Status |
|---|---|
| **Mini-Zanahoria** (title protagonist) | ✅ NEW — `sprites/minizanahoria_phase1-4b.webp` + `spritesheets/minizanahoria_evo_chart.webp` |
| **Chi-Wish** (wish-granting slime) | ✅ Existing — `sprites/chiwish_phase*.webp` |
| **Emma Ruth** (rainbow slime) | ✅ Existing — `sprites/emmaruth_phase*.webp` |
| **Diego Ivan** (tech slime) | ✅ Existing — `sprites/diegoivan_phase*.webp` |
| **Yuya** (shadow slime) | ✅ Existing — `sprites/yuya_phase*.webp` |
| **Cherry** (nature slime) | ✅ Existing — `sprites/cherry_phase*.webp` |

### Secondary Chars (no sprites yet)
Broco-Lee (broccoli bodyguard), ChayoTito (first conscious vegetable, wise elder), Elotaylor (corn cowboy/gunslinger)

---

## 2. Evolution System (Core Mechanic)

Each evolving character follows a 5-phase tree:

```
Phase 1 (Slime) ──→ Phase 2 (Pikuniku) ──→ Phase 3 (Humanoide) ──→ Phase 4A (Good)
                                                                   └─→ Phase 4B (Evil)
```

- **Phase 1**: Small blob with eyes — no limbs, basic abilities
- **Phase 2**: Sprouted limbs (stick arms/legs) — can interact with world
- **Phase 3**: Full humanoid form — combat/exploration ready
- **Phase 4A (Good)**: Light/golden/knight path — protector class
- **Phase 4B (Evil)**: Dark/thorned/sorcerer path — destroyer class

Evolution is the **primary reward mechanic**: as the child completes therapeutic mini-games, their slime accumulates evolution points. When enough points are earned, the slime advances to the next phase. At phase 3→4, the player chooses good or evil permanently.

### Class system (Phase 4)
| Path | Theme | Abilities | Palette |
|---|---|---|---|
| Good (4A) | Protection, healing | Shield, heal, light beam | Gold/Lavender (#FFD700, #AA73B2) |
| Evil (4B) | Destruction, control | Dark blast, thorn trap, fear | Dark red/purple (#B42828, #501450) |

---

## 3. Sprite Asset Map

**Format**: Individual WebP sprites with dark background (#2D2832)

| Phase | Sprite Size | Background |
|---|---|---|
| 1 | 315×260-270 | Dark purple-gray (#2D2832) |
| 2 | 315×260-270 | Dark purple-gray (#2D2832) |
| 3 | 315×260-270 | Dark purple-gray (#2D2832) |
| 4A | 416-446×347 | Dark blue-purple |
| 4B | 416-446×347 | Dark red-purple |

**Master spritesheet**: Each character occupies a 2814×550 row, vertically stacked (7 rows = 2814×3994). See `spritesheets/master_sheet.webp`.

**Note on Madre Cerebro**: Uses 1024×1024 individual sprites and 5144×1032 spritesheet (different scale from other characters).

---

## 4. Integration Targets

### A. Quetzal Companion (HTML Canvas Screensaver)
- **Sprite loader**: Canvas-based renderer, reads WebP sprites directly
- **Screensaver mode**: 
  - Robbit + Madre Cerebro display final form (phase 4A/4B) idling
  - The 5 legionarios cycle through all 5 phases in sequence
  - Mini-Zanahoria phases cycle as primary attention-grabber
  - Totopo sits in corner reading (phase 3 idle)
- **Each character drawn by**: selecting its master_sheet row → cropping current phase by x-start + width

### B. XOLO (Ebitengine, 2D Pixel Platformer)
- **Sprite format**: Existing `sprites.png` uses 16×24 frames (idle/run/jump/dash)
- **Evolution integration**: When player dies enough (g.deaths++ reaches threshold), slime evolves
- **Death counter**: Already implemented (`g.deaths++`, delay 30 frames with flash/fade)
- **NPC dialog**: MiniCPM5-1B API on port 9000 generates dialog from evolved slime's personality

### C. Minizanahoria Adventure (Web-based therapeutic game)
- **Sync Bridge** (PiecesOS LTM): WebSocket bridge between game progress ↔ clinical dashboard
- **Adaptive Difficulty**: As slime evolves, therapeutic mini-games become harder
- **Clinical Tracking**: Each session logs: games completed, evolution state, time spent, success rate
- **Accessibility Panel**: font size toggle, color-blind mode, sound toggle, motor delay compensation
- **PWA**: Service worker for offline play, install prompt on mobile

---

## 5. Technical Specs

### Colors
| Name | Hex | RGB | Usage |
|---|---|---|---|
| Robledo Purple | `#4E5EB4` | (78,94,180) | Mentors, UI dark elements |
| Lavender | `#AA73B2` | (170,115,178) | Good path, magic effects |
| Gold | `#EBE6A6` | (235,230,166) | Good path, highlights |
| Dark Purple BG | `#2D2832` | (45,40,50) | Sprite backgrounds |
| Carrot Orange | `#FF9E3D` | (255,158,61) | Mini-Zanahoria base |
| Carrot Green | `#4CAF50` | (76,175,80) | Leaves, nature |

### Sprite naming convention
```
{character}_{phase}.webp
  character: robbit, madrecerebro, chiwish, emmaruth, diegoivan, yuya, cherry, totopo, minizanahoria
  phase: phase1, phase2, phase3, phase4a, phase4b
```

### Chart naming convention
```
{character}_evo_chart.webp  (2814×550 chart row)
master_sheet.webp            (2814×3994 full cast)
```

---

## 6. Implementation Priority

1. **Integrate new sprites** (Totopo + Mini-Zanahoria) into Quetzal Companion canvas renderer
2. **Build evolution system** in Minizanahoria Adventure: phase tracking, evolution triggers, UI indicators
3. **Wire adaptive difficulty** to evolution state: harder mini-games = faster evolution
4. **Implement Sync Bridge** WebSocket: real-time state sync to clinical dashboard
5. **Add accessibility panel**: motor delay compensation, color-blind mode, large text
6. **Create PWA manifest + service worker**: offline play, install prompt
7. **Integrate MiniCPM5-1B NPC dialog**: personalities keyed to evolution phase

---

## 7. Notes for Implementation

- The 5 Slime Legionarios' evolution mirrors the player's own slime — as the player grows, so does their in-game avatar
- Evolution is NOT cosmetic — it gates abilities, zones, and story beats
- Phase 4 choice (Good vs Evil) is permanent per save file, creating replay incentive
- All WebP sprites should maintain the dark-background portrait style
- The spritesheets directory contains full-row composites for atlas/texture-packing
