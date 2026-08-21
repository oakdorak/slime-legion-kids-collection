#!/usr/bin/env python3
"""
pack_sprites.py — Pack individual .webp sprites into per-character spritesheets
and a master spritesheet, plus generate sprite-manifest.json (v2) and a demo index.html.

The v2 manifest adds evolution branching metadata (evolutionType, corePath,
branches) while keeping the flat frames[] array for backward compatibility.

Usage:
    python scripts/pack_sprites.py
"""

import os
import re
import json
from datetime import datetime, timezone
from PIL import Image

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES_DIR = os.path.join(ROOT, "slime-evolution", "sprites")
SHEETS_DIR = os.path.join(ROOT, "slime-evolution", "spritesheets")
MANIFEST_PATH = os.path.join(ROOT, "slime-evolution", "sprite-manifest.json")
INDEX_PATH = os.path.join(ROOT, "slime-evolution", "index.html")

PADDING = 4
# Phase order supports arbitrary phase4+ suffixes for future branches
PHASE_ORDER = ["phase1", "phase2", "phase3", "phase4a", "phase4b"]

CHARACTERS = [
    {"id": "cherry", "name": "Cherry"},
    {"id": "chiwish", "name": "Chi-Wish"},
    {"id": "diegoivan", "name": "Diego Ivan"},
    {"id": "emmaruth", "name": "Emma Ruth"},
    {"id": "madrecerebro", "name": "Madre Cerebro"},
    {"id": "robbit", "name": "Robbit"},
    {"id": "yuya", "name": "Yuya"},
]

