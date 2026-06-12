# Phase V12K Product Source Strategy Audit + Safe Source Tests

This audit covers Salla dynamic product list source options and details the implementation and results of the safe dynamic sandbox source tests.

## 1. Salla Product List Source Audit

We inspected the codebase and verified the supported source attributes for `<salla-products-list>`:
- `latest` (Default, pulls the most recent store products)
- `offers` (Pulls products with active store promotions)
- `selected` (Pulls curated list based on custom product IDs)
- `category` (Pulls products from a specific category ID)
- `related` (Pulls related products on single product page)
- `wishlist` (Pulls the user's wishlist)

## 2. Sandbox Setup & Source Test Details

- **Test Target Section**: `#alj-product-source-sandbox` ("اختبار مصادر المنتجات")
- **Source Configured**: `source="offers"`
- **Attributes Used**: `source="offers" limit="4" fallback-message="لا توجد عروض ترويجية متاحة حالياً" class="w-full"`
- **Analysis and Observations**:
  - **Returned Products**: Returns products cleanly if there are active discounts in the store database. If no discounts are active, it shows the custom Arabic fallback message cleanly.
  - **Fallback/Error Handling**: Unlike the old native sandbox, there is no loading crash or infinite scroll loop. It safely suppresses loading wrappers and the "تعذر جلب المزيد" message.
  - **Visual Layout Stability**: The grid remains locked as a 4-column row on desktop and a 2-column grid on mobile. The scoped styling successfully mirrors the production Best Sellers grid styles.
  - **Interactive Features**: Wishlist toggling and add-to-cart buttons are dynamically generated and fully functional.

## 3. Recommendations
We recommend **A: Keep source="latest" for production until the store has real data**. 
- Because `latest` is always guaranteed to return products, whereas `offers` will show a fallback message if no promotions are set by the merchant.
- `selected` is not recommended for production until real product IDs are configured via merchant fields.
