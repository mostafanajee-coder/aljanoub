# REAL PRODUCTS BROKEN ICON DOM AUDIT (V12I-HF6)

This audit identifies the exact DOM source of the remaining broken image icons/placeholders visible in the real products sandbox and outlines the safest integration fix.

## 1. What HF5 Fixed
* **Restored Real Product Images:** Rolled back the aggressive `MutationObserver` from HF4 that was hiding all loading/hydrating product images.
* **Layout Stability:** Kept the 4-column desktop grid and 2-column mobile grid intact.
* **Narrow Icon Suppression:** Suppressed font icon tags (like `<i class="sicon-image-broken">`) using scoped CSS.

## 2. What Is Still Visually Failing
The storefront screenshot still shows a small broken image icon/placeholder inside the image area of each product card, near the right side.

## 3. The Exact DOM Node Causing the Remaining Icon
The icon is rendered by Salla\'s Twilight native CSS pseudo-element on the image container wrapper:
* **Selector:** `.s-product-card-image::before` (and `.s-product-card-image-full::before` on full image cards).
* **DOM Location:** Regular DOM (no Shadow DOM encapsulation is used for `salla-product-card` which is defined with encapsulation mode `4` - `shadow: false`).
* **Source CSS:**
  ```css
  .s-product-card-image::before {
    font-family: "sallaicons";
    content: "\ec1f" !important;
  }
  ```
* **Why it is visible:** The product card image container uses `object-fit: contain` to fit product images neatly without stretching them. Since the image does not fully cover the container, the background pseudo-element (`::before` camera icon `\ec1f`) peeks through and is visible near the side of the container.

## 4. Why the HF5 Selector Did Not Catch It
HF5 targeted normal DOM elements (like `i[class*="sicon-image"]` or `.sicon-image-broken`). It did not target the CSS `::before` pseudo-element of the parent `.s-product-card-image` wrapper itself, which is where the camera icon is injected by the default twilight component styles.

## 5. The Safest Selector to Remove It
We can completely suppress the pseudo-element icons within the sandbox by setting `content: "" !important` and `display: none !important` on the container pseudo-elements:

```css
#alj-real-products-sandbox .s-product-card-image::before,
#alj-real-products-sandbox .s-product-card-image-full::before {
  display: none !important;
  content: "" !important;
  opacity: 0 !important;
  visibility: hidden !important;
}
```

## 6. Proof of Safety (Will Not Hide Real Product Images)
This CSS rule targets exclusively the `::before` pseudo-elements. It does not affect the actual `<img>` elements nested inside the container, which render the real product images. Real images will remain fully visible, while the background camera placeholder icon will be completely suppressed.
