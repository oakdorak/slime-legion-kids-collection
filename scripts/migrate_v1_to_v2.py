#!/usr/bin/env python3
"""
migrate_v1_to_v2.py — Migrate sprite-manifest.json from v1 to v2 schema.

Adds evolution branching metadata while preserving all existing frame data.
v1 consumers can still read the `frames[]` array unchanged — v2 just adds
`evolutionType`, `corePath`, `branches`, and optional `accessibility` fields.

Usage:
    python scripts/migrate_v1_to_v2.py [--dry-run]
"""

import argparse
import json
import os
import sys
from copy import deepcopy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(ROOT, "slime-evolution", "sprite-manifest.json")
BACKUP_PATH = os.path.join(ROOT, "slime-evolution", "sprite-manifest.v1.backup.json")

# ---------------------------------------------------------------------------
# Character metadata — defines evolution lore & branching
# ---------------------------------------------------------------------------

CHARACTER_META = {
    "robbit": {
        "evolutionType": "fixed",
        "branches": {
            "paladin": {
                "alignment": "light",
                "phase": "phase4a",
                "label": "Robbit Paladin",
                "trigger": "protect",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Robbit evoluciona en Paladin, protector de la luz",
                    "altText": "Robbit Paladin — forma evolucionada de protección",
                    "description": "Robbit elige proteger a sus aliados y se transforma en un paladín radiante."
                }
            },
            "dark": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Dark Robbit",
                "trigger": "destroy",
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
            "description": "Robbit es un slime amarillo con goggles rosas, pelo morado y orejas de conejo. Evoluciona de blob a paladin o guerrero oscuro."
        }
    },
    "madrecerebro": {
        "evolutionType": "fixed",
        "branches": {
            "guardiana": {
                "alignment": "light",
                "phase": "phase4a",
                "label": "Madre Guardiana",
                "trigger": "protect",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Madre Cerebro evoluciona en Madre Guardiana",
                    "altText": "Madre Guardiana — protectora cósmica",
                    "description": "Madre Cerebro usa su intelecto para proteger y guiar a la legión."
                }
            },
            "destruccion": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Modo Destrucción",
                "trigger": "annihilate",
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
                "alignment": "light",
                "phase": "phase4a",
                "label": "Supernova",
                "trigger": "guide",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Chi-Wish evoluciona en Supernova, guía estelar",
                    "altText": "Supernova — explosión de luz guiadora",
                    "description": "Chi-Wish brilla con la intensidad de una supernova para guiar a los perdidos."
                }
            },
            "void": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Void",
                "trigger": "absorb",
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
            "description": "Chi-Wish es un slime estelar lavanda con antenas de estrella. Puede evolucionar en múltiples direcciones."
        }
    },
    "emmaruth": {
        "evolutionType": "dynamic",
        "branches": {
            "architect": {
                "alignment": "light",
                "phase": "phase4a",
                "label": "Architect Supreme",
                "trigger": "build",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Emma Ruth evoluciona en Architect Supreme, constructora maestra",
                    "altText": "Architect Supreme — maestra constructora vampírica",
                    "description": "Emma Ruth canaliza su poder vampírico para construir estructuras imposibles."
                }
            },
            "shadow_devourer": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Shadow Devourer",
                "trigger": "devour",
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
                "alignment": "light",
                "phase": "phase4a",
                "label": "Dino-Caballero",
                "trigger": "protect",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Diego Ivan evoluciona en Dino-Caballero, protector noble",
                    "altText": "Dino-Caballero — protector con armadura de dinosaurio",
                    "description": "Diego Ivan monta su dinosaurio como caballero noble, protegiendo a los más pequeños."
                }
            },
            "destructor": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Dino-Destructor",
                "trigger": "crush",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Diego Ivan evoluciona en Dino-Destructor, fuerza imparable",
                    "altText": "Dino-Destructor — dinosaurio de destrucción total",
                    "description": "Diego Ivan desata la furia prehistórica, aplastando todo a su paso."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Diego Ivan, múltiples caminos posibles",
            "description": "Diego Ivan es un niño con TEA que ama los dinosaurios y los carritos. Sus colores son rosa, azul y morado."
        }
    },
    "yuya": {
        "evolutionType": "dynamic",
        "branches": {
            "alegria": {
                "alignment": "light",
                "phase": "phase4a",
                "label": "Diosa de la Alegría",
                "trigger": "nurture",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Yuya evoluciona en Diosa de la Alegría, nutridora de vida",
                    "altText": "Diosa de la Alegría — fuente de felicidad infinita",
                    "description": "Yuya irradia alegría pura, nutriendo la vida y la esperanza en todos."
                }
            },
            "caos": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Espíritu del Caos",
                "trigger": "devour",
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
            "description": "Yuya es una niña feliz con chonguitos azules. Su energía puede crear alegría o caos."
        }
    },
    "cherry": {
        "evolutionType": "dynamic",
        "branches": {
            "hada": {
                "alignment": "light",
                "phase": "phase4a",
                "label": "Hada Cerezo",
                "trigger": "care",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Cherry evoluciona en Hada Cerezo, guardiana del jardín",
                    "altText": "Hada Cerezo — hada protectora del jardín de cerezos",
                    "description": "Cherry florece como un hada del jardín, cuidando toda la vida a su alrededor."
                }
            },
            "querubin": {
                "alignment": "dark",
                "phase": "phase4b",
                "label": "Querubín Oscuro",
                "trigger": "terrify",
                "branchType": "permanent",
                "accessibility": {
                    "ariaLabel": "Cherry evoluciona en Querubín Oscuro, ángel caído",
                    "altText": "Querubín Oscuro — ángel caído que aterroriza",
                    "description": "Cherry se transforma en un querubín oscuro con sonrisa picarona terrorífica."
                }
            }
        },
        "accessibility": {
            "ariaLabel": "Árbol de evolución de Cherry, múltiples caminos posibles",
            "description": "Cherry es una bebé pequeñita con sonrisa picarona. Puede convertirse en hada o en querubín oscuro."
        }
    }
}


