# 2026-07-25 - Custom Div Interactions in Games

**Learning:** In highly interactive, custom-styled mini-games like Espejo Mágico, interactive elements are frequently built using `div`s with CSS animations rather than native `<button>`s to bypass default browser styles. While they have `onclick` and visual styling, they inherently lack semantic meaning, keyboard reachability, and key-press activation, rendering them entirely unusable for keyboard-only or screen-reader users.
**Action:** When working on custom interactive UI elements (like splash sigils or dynamically generated grid items), strictly ensure the manual addition of `role="button"`, `tabindex="0"`, `aria-label`, an explicit `onkeydown` handler for `Enter` and `Space`, and `:focus-visible` styling to mirror the innate accessibility of native buttons without breaking the bespoke aesthetics.

## 2026-07-26 - Splash Screen Accessibility

**Learning:** When addressing accessibility for custom `div` based elements functioning as buttons, specifically for screen splash components in mini-games, `event.preventDefault()` should be utilized inside the `onkeydown` handler for 'Space' keys. This prevents the default browser behavior of scrolling the page down, which disrupts the user experience and can cause layout shifts on smaller screens.
**Action:** When adding keyboard interactivity (`onkeydown`) to non-native interactive elements like custom splash sigils, include `event.preventDefault()` for the 'Enter' and 'Space' keys to maintain focus and prevent unintended page scrolling.

## 2026-08-20 - Accessible Dynamic Word Chips
**Learning:** In mini-games like El Río de Palabras, interactive elements (word chips) are often dynamically created `div`s without semantic button properties. This makes them completely invisible to keyboard and screen reader users during gameplay.
**Action:** When dynamically generating custom interactive `div` elements, programmatically inject `role="button"`, `tabindex="0"`, `aria-label`, and a keyboard event listener for `Enter` and `Space` (with `e.preventDefault()`) right after creation to ensure full accessibility.

## 2026-08-21 - Icon-Only Button Accessibility
**Learning:** In mini-games like Abecedario Mágico, native `<button>` elements are sometimes used for icon-only actions (like `#resetBtn` or `#themeBtn`) with icons injected via CSS `::after`. Although they inherently support keyboard navigation and activation, they lack programmatic text labels, making them unusable for screen reader users, and often have custom focus styling disabled (`outline: none`), which harms keyboard-only usability.
**Action:** Always verify that native icon-only buttons include descriptive `aria-label` or `title` attributes and enforce a custom `:focus-visible` styling (like `outline: 3px solid var(--accent); outline-offset: 2px;`) to ensure the focus state is clearly perceivable and semantically meaningful.
