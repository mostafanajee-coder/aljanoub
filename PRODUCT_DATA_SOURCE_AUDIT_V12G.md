# V12G Product Data Source Audit

## Phase Verdict
Phase V12G is an audit-only phase. It confirms that Salla provides native web components (`<salla-products-list>`, `<salla-products-slider>`) and custom elements (e.g., `<custom-salla-product-card>`) to fetch and render real products. Real product binding is possible by defining a custom web component (like `wishlist-card.js` does) and passing it to `<salla-products-list>`. However, since `{% component home %}` is disabled to preserve stability, selecting specific products via the editor is not possible. We must either use dynamic sources like `source="latest"` or hardcode IDs.

## Git Status
- Current Branch: `v12g-product-data-source-audit`
- `{% component home %}` count: 0
- `theme.json`: `{"views":{"home":[]}}`

## Files Inspected
- `src/views/components/home/latest-products.twig`
- `src/views/components/home/featured-products-style1.twig`
- `src/views/components/home/featured-products-style3.twig`
- `src/views/pages/customer/wishlist.twig`
- `src/views/layouts/master.twig`
- `src/assets/js/partials/wishlist-card.js`
- `src/views/components/home/v12-best-sellers-grid.twig`
- `theme.json`

## Product-related Twig Snippets Found
- `<salla-products-list source="latest"></salla-products-list>` in `latest-products.twig`
- `<salla-products-list source="wishlist" row-cards product-card-component="custom-wishlist-card"></salla-products-list>` in `wishlist.twig`
- `<custom-salla-product-card shadow-on-hover product="{{product}}"></custom-salla-product-card>` in `featured-products-style1.twig`
- JavaScript custom element definition `customElements.define('custom-wishlist-card', WishlistCard);` in `wishlist-card.js`, using `this.product.name`, `this.product.image.url`, `this.product.price`.

## Recommended Product Rendering Strategy (V12H)
**Option A / Web Component Hybrid:** 
We should use `<salla-products-list source="latest" limit="4" product-card-component="v12-best-seller-card">`.
We will create `src/assets/js/partials/v12-best-seller-card.js` extending `HTMLElement`, which renders the exact HTML of the current `v12-best-sellers-grid.twig` product card inside its `render()` method, substituting static text with `${this.product.name}` and `${salla.money(this.product.price)}`.

## Reason Strategy is Safest
This approach completely avoids `{% component home %}` and `theme.json` modifications, ensuring zero risk of injecting Salla's default unstable components. It delegates data fetching to Salla's reliable frontend API (`salla-products-list`), and encapsulates our custom CSS/HTML cleanly inside a dedicated JavaScript Custom Element, preserving the current visual design perfectly. 

## Local vs Live Binding
Real product binding will be visible locally if the local Salla CLI is connected to the store (pulling real API data), but fully accurate rendering of store-specific products might require a live Salla preview to ensure all API endpoints and CORS rules function correctly with the store's domain.

## Next Implementation Plan (V12H)
1. Create `src/assets/js/partials/v12-best-seller-card.js` containing the custom element logic.
2. Register the JS file in `app.js` or `master.twig`.
3. Update `v12-best-sellers-grid.twig` to replace the 4 static `<div class="product-card">` elements with `<salla-products-list source="latest" product-card-component="v12-best-seller-card"></salla-products-list>`.
4. Test locally using Salla CLI.

## Rollback Command
If V12H fails, revert via:
`git checkout v12g-product-data-source-audit && git clean -fd`
