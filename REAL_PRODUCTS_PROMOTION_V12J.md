# REAL PRODUCTS PROMOTION TO PRODUCTION BEST SELLERS (V12J)

This document details the promotion of the dynamically bound real-product grid from the sandbox to the production storefront position of the "?????? ??????" (Best Sellers) section.

## 1. Context and Origin
* **Source Phase:** V12I-HF6
* **Objective:** Replace the static best seller placeholder cards with dynamic real store products, preserving the approved Al Janoub card layout, grid parameters, and visual polish, with background broken-image pseudo-element icons suppressed.

## 2. Files Changed
1. **`src/views/components/home/v12-best-sellers-grid.twig`**
   * Replaced the 4 static mock product cards with a dynamic `<salla-products-list>` component.
   * Included the exact CSS scoping under `#alj-best-sellers` to shape the list cards, wishlist buttons, prices, names, and add-to-cart buttons.
   * Suppressed background icon font pseudo-elements (`::before` / `::after` on `.s-product-card-image`) that were displaying camera icons behind contained images.
2. **`src/views/pages/index.twig`**
   * Removed the experimental include statement `{% include 'components.home.v12-raed-real-products-sandbox' %}`.
   * Ensured the sandbox code is no longer rendered and the dynamic real products appear only once in the production Best Sellers position.

## 3. Why This Is Safer Than `{% component home %}`
Using `{% component home %}` activates Salla's native homepage layouts, which injects their default widgets, headers, footers, and sidebars. This completely breaks the carefully crafted, custom storefront structure of Al Janoub.
By utilizing Salla's frontend web components (`<salla-products-list>`) and local custom elements, we fetch real store products dynamically via the API without triggering dashboard-managed layout insertions. This keeps our storefront layout fully isolated and robust.

## 4. Final Homepage Section Order
* **Header** (DIV storefront header)
* **Hero** (Include `v12-hero-shadow`)
* **Categories** (Include `v12-categories-grid`)
* **Best Sellers** (Dynamic real products in 4-column grid via `v12-best-sellers-grid`)
* **Promo Banner** (Promo banner code)
* **New Arrivals** (Static grid of new items)
* **Success Partners / Brands** (Grid of partners)
* **Footer** (DIV storefront footer)

## 5. Validation Checklist
- [x] Best Sellers shows real store products.
- [x] Best Sellers appears exactly once.
- [x] Sandbox test section does not render on the index page.
- [x] Product images load correctly.
- [x] Background camera placeholder icons are suppressed.
- [x] Product titles and prices render correctly.
- [x] Wishlist heart buttons are visible on the top-right and do not overlap titles.
- [x] Add-to-cart buttons are styled as rounded pills and work correctly.
- [x] Grid is 4 columns on desktop and 2 columns on mobile.
- [x] No "???? ??? ??????" error message is shown.

## 6. Rollback Command
If any issues arise, rollback to the previous stable V12I-HF6 branch:
```bash
git checkout v12i-hf6-broken-icon-dom-fix && git branch -D v12j-real-products-promotion
```