def migrate(v1_manifest):
    """Convert a v1 manifest to v2 format."""
    v2 = deepcopy(v1_manifest)
    v2["version"] = "2.0.0"

    for char in v2["characters"]:
        char_id = char["id"]
        meta = CHARACTER_META.get(char_id)

        if not meta:
            # Unknown character — default to fixed with auto-generated branches
            char["evolutionType"] = "fixed"
            char["corePath"] = ["phase1", "phase2", "phase3"]
            char["branches"] = {
                "light": {
                    "alignment": "light",
                    "phase": "phase4a",
                    "label": f"{char['name']} (Light)",
                    "trigger": "create",
                    "branchType": "permanent"
                },
                "dark": {
                    "alignment": "dark",
                    "phase": "phase4b",
                    "label": f"{char['name']} (Dark)",
                    "trigger": "destroy",
                    "branchType": "permanent"
                }
            }
            continue

        char["evolutionType"] = meta["evolutionType"]
        char["corePath"] = ["phase1", "phase2", "phase3"]
        char["branches"] = meta["branches"]

        if "accessibility" in meta:
            char["accessibility"] = meta["accessibility"]

    return v2


def validate_migration(v1, v2):
    """Verify backward compatibility: all v1 frame data is preserved."""
    errors = []

    # Check all characters are present
    v1_ids = {c["id"] for c in v1["characters"]}
    v2_ids = {c["id"] for c in v2["characters"]}
    if v1_ids != v2_ids:
        errors.append(f"Character IDs changed: {v1_ids} → {v2_ids}")

    # Check all frames are identical
    for v1_char in v1["characters"]:
        v2_char = next((c for c in v2["characters"] if c["id"] == v1_char["id"]), None)
        if not v2_char:
            errors.append(f"Missing character: {v1_char['id']}")
            continue

        if v1_char["frames"] != v2_char["frames"]:
            errors.append(f"Frame data changed for {v1_char['id']}")

        if v1_char["sheet"] != v2_char["sheet"]:
            errors.append(f"Sheet path changed for {v1_char['id']}")

        if v1_char["frameWidth"] != v2_char["frameWidth"]:
            errors.append(f"frameWidth changed for {v1_char['id']}")

        if v1_char["frameHeight"] != v2_char["frameHeight"]:
            errors.append(f"frameHeight changed for {v1_char['id']}")

    # Check masterSheet is identical
    if v1["masterSheet"] != v2["masterSheet"]:
        errors.append("masterSheet data changed")

    # Validate new fields
    for v2_char in v2["characters"]:
        if "evolutionType" not in v2_char:
            errors.append(f"Missing evolutionType for {v2_char['id']}")
        if "corePath" not in v2_char:
            errors.append(f"Missing corePath for {v2_char['id']}")
        if "branches" not in v2_char:
            errors.append(f"Missing branches for {v2_char['id']}")

        # Verify branches reference valid phases
        known_phases = {f["phase"] for f in v2_char["frames"]}
        for branch_id, branch in v2_char.get("branches", {}).items():
            if branch["phase"] not in known_phases:
                errors.append(
                    f"Branch '{branch_id}' for {v2_char['id']} references "
                    f"unknown phase '{branch['phase']}' (known: {known_phases})"
                )

    return errors


