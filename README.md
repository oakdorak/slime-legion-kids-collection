# 🧬 Slime Legion — Kids Collection

**NeuroDivertidos** es el arsenal pedagógico de la **Slime Legion**: juegos terapéuticos diseñados para niños neurodivergentes (TEA, TDAH, Dislexia, Ansiedad), respaldados por ciencia de OpenAlex y forjados con soberanía técnica sobre NixOS.

**Paleta Qtzl.cloud:** `#231F24` Fondo · `#896AB0` Lavanda · `#9B8E6C` Oro Muted · `#E3E0A4` Crema · `#A8B28A` Verde Salvia

**📖 Lore:** Biblia del universo — personajes, historia y amenaza en [`LORE.md`](./LORE.md)

---

## 🎮 Juegos

| Juego | Carpeta | Target | Descripción |
|-------|---------|--------|-------------|
| 🥕 Mini Zanahoria | `mini-zanahoria/` | TEA/TDAH | Atención conjunta y resonancia emocional |
| ✏️ Abecedario Mágico V17 | `magic-alphabet/` | Dislexia | Caligrafía terapéutica con motor vectorial |
| ✈️ El Avión Azul | `el-avion-azul/` | TDAH | Coordinación motora y enfoque |
| 🪞 El Espejo Mágico | `emotion-mirror/` | TEA | Reconocimiento emocional — accesible por teclado |
| 🐉 El Dragón que Respira | `breath-trainer/` | Ansiedad | Regulación de ansiedad con respiración 4-4-6 |
| 🫧 El Cazador de Burbujas | `focus-trainer/` | TDAH | Entrenamiento de atención sostenida |
| 🌊 El Río de Palabras | `word-flow/` | Dislexia | Fluidez lectora |

Hub general: [`index.html`](./index.html) (NeuroDivertidos landing page)

---

## 🧬 Slime Evolution — Asset System

Sistema de evolución estilo Eevee donde cada personaje del equipo tiene un slime que pasa por 4 fases, bifurcándose en la Fase 4 entre **bondad** (crear/proteger) y **maldad** (destruir/devorar).

### Fases

| Fase | Nombre | Descripción |
|------|--------|-------------|
| 1 | **Blob** | Slime básico con rasgos del personaje |
| 2 | **Pikuniku** | Slime con extremidades |
| 3 | **Forma Completa** | El personaje en su máxima expresión |
| 4A | **Camino de Luz** ✨ | Evolución por bondad/protección |
| 4B | **Camino Oscuro** 💀 | Evolución por maldad/destrucción |

### Roster (7 personajes)

| Personaje | Tipo | Fase 4A | Fase 4B |
|-----------|------|---------|---------|
| 🐰 **Robbit** | Fija | Robbit Paladin | Dark Robbit |
| 🧠 **Madre Cerebro** | Fija | Madre Guardiana | Modo Destrucción |
| ⭐ **Chi-Wish** | Dinámica | Supernova | Void |
| 🧛 **Emma Ruth** | Dinámica | Architect Supreme | Shadow Devourer |
| 🦖 **Diego Ivan** | Dinámica | Dino-Caballero | Dino-Destructor |
| 🌸 **Yuya** | Dinámica | Diosa de la Alegría | Espíritu del Caos |
| 🍒 **Cherry** | Dinámica | Hada Cerezo | Querubín Oscuro |

> **Pat** aún no tiene slime character asignado.

### Assets (100% completos — 7 personajes × 5 fases = 35 sprites)

```text
slime-evolution/
├── charts/              # 7 evolution charts (PNG) — uno por personaje
│   ├── robbit_evolution.png
│   ├── madrecerebro_evolution.png
│   ├── chiwish_evolution.png
│   ├── emmaruth_evolution.png
│   ├── diegoivan_evolution.png
│   ├── yuya_evolution.png
│   └── cherry_evolution.png
├── sprites/             # 35 sprites individuales (WebP) — fuente de verdad
│   └── {character}_phase{1,2,3,4a,4b}.webp
├── spritesheets/        # Generados por scripts/pack_sprites.py
│   ├── {character}.webp       # 7 sheets individuales
│   ├── master_sheet.webp      # Atlas global
│   └── sprite-manifest.json   # Coordenadas y metadata
├── index.html           # Demo visual del atlas
└── README.md            # Lore y documentación detallada
```

### Regenerar spritesheets

```bash
python scripts/pack_sprites.py
```

---

## 📂 Estructura del Repo

```text
slime-legion-kids-collection/
├── index.html               # Hub NeuroDivertidos
├── README.md                # Este archivo
├── SOVEREIGN_SKILL_FORGE.md # Pipeline científico (Odysseus/OpenAlex)
├── .Jules/palette.md        # Learnings del agente Jules
├── mini-zanahoria/          # 🥕 Atención conjunta (TEA/TDAH)
├── magic-alphabet/          # ✏️ Caligrafía terapéutica (Dislexia)
├── el-avion-azul/           # ✈️ Coordinación motora (TDAH)
├── emotion-mirror/          # 🪞 Reconocimiento emocional (TEA)
├── breath-trainer/          # 🐉 Respiración 4-4-6 (Ansiedad)
├── focus-trainer/           # 🫧 Atención sostenida (TDAH)
├── word-flow/               # 🌊 Fluidez lectora (Dislexia)
├── slime-evolution/         # 🧬 Sprites, charts & spritesheets
├── scripts/                 # Herramientas (pack_sprites.py)
└── synthesis/               # Síntesis científicas (OpenAlex)
```

---

## 🎨 Convenciones para Contribuir

- **Todo el arte es pixel art** — consistente en todas las fases
- **Paleta Qtzl.cloud** obligatoria (ver arriba)
- **Sprites:** WebP, nombrados `{character}_phase{N}.webp`, van en `slime-evolution/sprites/`
- **Charts:** PNG, nombrados `{character}_evolution.png`, van en `slime-evolution/charts/`
- **Juegos:** HTML single-file, responsive, accesible por teclado, con `lang="es"` y meta description
- **Accesibilidad:** `role="button"`, `tabindex="0"`, `aria-label`, `onkeydown` para Enter/Space, `:focus-visible`, y `event.repeat` guard en todos los elementos interactivos custom
- Regenerar spritesheets después de agregar/modificar sprites: `python scripts/pack_sprites.py`

---

*Protocolo MAIAH: Aprender es una pelea que se gana riendo.* 🫡🚀🩺💎✨🥕🤡⚔️
