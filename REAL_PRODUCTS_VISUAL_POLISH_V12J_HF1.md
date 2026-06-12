# V12J-HF1 Production Real Products Visual Polish

This phase polishes the newly promoted dynamic Best Sellers section on the Al Janoub storefront to achieve perfect visual layout and alignment, while strictly maintaining the zero component engine architecture.

## Visual Polish Details

1. **Equal Card Heights**: All product cards inside the Best Sellers grid are styled with `height: 100% !important` and the grid wrapper uses `align-items: stretch !important` to ensure all cards have equal height in each row.
2. **Centered Container Images**: Image boxes are constrained to `220px` height (`min-height: 220px !important; max-height: 220px !important`) with absolute centering using flexbox. The inner product image uses `max-width: 100% !important; max-height: 100% !important; object-fit: contain !important` to keep the aspect ratio intact and clean.
3. **Wishlist Icon Positioning**: Wishlist buttons are positioned absolutely at the top-right corner of the image containers by setting `position: relative !important` on `.s-product-card-image`. This isolates the absolute context to the image container itself, avoiding overlapping with the card's text.
4. **Clean Title Area**: The product name `.s-product-card-content-title a` is styled cleanly below the image area with a proper line-height of `1.4` and no possibility of overlapping the image.
5. **Consistently Aligned Price and Buttons**: The text wrapper `.s-product-card-content` uses flexbox layout. The title/subtitle wrapper `.s-product-card-content-main` is given `flex-grow: 1 !important` which dynamically pushes the pricing `.s-product-card-content-sub` and add-to-cart button `.s-product-card-content-footer` to the exact bottom of the card contents regardless of differing title lengths.
6. **Responsive Columns**: Preserved `repeat(4, 1fr)` for desktop layouts, `repeat(3, 1fr)` for medium screens, and `repeat(2, 1fr)` for mobile screens.
7. **Hidden Fallback/Load-more Elements**: All Salla native image camera-fallback icons and load-more error messages (`تعذر جلب المزيد`) are completely hidden.

## Verifications
- Best Sellers appears exactly once on the page.
- `theme.json` is preserved as: `{"views": {"home": []}}`
- `{% component home %}` count is exactly `0`.
