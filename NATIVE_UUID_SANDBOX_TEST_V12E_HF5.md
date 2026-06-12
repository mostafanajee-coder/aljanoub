# V12E-HF5 Custom Component UUID Sandbox Test

## 1. Executive Status
**SANDBOX READY / USER EDITOR SCREENSHOT REQUIRED**

## 2. Files Changed
- src/views/pages/index.twig (Added hidden sandbox native host)
- 	heme.json (Set to custom component UUID)
- NATIVE_UUID_SANDBOX_TEST_V12E_HF5.md (This file)
- REVIEW_NOTES_NATIVE_UUID_SANDBOX_V12E_HF5.txt

## 3. Test Identifier
**bfa87706-da82-40f0-92f8-8571356bcd02**

## 4. Why This Test Exists
In V12E-HF2, we discovered that explicitly using the schema path "home.v12-categories-grid" in 	heme.json failed. Salla's native engine rejected the identifier and fell back to injecting an ugly default "أحدث المنتجات" (Latest Products) section. This phase tests the hypothesis that Salla natively requires custom Twilight components to be identified exclusively by their UUID (key from 	wilight.json) when defined in 	heme.json.

## 5. Host Placement
A single {% component home %} engine call has been placed inside a hidden, zero-height, clipped container (.alj-v12e-hf5-native-sandbox-host).
- It exists solely to trigger the Salla backend's editor-detection logic.
- It is visually invisible.
- It will NOT alter the locked storefront visual prototype.

## 6. Current Expected User Test
The merchant must run a Salla Editor session on this branch and check:
1. Does the **Page Elements** sidebar list the "Dynamic Categories Grid V12"?
2. Does the **Add New Element** panel still offer the component?
3. If clicked, do the custom settings open?
4. **CRITICAL:** Looking at the storefront preview in the editor, does the ugly "أحدث المنتجات" (Latest Products) inject itself, or is the layout clean as expected?

## 7. Risk
This code exists ONLY in the temporary 12e-hf5-custom-uuid-sandbox branch. It is entirely isolated from the production master branch.

## 8. Rollback
If this experiment fails or causes regressions, restore the project by running:
git checkout master

To revert files while remaining on the sandbox branch:
git restore src\views\pages\index.twig theme.json

## 9. Final Classification
**UUID SANDBOX PREPARED / EDITOR RESULT PENDING USER SCREENSHOT**