# ---------------------------------------------------------------------------
# Evolution metadata — defines branching lore per character
# To add a new branch: add a sprite file (e.g. chiwish_phase4c.webp),
# extend the character's entry here, and re-run this script.
# ---------------------------------------------------------------------------
EVOLUTION_META = {
    "robbit": {
        "evolutionType": "fixed",
        "branches": {
            "paladin": {
                "alignment": "light", "phase": "phase4a",
                "label": "Robbit Paladin", "trigger": "protect",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Robbit evoluciona en Paladin, protector de la luz",
                    "altText": "Robbit Paladin — forma evolucionada de protección",
                    "description": "Robbit elige proteger a sus aliados y se transforma en un paladín radiante."
                }
            },
            "dark": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Dark Robbit", "trigger": "destroy",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Robbit evoluciona en Dark Robbit, agente de destrucción",
                    "altText": "Dark Robbit — forma evolucionada de destrucción",
                    "description": "Robbit abraza la oscuridad y se convierte en un guerrero implacable."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Robbit, 2 caminos posibles",
            "description": "Robbit es un slime amarillo con goggles rosas, pelo morado y orejas de conejo."
        }
    },
    "madrecerebro": {
        "evolutionType": "fixed",
        "branches": {
            "guardiana": {
                "alignment": "light", "phase": "phase4a",
                "label": "Madre Guardiana", "trigger": "protect",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Madre Cerebro evoluciona en Madre Guardiana",
                    "altText": "Madre Guardiana — protectora cósmica",
                    "description": "Madre Cerebro usa su intelecto para proteger y guiar a la legión."
                }
            },
            "destruccion": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Modo Destrucción", "trigger": "annihilate",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Madre Cerebro activa Modo Destrucción",
                    "altText": "Modo Destrucción — poder cerebral desatado",
                    "description": "Madre Cerebro desata su Hyper Beam, consumiendo todo a su paso."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Madre Cerebro, 2 caminos posibles",
            "description": "Madre Cerebro es una larva cerebral que evoluciona a una entidad guardiana o destructora."
        }
    },
    "chiwish": {
        "evolutionType": "dynamic",
        "branches": {
            "supernova": {
                "alignment": "light", "phase": "phase4a",
                "label": "Supernova", "trigger": "guide",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Chi-Wish evoluciona en Supernova, guía estelar",
                    "altText": "Supernova — explosión de luz guiadora",
                    "description": "Chi-Wish brilla con la intensidad de una supernova para guiar a los perdidos."
                }
            },
            "void": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Void", "trigger": "absorb",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Chi-Wish evoluciona en Void, absorbe toda luz",
                    "altText": "Void — agujero negro que consume la luz",
                    "description": "Chi-Wish colapsa en sí mismo, absorbiendo toda energía a su alrededor."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Chi-Wish, múltiples caminos posibles",
            "description": "Chi-Wish es un slime estelar lavanda con antenas de estrella."
        }
    },
    "emmaruth": {
        "evolutionType": "dynamic",
        "branches": {
            "architect": {
                "alignment": "light", "phase": "phase4a",
                "label": "Architect Supreme", "trigger": "build",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Emma Ruth evoluciona en Architect Supreme",
                    "altText": "Architect Supreme — maestra constructora vampírica",
                    "description": "Emma Ruth canaliza su poder vampírico para construir estructuras imposibles."
                }
            },
            "shadow_devourer": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Shadow Devourer", "trigger": "devour",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Emma Ruth evoluciona en Shadow Devourer",
                    "altText": "Shadow Devourer — devoradora de sombras",
                    "description": "Emma Ruth consume las sombras de otros para alimentar su poder oscuro."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Emma Ruth, múltiples caminos posibles",
            "description": "Emma Ruth es un vampiro slime con alas de murciélago y vocación de arquitecta."
        }
    },
    "diegoivan": {
        "evolutionType": "dynamic",
        "branches": {
            "caballero": {
                "alignment": "light", "phase": "phase4a",
                "label": "Dino-Caballero", "trigger": "protect",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Diego Ivan evoluciona en Dino-Caballero",
                    "altText": "Dino-Caballero — protector con armadura de dinosaurio",
                    "description": "Diego Ivan monta su dinosaurio como caballero noble, protegiendo a los más pequeños."
                }
            },
            "destructor": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Dino-Destructor", "trigger": "crush",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Diego Ivan evoluciona en Dino-Destructor",
                    "altText": "Dino-Destructor — dinosaurio de destrucción total",
                    "description": "Diego Ivan desata la furia prehistórica, aplastando todo a su paso."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Diego Ivan, múltiples caminos posibles",
            "description": "Diego Ivan es un niño con TEA que ama los dinosaurios y los carritos."
        }
    },
    "yuya": {
        "evolutionType": "dynamic",
        "branches": {
            "alegria": {
                "alignment": "light", "phase": "phase4a",
                "label": "Diosa de la Alegría", "trigger": "nurture",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Yuya evoluciona en Diosa de la Alegría",
                    "altText": "Diosa de la Alegría — fuente de felicidad infinita",
                    "description": "Yuya irradia alegría pura, nutriendo la vida y la esperanza en todos."
                }
            },
            "caos": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Espíritu del Caos", "trigger": "devour",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Yuya evoluciona en Espíritu del Caos",
                    "altText": "Espíritu del Caos — entidad de desorden absoluto",
                    "description": "Yuya se transforma en un espíritu caótico que devora el orden del mundo."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Yuya, múltiples caminos posibles",
            "description": "Yuya es una niña feliz con chonguitos azules."
        }
    },
    "cherry": {
        "evolutionType": "dynamic",
        "branches": {
            "hada": {
                "alignment": "light", "phase": "phase4a",
                "label": "Hada Cerezo", "trigger": "care",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Cherry evoluciona en Hada Cerezo",
                    "altText": "Hada Cerezo — hada protectora del jardín de cerezos",
                    "description": "Cherry florece como un hada del jardín, cuidando toda la vida a su alrededor."
                }
            },
            "querubin": {
                "alignment": "dark", "phase": "phase4b",
                "label": "Querubín Oscuro", "trigger": "terrify",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Cherry evoluciona en Querubín Oscuro",
                    "altText": "Querubín Oscuro — ángel caído que aterroriza",
                    "description": "Cherry se transforma en un querubín oscuro con sonrisa picarona terrorífica."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Cherry, múltiples caminos posibles",
            "description": "Cherry es una bebé pequeñita con sonrisa picarona."
        }
    }
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_filename(filename):
    base = os.path.splitext(filename)[0]
    m = re.match(r"^(.+)_(phase[0-9a-z]+)$", base)
    if m:
        return m.group(1), m.group(2)
    return None, None


def phase_sort_key(phase):
    try:
        return PHASE_ORDER.index(phase)
    except ValueError:
        return 99


def collect_sprites():
    sprites = []
    for fname in sorted(os.listdir(SPRITES_DIR)):
        if not fname.endswith(".webp"):
            continue
        char, phase = parse_filename(fname)
        if not char or not phase:
            continue
        path = os.path.join(SPRITES_DIR, fname)
        with Image.open(path) as img:
            w, h = img.size
        sprites.append(
            {
                "filename": fname,
                "character": char,
                "phase": phase,
                "path": path,
                "width": w,
                "height": h,
            }
        )
    return sprites


