# Runtime Artifact Cleanup Audit (V12H-HF2)

## Problem Statement
After deploying V12H, user screenshots revealed multiple unwanted Salla runtime artifacts appearing at the bottom of the page (after the footer). These included "تعديل" (edit), X buttons, default search inputs, raw search icons, and other native Salla UI elements.

## Root Cause
1. **Corrupted Isolation HTML Source:** A previous automated file editing process (V12H-HF1) erroneously duplicated approximately 200 lines of static products, brands, and the custom footer HTML at the absolute bottom of `index.twig`. Because this duplicate HTML was physically outside the `.alj-static-homepage` bounds, it leaked out and manifested as duplicate social links (the "X button"), duplicate sections, and conflicting UI.
2. **Brittle CSS Isolation (`:has` selector):** The isolation script in `index.twig` previously relied heavily on `body:has(.alj-static-homepage)` to hide elements. Since `:has()` is not universally supported across all browsers (specifically older Android WebViews commonly used in native editor apps), the entire isolation CSS block was silently ignored on some environments, allowing native components (like `<salla-search>` and `<twilight-toolbar>`) to render visibly.

## Resolutions Applied
1. **HTML Deduplication:** Re-audited `index.twig` and completely purged the trailing duplicated 200 lines of code. Restored the single cleanly-terminated `{% endblock %}` format.
2. **Robust CSS Class Handshake:** Eliminated the usage of the `:has()` pseudo-class. Instead, the runtime script now synchronously adds an `.alj-home-page-active` class to the body.
3. **Explicit Native Component Hiding:** Added aggressive `display: none !important;` overrides tied directly to `body.alj-home-page-active` for known Salla injection vectors, including:
   - `<salla-search>`
   - `<salla-login-modal>`
   - `<salla-offer-modal>`
   - `#twilight-toolbar` (The "تعديل" edit button).

## Validation Status
The storefront is fully visually isolated once again. The correct `alj-static-homepage` wrapper bounds are maintained, and all underlying native Salla logic is successfully suppressed via bulletproof CSS class rules.
