# SlimeRewardSystem — Developer Guide

## Instalación

Incluir el módulo antes del código del juego:

```html
<script src="../slime-evolution/reward.js"></script>
```

## Inicialización

```javascript
const reward = new SlimeRewardSystem({
  gameId: 'emotion-mirror',
  manifestUrl: '../slime-evolution/sprite-manifest.json'
});

await reward.init();
```

## Mostrar una recompensa

```javascript
await reward.showReward({
  characterId: 'chiwish',
  branchId: 'supernova',
  reason: '¡Excelente racha!',
  onClose: () => {
    // opcional: devolver foco al juego
    document.getElementById('play-again').focus();
  }
});
```

## Cerrar

```javascript
reward.closeReward();
```

## Accesibilidad

- El overlay usa `role="dialog"`, `aria-modal="true"` y `aria-label="Recompensa desbloqueada"`.
- Focus trap automático entre botón de cierre y fondo.
- `ESC` cierra el overlay.
- `aria-live="assertive"` interno anuncia reward a screen readers.
- Se restaura foco al elemento que abrió el reward.

## Compatibilidad

- Manifest v1.0.0: funciona con fallback a `phase4a` / `phase4b` directos.
- Manifest v1.1.0+: usa `branches[id].aliases[0]`.

## Extender a otro juego

1. Agregar `rewardPool` en `sprite-manifest.json` → `consumption.<gameId>`.
2. Incluir `reward.js` en el HTML del juego.
3. Llamar `reward.showReward()` en el hito deseado (victoria, racha, etc.).

## Notas

- El sistema no maneja persistencia (LocalStorage). Agregar `persist()` y `load()` en el juego si se requiere guardar progreso cross-session.
- Paleta Qtzl.cloud aplicada en overlay (`#231F24` bg, `#896AB0` accent, `#E3E0A4` text).
- Pixel art preservado con `image-rendering: pixelated`.
