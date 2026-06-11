# Dynamic Component Probe Audit V12A

## Phase
V12A Dynamic Component Probe / Safe Salla Editor Detection Test

## Files Inspected

| File/Path | Status |
|-----------|--------|
| `src/views/pages/index.twig` | Locked static homepage. No `{% component home %}` or `{% widget 'homepage' %}` present. |
| `src/views/pages/home.twig` | Contains a diagnostic placeholder page. No `{% component home %}` present. |
| `src/views/components/home/` | **EXISTS.** Contains 19 existing Salla Twilight home components. |
| `src/views/layouts/master.twig` | Uses `{% component 'header.header' %}` and `{% component 'footer.footer' %}`. No widget calls. |
| `twilight.json` | Contains `features` array (component feature flags) and `components` array (full component definitions with fields, keys, paths). |
| `theme.json` | **EXISTS.** Contains a simple `views.home` array listing sections. Actual Salla editor home component detection still depends on adding `{% component home %}` to the homepage rendering path. |

## Existing Component Structure

### `src/views/components/home/` (19 files)
- `brands.twig`
- `custom-testimonials.twig`
- `enhanced-slider.twig`
- `enhanced-square-banners.twig`
- `featured-products-style1.twig`
- `featured-products-style2.twig`
- `featured-products-style3.twig`
- `fixed-banner.twig`
- `fixed-products.twig`
- `latest-products.twig`
- `main-links.twig`
- `parallax-background.twig`
- `photos-slider.twig`
- `products-slider.twig`
- `slider-products-with-header.twig`
- `square-photos.twig`
- `store-features.twig`
- `testimonials.twig`
- `youtube.twig`

### Naming Pattern
- Kebab-case filenames (e.g., `store-features.twig`)
- Path referenced in `twilight.json` as `home.<filename-without-extension>` (e.g., `home.store-features`)
- Each component starts with a Twig comment block documenting variables
- Each renders a `<section class="s-block ...">` element

### `twilight.json` Registration Pattern
Components appear in two places:

1. **`features` array** — simple string flags like `"component-store-features"`, `"component-youtube"`, etc. These enable/disable the component feature.

2. **`components` array** — full component definitions with:
   - `key` (UUID)
   - `title` (bilingual object: `{ "en": "...", "ar": "..." }`)
   - `icon` (Salla icon class)
   - `path` (e.g., `"home.store-features"`)
   - `image` (CDN preview URL)
   - `fields` array (editor form schema)

## Critical Discovery: Why Editor Shows "No Customizable Elements"

### Root Cause
The Salla editor detects customizable homepage components by looking for the `{% component home %}` Twig tag in the homepage template. This tag tells the Twilight engine to:
1. Scan `src/views/components/home/`
2. Match them against `twilight.json` `components` registrations
3. Render them in the editor as draggable/editable sections

**Our `index.twig` does NOT contain `{% component home %}`.**

Without this tag, the Salla editor has nothing to scan — it correctly reports "لا يحتوي هذا الثيم على عناصر قابلة للتخصيص في الصفحة الرئيسية".

### The Original Raed `index.twig` Pattern
```twig
{% extends "layouts.master" %}

{% block content %}
{% component home %}
{% endblock %}

{% block scripts %}
<script defer src="{{ 'home.js' | asset }}"></script>
{% endblock %}
```

The `{% component home %}` tag is the **single required entry point** that connects the editor to the component system.

## Probe Component Status

### Created: `src/views/components/home/v12-probe.twig`
A minimal harmless test component following the exact naming and structural pattern of existing components. It does NOT affect the locked static homepage because:
1. It is only rendered when `{% component home %}` is called
2. Our `index.twig` does NOT contain `{% component home %}`
3. The component only becomes visible if added by the merchant via the editor

### Registered in `twilight.json`
- Added `"component-v12-probe"` to the `features` array
- Added a minimal component definition to the `components` array with:
  - Path: `home.v12-probe`
  - Title: "اختبار مكوّن V12" / "V12 Probe Component"
  - Simple text field for editor testing
  - No external assets, no CDN images, no scripts

## Whether `index.twig` Was Changed
**NO.** `index.twig` remains completely untouched. The locked static homepage is fully preserved.

## Whether Editor Will Detect the Probe
**UNLIKELY in current state.** The probe component file exists and is registered in `twilight.json`, but without `{% component home %}` in `index.twig`, the editor cannot render or detect any homepage components.

## Risks Found
1. Adding `{% component home %}` to `index.twig` will cause the Twilight engine to render dynamic Salla components INSIDE the locked static content block, potentially creating visual conflicts.
2. The runtime isolation script may inadvertently hide dynamically rendered Salla components if they appear outside `.alj-static-homepage`.

## Recommendation for V12B

### Required: Add `{% component home %}` to `index.twig`
This is the ONLY way to make the Salla editor detect homepage components. Two safe strategies:

**Strategy A — Coexistence (Recommended):**
Add `{% component home %}` INSIDE the `{% block content %}` but ABOVE the `.alj-static-homepage` div, wrapped in a hidden container. This allows the editor to detect components while keeping them visually hidden until the merchant explicitly adds/enables them. The static homepage remains the visible default.

```twig
{% block content %}
<div id="alj-dynamic-home" style="display:none;">
  {% component home %}
</div>
<!-- existing .alj-static-homepage unchanged -->
```

**Strategy B — Full Transition:**
Replace the static homepage content with `{% component home %}` and migrate each section to a proper Salla component. This is the full V12 conversion.

### Next Phase
**V12B Safe Homepage Widget Integration** — Add `{% component home %}` with Strategy A coexistence wrapper, then verify editor detection without visual regression.