def main():
    parser = argparse.ArgumentParser(description="Migrate sprite-manifest.json v1 → v2")
    parser.add_argument("--dry-run", action="store_true", help="Print v2 without writing")
    parser.add_argument("--input", default=MANIFEST_PATH, help="Input manifest path")
    parser.add_argument("--output", default=MANIFEST_PATH, help="Output manifest path")
    args = parser.parse_args()

    # Load v1
    with open(args.input, encoding="utf-8") as f:
        v1 = json.load(f)

    if v1.get("version", "1.0.0") == "2.0.0":
        print("⚠️  Manifest is already v2. Nothing to do.")
        sys.exit(0)

    print(f"📖 Loaded v1 manifest ({len(v1['characters'])} characters)")

    # Migrate
    v2 = migrate(v1)

    # Validate
    errors = validate_migration(v1, v2)
    if errors:
        print("❌ Migration validation failed:")
        for e in errors:
            print(f"   • {e}")
        sys.exit(1)

    print("✅ Migration validated — all v1 frame data preserved")

    # Stats
    dynamic_count = sum(1 for c in v2["characters"] if c["evolutionType"] == "dynamic")
    fixed_count = sum(1 for c in v2["characters"] if c["evolutionType"] == "fixed")
    total_branches = sum(len(c["branches"]) for c in v2["characters"])
    a11y_count = sum(1 for c in v2["characters"] if "accessibility" in c)

    print(f"   Characters: {len(v2['characters'])} ({fixed_count} fixed, {dynamic_count} dynamic)")
    print(f"   Branches: {total_branches} total")
    print(f"   Accessibility: {a11y_count}/{len(v2['characters'])} characters")

    if args.dry_run:
        print("\n--- DRY RUN — v2 manifest: ---")
        print(json.dumps(v2, indent=2, ensure_ascii=False))
        return

    # Backup v1
    if args.output == args.input:
        with open(BACKUP_PATH, "w", encoding="utf-8") as f:
            json.dump(v1, f, indent=2, ensure_ascii=False)
        print(f"💾 Backup saved: {BACKUP_PATH}")

    # Write v2
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(v2, f, indent=2, ensure_ascii=False)
    print(f"🚀 v2 manifest written: {args.output}")


if __name__ == "__main__":
    main()
