## 2024-07-14 - Accesibilidad de teclado en `div` e iconos
**Learning:** El juego `magic-alphabet` usa elementos `div` personalizados para su botón de inicio y contenido CSS `::after` para controles de solo icono. Esto resulta en falta de soporte de teclado y nombres accesibles, impidiendo que usuarios con teclado interactúen.
**Action:** Al trabajar en elementos interactivos, agregar siempre `role="button"`, `tabindex="0"`, `aria-label` y manejadores `onkeydown` para elementos personalizados. Además, asegurar que se aplique CSS `:focus-visible` para crear anillos de enfoque visuales.