def group_sprites(sprites):
    by_char = {}
    for s in sprites:
        by_char.setdefault(s["character"], []).append(s)
    for char_id in by_char:
        by_char[char_id].sort(key=lambda s: phase_sort_key(s["phase"]))
    return by_char


def frame_size_for_character(char_sprites):
    max_w = max(s["width"] for s in char_sprites)
    max_h = max(s["height"] for s in char_sprites)
    return max_w, max_h


def center_offset(frame_w, frame_h, sprite_w, sprite_h):
    return (frame_w - sprite_w) // 2, (frame_h - sprite_h) // 2


# ---------------------------------------------------------------------------
# Sheet generation
# ---------------------------------------------------------------------------

def create_character_sheet(char_sprites, frame_w, frame_h, padding=PADDING):
    n = len(char_sprites)
    sheet_w = n * frame_w + (n - 1) * padding + 2 * padding
    sheet_h = frame_h + 2 * padding
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))

    frames = []
    for i, s in enumerate(char_sprites):
        x = padding + i * (frame_w + padding)
        y = padding
        sprite = Image.open(s["path"]).convert("RGBA")
        ox, oy = center_offset(frame_w, frame_h, sprite.width, sprite.height)
        sheet.paste(sprite, (x + ox, y + oy), sprite)
        frames.append(
            {
                "phase": s["phase"],
                "x": x,
                "y": y,
                "width": frame_w,
                "height": frame_h,
                "spriteWidth": sprite.width,
                "spriteHeight": sprite.height,
                "spriteOffsetX": ox,
                "spriteOffsetY": oy,
            }
        )
    return sheet, frames


def build_all_sheets(by_char):
    os.makedirs(SHEETS_DIR, exist_ok=True)

    character_data = {}
    char_sheets_for_master = []

    for char_id in CHARACTERS:
        char_sprites = by_char.get(char_id["id"], [])
        if not char_sprites:
            continue
        frame_w, frame_h = frame_size_for_character(char_sprites)
        sheet, frames = create_character_sheet(char_sprites, frame_w, frame_h)

        rel_sheet_path = os.path.join("spritesheets", f"{char_id['id']}.webp")
        abs_sheet_path = os.path.join(ROOT, "slime-evolution", rel_sheet_path)
        sheet.save(abs_sheet_path, "WEBP")

        character_data[char_id["id"]] = {
            "id": char_id["id"],
            "name": char_id["name"],
            "sheet": rel_sheet_path,
            "frameWidth": frame_w,
            "frameHeight": frame_h,
            "frames": frames,
        }
        char_sheets_for_master.append((char_id["id"], sheet, frames))

    total_width = max(sheet.width for _, sheet, _ in char_sheets_for_master)
    total_height = (
        sum(sheet.height for _, sheet, _ in char_sheets_for_master)
        + (len(char_sheets_for_master) - 1) * PADDING
    )

    master = Image.new("RGBA", (total_width, total_height), (0, 0, 0, 0))
    master_frames = []
    y_cursor = 0

    for char_id, sheet, frames in char_sheets_for_master:
        master.paste(sheet, (0, y_cursor), sheet)
        for f in frames:
            master_frames.append(
                {
                    "character": char_id,
                    "phase": f["phase"],
                    "x": f["x"],
                    "y": y_cursor + f["y"],
                    "width": f["width"],
                    "height": f["height"],
                    "spriteWidth": f["spriteWidth"],
                    "spriteHeight": f["spriteHeight"],
                    "spriteOffsetX": f["spriteOffsetX"],
                    "spriteOffsetY": f["spriteOffsetY"],
                }
            )
        y_cursor += sheet.height + PADDING

    master_path = os.path.join(SHEETS_DIR, "master_sheet.webp")
    master.save(master_path, "WEBP")

    return character_data, master_frames, total_width, total_height


# ---------------------------------------------------------------------------
# Manifest
# ---------------------------------------------------------------------------

