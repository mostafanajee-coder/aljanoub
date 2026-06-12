# V12E-HF4 Native Component Contract Audit

## 1. Executive Verdict
**THEME.JSON IDENTIFIER MISMATCH FOUND**

## 2. Current Production Safety State
- **Storefront restored:** YES
- **No active visible {% component home %}:** YES (0 matches found)
- **	heme.json home is []:** YES
- **Categories are code-rendered:** YES ({% include %})
- **Editor remains empty from user screenshot:** YES

## 3. File Evidence
- **index.twig:** The manual {% include 'components.home.v12-categories-grid' %} is safely rendering the section. No active native engine hosts remain.
- **theme.json:** Currently safely locked to {"views": {"home": []}}. Historically, before V12 experiments, it used simple aliases like "hero-slider", "features", "category-grid", "products-slider".
- **twilight.json:** Custom components have valid key (UUID) and path (e.g., home.v12-categories-grid), but no Salla alias exists for them. Native components in Twilight lack a 
ame property but have a path (e.g., home.enhanced-slider).
- **src/views/components/home:** Files exist for both native aliases (like slider-products-with-header.twig) and custom ones (12-categories-grid.twig).

## 4. Native Engine Failure Explanation
**What we tried in V12E-HF2:**
We injected <div class="... native host">{% component home %}</div> and manually set 	heme.json views.home to ["home.v12-categories-grid"].

**What Salla rendered:**
Salla rejected the identifier format and fell back to rendering a default, injected section titled "أحدث المنتجات" (Latest Products).

**Why it is classified fail:**
The Salla engine did not parse "home.v12-categories-grid" as a valid active component in 	heme.json. It discarded it and forced fallback products, breaking the visual design.

## 5. Editor Empty Explanation
The "Page Elements" sidebar only lists components that are *currently active* in 	heme.json and recognized by the Salla backend. Because our manual 	heme.json identifier was invalid (Salla either expects a UUID, an internal numeric ID, or for the component to be added strictly via the UI so the backend can generate the mapping), Salla saw an effectively "empty" active component list, leaving the Page Elements panel empty. The "Add New Element" panel works because it reads the *available features* directly from 	wilight.json.

## 6. Component Registration Matrix
| Component Type | File Name | twilight.json Path | theme.json Identifier |
|---|---|---|---|
| Native | slider-products-with-header.twig | home.slider-products-with-header | products-slider (Alias) |
| Native | enhanced-slider.twig | home.enhanced-slider | hero-slider (Alias) |
| Custom V12 | 12-categories-grid.twig | home.v12-categories-grid | **UNKNOWN** (Tried home.v12-categories-grid, failed) |
| Custom V12 | 12-hero-shadow.twig | home.v12-hero-shadow | **UNKNOWN** |

## 7. Known Safe Path
The **Code Include Path** ({% include %}) guarantees absolute visual control, prevents ugly Salla default injections, and locks the DOM. The tradeoff is the merchant cannot use the Salla editor UI to live-edit the visible sections.

## 8. Risky Path
The **Native {% component home %} Path** requires Salla's backend to properly recognize the 	heme.json identifier, inject the exact section, and not break the surrounding DOM. Without knowing the exact identifier format (UUID vs Alias) that the backend expects for custom components, manual 	heme.json mutation triggers fallback injections.

## 9. Proposed V12E-HF5 Sandbox Test
**Isolated Native Component Sandbox Test**

We must discover the correct 	heme.json identifier format without risking the production homepage.
- **Strategy 1:** Create a temporary Git branch. Add {% component home %} to a blank test page (src/views/pages/test.twig if route allowed, or completely empty index.twig). Manually set 	heme.json to use the UUID fa87706-da82-40f0-92f8-8571356bcd02 and see if Salla renders it.
- **Strategy 2 (Recommended):** The "User Driven Contract Discovery". In a temporary branch, we place an active {% component home %} inside index.twig (temporarily hiding everything else so it's a blank page). The user logs into the real Salla Editor, clicks "Add New Element", adds our custom Categories component manually through the UI, and saves. We then pull the remote 	heme.json via git or Salla CLI to see exactly what identifier Salla generated.
- **Strategy 3:** Accept the Safe Path permanently.

**Rollback command:** git checkout master

## 10. Final Classification
**AUDIT ONLY / STOREFRONT UNCHANGED / NATIVE CONTRACT NOT YET PROVEN**
