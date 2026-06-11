# V11A Dynamic Conversion Audit

## 1. Existing Component Architecture

**Locations:**
* Custom/Theme components: `src/views/components/home/*.twig`
* Theme Configuration: `twilight.json` (defines `features` and custom `components` schemas)
* Default Layout settings: `theme.json`

**Observations:**
Salla injects homepage content dynamically using the `{% widget 'homepage' %}` loop. This loop iterates over the sections configured by the merchant in the Salla dashboard and renders the corresponding `.twig` file from `src/views/components/home`.

## 2. Existing Component Inventory
The following files exist in `src/views/components/home/`:

* `brands.twig`: Renders brand logos.
* `custom-testimonials.twig` / `testimonials.twig`: Customer reviews.
* `enhanced-slider.twig` / `photos-slider.twig`: Hero sliders.
* `enhanced-square-banners.twig` / `square-photos.twig`: Promo banners.
* `featured-products-style1.twig`, `style2`, `style3`: Various product layouts.
* `fixed-banner.twig`: Static image banner.
* `fixed-products.twig`: Specific selected products.
* `latest-products.twig`: Recent items.
* `main-links.twig`: Quick links / Categories.
* `parallax-background.twig`: Decorative background.
* `products-slider.twig`: Scrolling product list.
* `slider-products-with-header.twig`: Products with a header block.
* `store-features.twig`: Benefits row (shipping, payments).
* `youtube.twig`: Video embed.

**Customization Safety:**
Most of these look safe to override since they are local to the theme (`src/`). However, completely replacing them might break existing data expectations (e.g. if Salla passes a specific `component` object with `component.products`). For standard components, cloning or carefully modifying the markup while keeping the variables intact is recommended.

## 3. Component Registration Mechanism
`twilight.json` governs how components are recognized:
* **Standard Features:** Keys like `component-products-slider` in the `features` array enable core Salla widgets.
* **Custom Components:** The `components` array in `twilight.json` defines entirely custom components with custom settings fields (e.g., `home.enhanced-slider`, `home.main-links`).

To create a brand new, editable section from the V10 design, we must either:
1. Overwrite an existing component `.twig` file.
2. Define a new custom component in the `components` array of `twilight.json` and create the corresponding `.twig` file.

## 4. V10 Static Sections -> Dynamic Mapping

| Static Section | Recommended Dynamic Mapping | Approach |
| :--- | :--- | :--- |
| **Header** | Move to `src/views/layouts/master.twig` or header component | Not a homepage widget. Defer to layout phase. |
| **Hero** | `home.custom-hero` | Create new custom component in `twilight.json`. |
| **Benefits Row** | `home.store-features` | Override existing `store-features.twig` to match V10 design. |
| **Categories** | `home.category-grid` | Create new component or override `main-links.twig`. |
| **Best Sellers** | `home.featured-products` | Override `featured-products-style1.twig` to use V10 card CSS while looping over real Salla products. |
| **Promo Banner** | `home.custom-promo` | Create new custom component. |
| **New Arrivals** | `home.latest-products` | Override existing component using V10 card CSS. |
| **Brands** | `home.brands` | Override existing `brands.twig`. |
| **Footer** | Move to `src/views/layouts/master.twig` or footer component | Not a homepage widget. Defer to layout phase. |

## 5. Safe Phased Conversion Plan

To prevent a blank page or breaking the live preview, the conversion must be phased. The `{% widget 'homepage' %}` loop must only be restored when components are ready.

* **V11B:** Create one small test component (e.g., `v10-promo.twig`) in `src/views/components/home`.
* **V11C:** Register this component in `twilight.json` and test it by rendering it manually in `index.twig` using Salla's `component()` helper function, rather than the global widget loop.
* **V11D:** Convert the Category and Benefits sections into dynamic components.
* **V11E:** Convert the Hero and Brands sections.
* **V11F:** Convert Product sections, ensuring Salla's product object properties (`product.name`, `product.price`, `product.image.url`) map perfectly to our V10 CSS classes.
* **V11G:** Finally, remove the static hardcoded HTML from `index.twig`, restore the `{% widget 'homepage' %}` tag, and configure the sections via the Salla dashboard.

## 6. Rollback Plan

If the dynamic conversion causes a fatal error, preview failure, or layout collapse, follow these steps to instantly restore the approved V10 static concept:

1. View the Git commit history to find the V10 backup commit hash (see `V10_STATIC_HOMEPAGE_BACKUP_NOTES.md`).
2. Run the following command to restore `index.twig`:
   `git checkout <V10_COMMIT_HASH> -- src/views/pages/index.twig`
3. If `twilight.json` modifications broke the theme, restore it:
   `git checkout <V10_COMMIT_HASH> -- twilight.json`
4. Commit the rollback.
