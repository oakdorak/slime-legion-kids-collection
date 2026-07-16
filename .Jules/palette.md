## 2026-07-16 - Accesibilidad para pseudo-elementos e interactivos
**Learning:** El código utiliza elementos `div` interactivos y botones de iconos con pseudo-elementos CSS `::after`. Estos son inaccesibles por defecto para lectores de pantalla y usuarios de teclado al no tener semántica ni estilos de foco.
**Action:** Asegurar que los `div` interactivos tengan `role="button"`, `tabindex="0"` y manejadores de eventos `onkeydown`. Los botones de iconos deben tener atributos `aria-label` descriptivos. Ambos requieren estilos `:focus-visible` explícitos para navegación por teclado.
