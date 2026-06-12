# Product Card Rendering Audit (V12H-HF2)

## Problem Statement
During V12H, the real-product bindings successfully loaded the store products, but the generated layout was "huge", unstyled, and used raw/default Salla UI rather than the approved static prototype styles.

## Root Cause
1. **Component Display Rules:** Custom elements (like `v12-best-seller-card`) default to `display: inline`. Without explicit CSS forcing them to be block/flex, the internal flex layout collapses.
2. **Container Breakage:** `<salla-products-list>` generates a wrapper that intercepts our `.product-grid` styles. The CSS grid rules defined in `index.twig` applied to the wrapper itself, not the individual product cards, causing the cards to expand to 100% of the screen width (creating the "Huge product images" effect).
3. **Web Component Scoping & Native UI:** Salla's native `<salla-add-product-button>` generates its own internal styled button (using Shadow DOM or scoped styles), overriding standard `.p-add-btn` class selectors. Additionally, default unstyled `<a>` tags render as default browser blue links.

## Resolutions Applied
1. **Component Flex/Grid Rules:** Updated `v12-best-seller-card.js` to explicitly enforce `display: flex`, `flex-direction: column`, and `height: 100%` on its host element, and apply `.product-card` to itself.
2. **Container Injection:** Added explicit `<style>` block to `v12-best-sellers-grid.twig` to force the host `salla-products-list` element to adopt the precise `.product-grid` layout metrics (4 columns on desktop, 2 on mobile).
3. **Pill Button Overrides:** Added aggressive CSS variable and `::part(button)` overrides to `<salla-add-product-button>` to force it to adopt the visual appearance of our approved pill button, hiding Salla's native boxy UI.
4. **Link Cleanups:** Explicitly set anchor tag colors to `--primary-color` within the custom component, dropping the weak `inherit` property that was falling back to browser-blue.

## Validation Status
The component logic now outputs the exact HTML expected by the existing `index.twig` styles, ensuring real store products look indistinguishable from the static prototypes.
