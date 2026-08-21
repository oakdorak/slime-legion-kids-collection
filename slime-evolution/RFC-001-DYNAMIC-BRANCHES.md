# RFC-001: Dynamic Evolution Branches — sprite-manifest.json v2

**Status:** Draft  
**Author:** Viktor (AI) + Robbit (Rausch)  
**Created:** 2026-07-25  
**Linear:** [Dynamic Evolution Branches](https://linear.app/rausch/project/dynamic-evolution-branches-1e72d0902d8f)

## Summary

Upgrade `sprite-manifest.json` from v1 (flat phase list) to v2 (evolution-aware branching) to support:

- Multiple evolution paths per character (Eevee-style)
- Branch type classification (permanent, seasonal, event, community)
- Accessibility metadata for screen readers
- Full backward compatibility with v1 consumers

## Problem

The v1 schema uses a flat `frames[]` array with hardcoded phase names (`phase4a`, `phase4b`). This works for a binary light/dark split, but cannot express:

1. More than 2 branches per character
2. Branch metadata (what triggers an evolution, its alignment, availability)
3. Which characters are "dynamic" (extensible) vs "fixed"
4. Accessibility information for non-visual users

## Design

### v1 → v2 Changes

| Field | v1 | v2 | Breaking? |
|-------|----|----|-----------|
| `version` | `"1.0.0"` | `"2.0.0"` | No — consumers should check version |
| `characters[].evolutionType` | ❌ | `"fixed"` \| `"dynamic"` | No — additive |
| `characters[].corePath` | ❌ | `["phase1","phase2","phase3"]` | No — additive |
| `characters[].branches` | ❌ | `{ branchId: Branch }` | No — additive |
| `characters[].accessibility` | ❌ | `{ ariaLabel, description }` | No — additive |
| `characters[].frames` | ✅ | ✅ (unchanged) | **No** |
| `masterSheet` | ✅ | ✅ (unchanged) | **No** |

**Zero breaking changes.** All v1 fields are preserved. v1 consumers ignore the new fields.

### Schema: Character (v2)

```json
{
  "id": "chiwish",
  "name": "Chi-Wish",
  "sheet": "spritesheets/chiwish.webp",
  "frameWidth": 446,
  "frameHeight": 347,
  "evolutionType": "dynamic",
  "corePath": ["phase1", "phase2", "phase3"],
  "branches": {
    "supernova": {
      "alignment": "light",
      "phase": "phase4a",
      "label": "Supernova",
      "trigger": "guide",
      "branchType": "permanent",
      "accessibility": {
        "ariaLabel": "Chi-Wish evoluciona en Supernova, guía estelar",
        "altText": "Supernova — explosión de luz guiadora",
        "description": "Chi-Wish brilla con la intensidad de una supernova."
      }
    },
    "void": {
      "alignment": "dark",
      "phase": "phase4b",
      "label": "Void",
      "trigger": "absorb",
      "branchType": "permanent"
    }
  },
  "accessibility": {
    "ariaLabel": "Árbol de evolución de Chi-Wish, múltiples caminos posibles",
    "description": "Chi-Wish es un slime estelar lavanda con antenas de estrella."
  },
  "frames": [...]
}
```

### Branch Types

| Type | Description | Availability |
|------|-------------|-------------|
| `permanent` | Always available (light/dark) | No constraints |
| `seasonal` | Time-limited (e.g. Halloween) | `startDate` / `endDate` |
| `event` | Unlocked by achievement | `condition` key |
| `community` | Voted by players | External voting system |

### Adding a New Branch

1. Create the sprite: `sprites/chiwish_phase4c.webp`
2. Add metadata to `EVOLUTION_META` in `pack_sprites.py`:
   ```python
   "nebula": {
       "alignment": "neutral", "phase": "phase4c",
       "label": "Nebula", "trigger": "observe",
       "branchType": "seasonal",
       "availability": {"startDate": "2026-12-01", "endDate": "2026-12-31"}
   }
   ```
3. Run `python scripts/pack_sprites.py`
4. The manifest, spritesheet, and index.html are regenerated automatically

## Compatibility

### Consumers and Impact

| Consumer | Reads | Impact |
|----------|-------|--------|
| `index.html` (demo) | `frames[]` | ✅ No change needed |
| Game engines | `frames[]` | ✅ No change needed |
| `pack_sprites.py` | generates | ✅ Updated to emit v2 |
| Future UI | `branches`, `accessibility` | 🆕 New capability |

### Migration

```bash
# One-time migration of existing v1 manifest
python scripts/migrate_v1_to_v2.py

# Verify backward compatibility
python scripts/migrate_v1_to_v2.py --dry-run
```

The migration script:
- Preserves ALL frame data byte-for-byte
- Adds evolution metadata from the character roster
- Creates a `.v1.backup.json` before overwriting
- Validates that no v1 data was altered

## Accessibility

Every character and branch includes:

- `ariaLabel` — concise label for screen readers
- `altText` — image alt text for sprites
- `description` — narrative description for non-visual feedback

UI implementations should:
- Use `role="tree"` / `role="treeitem"` for evolution trees
- Announce branch selection with `aria-live="polite"`
- Support `prefers-reduced-motion` for evolution animations
- Provide text alternatives for all visual evolution effects

## Files

| File | Purpose |
|------|---------|
| `sprite-manifest.schema.json` | JSON Schema 2020-12 definition |
| `scripts/migrate_v1_to_v2.py` | One-time v1→v2 migration |
| `scripts/pack_sprites.py` | Updated to generate v2 manifests |
| `sprite-manifest.json` | The migrated v2 manifest |

## Open Questions

1. **Phase numbering for 3+ branches** — Currently `phase4a`, `phase4b`. Third branch would be `phase4c`? Or switch to named phases like `phase4_supernova`?
2. **Branch unlock persistence** — Where to store which branches a player has unlocked? (Likely in `SlimeRewardEngine` — see Project 2)
3. **Branch art pipeline** — Process for community-submitted evolution art?

---

*Protocolo MAIAH: La evolución es una elección.* ⚔️🧬