def enrich_character_v2(char_entry):
    """Add v2 evolution metadata to a character entry."""
    char_id = char_entry["id"]
    meta = EVOLUTION_META.get(char_id)

    # Determine core phases (everything before phase4)
    all_phases = [f["phase"] for f in char_entry["frames"]]
    core = [p for p in all_phases if not p.startswith("phase4")]

    if meta:
        char_entry["evolutionType"] = meta["evolutionType"]
        char_entry["corePath"] = core
        char_entry["branches"] = meta["branches"]
        if "accessibility" in meta:
            char_entry["accessibility"] = meta["accessibility"]
    else:
        # Fallback for unknown characters
        char_entry["evolutionType"] = "fixed"
        char_entry["corePath"] = core
        branch_phases = [p for p in all_phases if p.startswith("phase4")]
        char_entry["branches"] = {}
        for bp in branch_phases:
            suffix = bp.replace("phase4", "")
            alignment = "light" if suffix == "a" else "dark" if suffix == "b" else "neutral"
            char_entry["branches"][f"branch_{suffix}"] = {
                "alignment": alignment,
                "phase": bp,
                "label": f"{char_entry['name']} ({alignment.title()})",
                "trigger": "create" if alignment == "light" else "destroy",
                "branchType": "permanent"
            }

    return char_entry


def generate_manifest(character_data, master_frames, master_w, master_h):
    # Enrich each character with v2 evolution metadata
    characters_v2 = [
        enrich_character_v2(char) for char in character_data.values()
    ]

    manifest = {
        "version": "2.0.0",
        "generated": datetime.now(timezone.utc).isoformat(),
        "padding": PADDING,
        "characters": characters_v2,
        "masterSheet": {
            "url": "spritesheets/master_sheet.webp",
            "width": master_w,
            "height": master_h,
            "frames": master_frames,
        },
    }
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Index HTML
# ---------------------------------------------------------------------------

def generate_index_html(character_data):
    char_cards = []
    for char_id in CHARACTERS:
        data = character_data.get(char_id["id"])
        if not data:
            continue
        frames_html = "\n        ".join(
            f'<div class="frame" data-phase="{f["phase"]}" '
            f'style="width:{f["width"]}px;height:{f["height"]}px;'
            f'background-image:url(\'{data["sheet"]}\');'
            f'background-position:-{f["x"]}px -{f["y"]}px;">'
            f'<span class="label">{f["phase"]}</span></div>'
            for f in data["frames"]
        )
        char_cards.append(
            f"""
    <section class="character" data-character="{char_id['id']}">
      <h2>{data['name']}</h2>
      <div class="frames">
        {frames_html}
      </div>
    </section>"""
        )

    html = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Slime Legion — Sprite Atlas</title>
<style>
  :root {{
    --bg: #231F24;
    --fg: #E3E0A4;
    --accent: #896AB0;
    --muted: #9B8E6C;
    --card: #2e2a30;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; padding: 2rem;
    background: var(--bg); color: var(--fg);
    font-family: system-ui, sans-serif;
  }}
  h1 {{ color: var(--accent); }}
  .character {{
    margin: 1.5rem 0; padding: 1rem;
    background: var(--card); border-radius: 0.5rem;
  }}
  .frames {{
    display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;
  }}
  .frame {{
    background-repeat: no-repeat;
    image-rendering: pixelated;
    border: 1px solid var(--muted);
    position: relative;
  }}
  .label {{
    position: absolute; bottom: 2px; left: 2px; right: 2px;
    text-align: center; font-size: 10px; color: var(--bg);
    background: rgba(227,224,164,0.85); border-radius: 2px;
    pointer-events: none;
  }}
</style>
</head>
<body>
  <h1>🧬 Slime Legion — Sprite Atlas</h1>
  <p>Generated from <code>slime-evolution/sprites/</code> · <a href="sprite-manifest.json">sprite-manifest.json</a></p>
  {"".join(char_cards)}
  <script>
    // In a real game you would load `sprite-manifest.json` and render frames from it.
    // This page is a quick visual sanity-check.
  </script>
</body>
</html>
"""
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(html)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Collecting sprites...")
    sprites = collect_sprites()
    by_char = group_sprites(sprites)
    print(f"Found {len(sprites)} sprites across {len(by_char)} characters.")

    print("Building spritesheets...")
    character_data, master_frames, master_w, master_h = build_all_sheets(by_char)

    print("Writing manifest...")
    generate_manifest(character_data, master_frames, master_w, master_h)

    print("Writing index.html...")
    generate_index_html(character_data)

    print("Done.")
    print(f"  Sheets: {SHEETS_DIR}")
    print(f"  Manifest: {MANIFEST_PATH}")
    print(f"  Demo: {INDEX_PATH}")


if __name__ == "__main__":
    main()
