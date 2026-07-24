#!/usr/bin/env python3
"""
pack_sprites.py — Pack individual .webp sprites into per-character spritesheets
and a master spritesheet, plus generate sprite-manifest.json and a demo index.html.

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

def generate_manifest(character_data, master_frames, master_w, master_h):
    manifest = {
        "version": "1.0.0",
        "generated": datetime.now(timezone.utc).isoformat(),
        "padding": PADDING,
        "characters": list(character_data.values()),
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
