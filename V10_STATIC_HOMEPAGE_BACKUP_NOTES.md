# V10 Static Homepage Backup Notes

**Approved Static File Path:** 
`src/views/pages/index.twig`

**Current Commit Hash BEFORE Audit:**
932ca163dc2673a4839305ab3008b434bd353e22

**Current Commit Hash AFTER Audit (V11A):**
[To be added automatically by Git]

## Critical Warning
The file `index.twig` currently contains the approved, hardcoded V10 static concept. 
**DO NOT OVERWRITE** this file with the `{% widget 'homepage' %}` tag in future phases without verifying that you have this backup.

If the upcoming dynamic conversion (V11B-V11G) breaks the preview or results in a blank page, run the following command to instantly rollback to the V10 static state:

```bash
git checkout 932ca163dc2673a4839305ab3008b434bd353e22 -- src/views/pages/index.twig
```
