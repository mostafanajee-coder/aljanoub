# Category Data Source Audit Report (V12M)

## Phase Verdict: AUDIT ONLY

## Files Inspected
1. [v12-categories-grid.twig](file:///C:/Users/kingm/aljanoub/src/views/components/home/v12-categories-grid.twig) - Current static/customizer homepage categories component.
2. [index.twig](file:///C:/Users/kingm/aljanoub/src/views/pages/index.twig) - Homepage template structure and includes.
3. [latest-products.twig](file:///C:/Users/kingm/aljanoub/src/views/components/home/latest-products.twig) - Dynamic products list example.
4. [featured-products-style1.twig](file:///C:/Users/kingm/aljanoub/src/views/components/home/featured-products-style1.twig) - Tab-based products structure.
5. [featured-products-style3.twig](file:///C:/Users/kingm/aljanoub/src/views/components/home/featured-products-style3.twig) - Feature block layout.
6. [master.twig](file:///C:/Users/kingm/aljanoub/src/views/layouts/master.twig) - Layout master structure and global script variables.
7. [header.twig](file:///C:/Users/kingm/aljanoub/src/views/components/header/header.twig) - Navigation header and menu container.
8. [main-menu.js](file:///C:/Users/kingm/aljanoub/src/assets/js/partials/main-menu.js) - JavaScript defining `custom-main-menu` component and menu API.
9. [theme.json](file:///C:/Users/kingm/aljanoub/theme.json) - Layout and theme engine configuration.
10. [twilight.json](file:///C:/Users/kingm/aljanoub/twilight.json) - Customizer component field definitions.

---

## Category-Related Patterns Found

1. **Static/Customizer Fallback (`v12-categories-grid.twig`)**
   - The current homepage categories grid is hardcoded with 8 item slots. If the native Salla theme customizer engine is active, these are bound to fields like `item_1_icon`, `item_1_title`, and `item_1_url`.
   - Since `theme.json` is locked to `{"views":{"home":[]}}` and `{% component home %}` count is 0 (disabling the Salla native home engine), these customizer variables default to their static fallbacks: "القهوة" (☕), "التمور" (🌴), "الهيل" (🌿), etc.

2. **Native Page-Specific Objects (`pages/product/index.twig`)**
   - Salla natively passes a `category` object to category pages containing fields: `category.name`, `category.url`, `category.sub_categories`, and `category.image`. However, this is only available within product category pages and is not globally exposed on the home page context.

3. **Menu API Data (`salla.api.component.getMenus()`)**
   - The `<custom-main-menu>` Web Component retrieves store categories and custom links dynamically at runtime by invoking the Twilight JS SDK helper `salla.api.component.getMenus()`.
   - Each menu item object contains the fields: `id`, `title`, `url`, `image`, `icon`, `children` (for subcategories), and `products`.

4. **Component Builder Array (`main-links.twig`)**
   - Under the Salla native builder, categories are accessed via `component.categories` using `{% for cat in component.categories %}`. This is inactive on our custom codebase.

---

## Candidate Implementation Options for V12N

### Option A: Server-Side Twig Menu Parsing (Medium Risk)
Retrieve the store navigation menus directly inside Twig if Salla passes a global menu object.
*   **Pros:** Renders server-side instantly with SEO benefits.
*   **Cons:** Salla does not guarantee a global `menu` or `categories` array on `index.twig` without the home engine.

### Option B: Client-Side JS Dynamic Rendering (Low Risk) - RECOMMENDED
Define a custom Web Component (e.g., `<custom-categories-grid>`) that runs on the client side, fetches the category menu nodes via `salla.api.component.getMenus()`, and injects them dynamically.
*   **Pros:** Uses Salla's proven client-side SDK; bypasses Twig context limitations; guarantees compatibility.
*   **Cons:** Small delay in loading dynamic items (mitigated by retaining the static grid as a skeleton placeholder).

---

## Risk Analysis
- **Aesthetic Regression:** High risk if images or emojis are missing. Mitigated by maintaining a name-to-emoji mapping in JS or fallback default icons.
- **Performance:** Low risk when utilizing client-side fetch, as it runs asynchronously and does not block the primary page rendering.
- **Salla Engine Alignment:** Zero risk to native customizer since we continue to bypass `{% component home %}` and preserve `theme.json` settings.

---

## Confirmations
- **Storefront Mutation:** None. No changes were made to the storefront templates.
- **{% component home %} Count:** Verified to be exactly `0`.
- **theme.json:** Unchanged (`{"views":{"home":[]}}`).
- **twilight.json:** Unchanged.
- **Categories Section:** Remains static and visible.

## Rollback Plan
To discard the branch and revert the audit state:
```bash
git checkout master
git branch -D v12m-category-data-source-audit
```
