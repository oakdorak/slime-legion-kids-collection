# 🧬 Slime Legion — Evolution Charts

El sistema de evolución de la **Slime Legion**. Cada personaje del equipo tiene un slime que evoluciona a través de 4 fases, bifurcándose en la fase final entre **bondad** y **maldad** según sus decisiones ante la amenaza de la destrucción.

## 🎮 Sistema de Fases

| Fase | Nombre | Descripción |
|------|--------|-------------|
| 1 | **Blob** | Slime básico con rasgos del personaje |
| 2 | **Pikuniku** | Slime con extremidades, empieza a tomar forma |
| 3 | **Forma Completa** | El personaje en su máxima expresión |
| 4A | **Camino de Luz** ✨ | Evolución por bondad/protección |
| 4B | **Camino Oscuro** 💀 | Evolución por maldad/destrucción |

## 📋 Roster Completo

### Evolución Fija (paths definidos)

| Personaje | Fase 4A | Fase 4B |
|-----------|---------|---------|
| 🐰 **Robbit** | Robbit Paladin (Crear) | Dark Robbit (Destruir) |
| 🧠 **Madre Cerebro** | Madre Guardiana (Proteger) | Modo Destrucción (Hyper Beam) |

### Evolución Dinámica (estilo Eevee — múltiples branches)

| Personaje | Branch 1: 4A | Branch 1: 4B |
|-----------|-------------|-------------|
| ⭐ **Chi-Wish** | Supernova (Guiar) | Void (Absorber) |
| 🧛 **Emma Ruth** | Architect Supreme (Construir) | Shadow Devourer (Devorar) |
| 🦖 **Diego Ivan** | Dino-Caballero (Proteger) | Dino-Destructor (Aplastar) |
| 🌸 **Yuya** | Diosa de la Alegría (Nutrir) | Espíritu del Caos (Devorar) |
| 🍒 **Cherry** | Hada Cerezo (Cuidar) | Querubín Oscuro (Aterrar) |

> Los personajes dinámicos pueden tener más branches en el futuro, dependiendo de las interacciones y decisiones del equipo.

## 📁 Estructura

```
slime-evolution/
├── charts/              # Evolution charts completos (PNG)
│   ├── robbit_evolution.png
│   ├── madrecerebro_evolution.png
│   ├── chiwish_evolution.png
│   ├── emmaruth_evolution.png
│   ├── diegoivan_evolution.png
│   ├── yuya_evolution.png
│   └── cherry_evolution.png
├── sprites/             # Sprites individuales (WebP)
│   └── madrecerebro_phase{1-4b}.webp
└── README.md
```

## 🎨 Estilo Visual

- **Pixel art** consistente en todas las fases
- **Paleta Qtzl.cloud:** `#231F24` Fondo, `#896AB0` Lavanda, `#9B8E6C` Oro Muted, `#E3E0A4` Crema, `#A8B28A` Verde Salvia
- Layout: Fases 1→2→3 horizontal con bifurcación vertical en Fase 4 (A arriba / B abajo)
- Celdas con bordes redondeados y colores temáticos (azul=bondad, rojo=maldad)

## 🧠 Lore

La Fase 4 representa el momento en que cada slime siente la amenaza de la destrucción. Su evolución final depende de sus valores fundamentales:

- **Bondad → Camino de Luz:** Proteger, crear, nutrir, guiar
- **Maldad → Camino Oscuro:** Destruir, absorber, devorar, aniquilar

*Protocolo MAIAH: La evolución es una elección.* ⚔️🧬
