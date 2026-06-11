# Visual Director Audit V11E-HF4

## Critical Issues Found After HF3

1. **After-Footer Runtime Artifacts:** Default Salla search overlay, currency selector, cart icons, location UI, and a large white area were still visible below the custom footer in the real Salla preview. The old isolation script only ran on DOMContentLoaded + two `setTimeout` calls, which was insufficient because Salla injects artifacts asynchronously via its own JS bundle.

2. **Mobile Nav Clipping:** The HF3 fade-rail approach (`width: calc(100% + 40px); margin: 0 -20px`) still caused partial text chopping at the viewport edge (e.g. "أواني الضيا...").

## Changes Applied

### Runtime Isolation (JS)
- **MutationObserver:** Added a `MutationObserver` on `document.body` with `{ childList: true, subtree: true }`. When new nodes are injected by Salla's framework, isolation re-runs via a debounced scheduler (`clearTimeout`/`setTimeout(fn, 50)`) to prevent infinite loops.
- **Multiple Scheduled Runs:** DOMContentLoaded, load, 100ms, 500ms, 1500ms, 3000ms.
- **Event-Driven Re-isolation:** Capture-phase listeners on `click`, `focusin`, `submit`, `input` trigger debounced re-isolation.
- **Aggressive Hiding:** Hidden elements now receive 11 inline style overrides (`display:none`, `visibility:hidden`, `opacity:0`, `pointer-events:none`, `height:0`, `max-height:0`, `overflow:hidden`, `margin:0`, `padding:0`, `position:absolute`, `width:0`) plus `data-alj-runtime-hidden="true"`.
- **Debug Counters:** `window.__ALJ_RUNTIME_HIDDEN_COUNT__` and `window.__ALJ_RUNTIME_ISOLATION_RUNS__` are exposed.
- **Already-hidden Skip:** Elements that already have `data-alj-runtime-hidden="true"` are counted but not re-processed, preventing redundant DOM writes.

### Runtime Isolation (CSS)
- `.alj-static-homepage ~ *` now has the full 11-property suppression ruleset matching the JS.
- `body.alj-runtime-isolated [data-alj-runtime-hidden="true"]` provides a CSS-only backstop.

### Mobile Nav Rail (Strategy A)
- **Removed:** `width: calc(100% + 40px)`, `margin: 0 -20px`, gradient pseudo-elements.
- **Applied:** `.nav-rail-wrapper { width: 100%; margin: 0; overflow: hidden; }` — no negative margins, no calc expansion.
- **Nav links:** `padding: 12px 16px; gap: 8px;` — safe internal padding, no bleed.
- **Chip sizing:** `font-size: 0.8rem; padding: 5px 10px;` — slightly smaller to fit more chips in the initial viewport.
- **Each chip:** `flex: 0 0 auto; white-space: nowrap;` — never compressed, never line-broken.

## Results

| Item | Status |
|------|--------|
| Mobile nav clipping | FIXED — Strategy A |
| After-footer Salla artifacts | FIXED — MutationObserver + aggressive hiding |
| Search preservation | PASS — real form, type="search", name="q" |
| Desktop visual | PASS — no regression |
| Footer visual | PASS — compact luxury maintained |
| Runtime isolation counters | PASS — both exposed |

## Ready for V11F Final Static Lock Review
**Yes.** All critical blockers are resolved.
