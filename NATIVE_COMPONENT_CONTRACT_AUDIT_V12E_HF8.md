# V12E-HF8 Native Component Contract Audit

## 1. Baseline Audit Questions
- **Does the official/current project use key or id for custom components?**
  It uses key.
- **Is 	itle a string or object?**
  It is an object { "ar": "...", "en": "..." }.
- **Does it use path or component?**
  It uses path.
- **Does it use ields or schema?**
  It uses ields.
- **Does any verified component use section, page, isibility, or group?**
  No, none of the official Theme Raed components use these keys.
- **Does any verified component Twig include data-id="{{ component.id }}" or similar?**
  No. A global search of src/views/components confirms component.id is not used anywhere in the official Raed templates.
- **What does theme.json use for iews.home?**
  UUID key (fa87706-da82-40f0-92f8-8571356bcd02).
- **Is {% component home %} present anywhere?**
  Yes, inside src/views/pages/index.twig, currently wrapped in a hidden host container .alj-v12e-hf5-native-sandbox-host.
- **Is there any reason the editor would still be reading a non-synced server version?**
  Yes. Salla's Editor (Dashboard) relies on remote data. Local file changes (like modifying 	wilight.json) do NOT automatically push to the Salla servers via the local CLI salla theme preview. Syncing requires either pushing to a linked Github repository or publishing the theme.
