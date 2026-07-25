# RFC: Dynamic Evolution Branches in Slime Legion

## 1. Resumen

Propuesta para extender el sistema de evolución (`sprite-manifest.json`) con un modelo de branches dinámico estilo Eevee, retrocompatible con lectores v1.0.0, accesible para screen readers y consumible por juegos individuales (recompensas por sprite).

## 2. Motivación

El sistema actual (v1.0.0) solo describe un evolution path lineal:

```json
{ "phase": "phase4a" }
{ "phase": "phase4b" }
```

Esto no permite expresar lore alternativo (estacional, navideño, verano) ni múltiples variantes canon sobre un mismo personaje sin refactor completo.

## 3. Propuesta: `branches` en `sprite-manifest.json`

Agregar un objeto `branches` por personaje:

```json
{
  "branches": {
    "cherry": [
      {
        "id": "hada-cerezo",
        "label": "Hada Cerezo",
        "aliases": ["phase4a"],
        "description": "..."
      },
      {
        "id": "querubin-oscuro",
        "label": "Querubín Oscuro",
        "aliases": ["phase4b"],
        "description": "..."
      }
    ]
  }
}
```

## 4. Retrocompatibilidad

Se define un esquema de compatibilidad en la raíz del manifest:

```json
{
  "version": "1.1.0",
  "compatibility": {
    "minReaderVersion": "1.0.0",
    "fallback": "phases_map",
    "note": "Lectores v1.0.0 ignoran branches y consumption."
  }
}
```

- Readers v1.0.0: ignoran `branches` y `consumption`. Consumen `characters[]` y `masterSheet` directo.
- Readers v1.1.0+: usan `branches[id].aliases[0]` como fase de referencia y `consumption` para recompensas.

## 5. Accesibilidad

Cada branch expone `description` (screen reader) y `label` (UI con texto legible). Los rewards en UI usan `role="dialog"`, `aria-modal`, `aria-label` y focus trap. El sistema incluye un `aria-live="polite"` region en juegos para anunciar victoria/recompensa sin interrumpir al usuario.

## 6. Seasonal Branches (SLI-16)

Las branches pueden ser estacionales:

```json
{
  "id": "robbit-navidad",
  "label": "Robbit Noel",
  "season": "winter",
  "aliases": ["phase4a"],
  "description": "Edición navideña 2026"
}
```

Los lectores ignoran branches fuera de la temporada activa definida en config del juego.

## 7. Consumo por juegos

Cada juego declara su `rewardPool` en `consumption`:

```json
"consumption": {
  "emotion-mirror": {
    "rewardPool": ["chiwish.supernova", "emmaruth.architect"],
    "unlockConditions": {"minCorrectStreak": 5}
  }
}
```

## 8. Riesgos y Mitigaciones

| Risk | Mitigation |
|------|------------|
| Manifest grande | WebP + atlas reduce requests; manifest es ~5KB |
| Cache stale | Cache-Control: no-store en fetch de manifest desde juegos |
| Screen reader spam | aria-live polite + dialog pattern limitan interrupciones |
| Legacy games rotos | compatibility block garantiza fallback seguro |

## 9. Plan de Implementación

1. ✅ `branching_rfc.md` - este documento
2. ✅ `sprite-manifest.json` v1.1.0 con branches + consumption
3. ✅ `scripts/pack_sprites.py` extendido con constantes BRANCHES y GAME_CONSUMPTION
4. ✅ `slime-evolution/reward.js` motor core
5. ✅ Piloto `emotion-mirror` con integración funcional
6. 📄 `slime-evolution/REWARD_SYSTEM.md` developer guide
7. 🔄 Extender a rest 6 juegos via shared pattern

## 10. Estado Actual

- [x] RFC redactado
- [x] Manifest actualizado (v1.1.0)
- [x] Pack script actualizado
- [x] Reward engine + overlay accesible
- [x] Piloto emotion-mirror
- [ ] Resto de juegos integrados
- [ ] Tests automatizados
