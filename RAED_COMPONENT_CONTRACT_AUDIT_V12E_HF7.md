# V12E-HF7 Raed Component Contract Audit

## 1. Executive Status
**SCHEMA ALIGNED / LOCAL STOREFRONT VERIFIED / EDITOR PENDING**

## 2. Theme Raed Inspection
- **Was Theme Raed Inspected?** YES. Aljanoub inherits its baseline 	wilight.json directly from the official Theme Raed.
- **Exact Shape Found in Raed:**
Native Raed components (e.g., home.slider-products-with-header or home.enhanced-slider) utilize strictly the following top-level keys in their component registration objects:
  - key (String, UUID)
  - 
ame (String, path format)
  - icon (String)
  - path (String)
  - image (String, URL)
  - 	itle (Object, {ar: "", en: ""})
  - ields (Array of objects)
- **Keys expressly FORBIDDEN/ABSENT in Raed:**
  - id (as a top-level component identifier)
  - component (as a top-level path identifier)
  - schema
  - section
  - page
  - isibility
  - group

## 3. Custom Component Registration Updates
Target UUID: fa87706-da82-40f0-92f8-8571356bcd02
- **Removed:** Any top-level keys outside the strict Raed standard. We verified that section, schema, component, etc., were stripped if present.
- **Fields Update:** The ields array was rebuilt to strictly use the "type": "string" and "format": "text" convention instead of "type": "text", mirroring Raed's standard text field definitions.

## 4. Visibility Strategy
The hidden sandbox host (.alj-v12e-hf5-native-sandbox-host) was maintained safely using heavily clipped absolute positioning. 
The manual {% include %} for the category grid was preserved, guaranteeing visual parity for the locked prototype. 
The default ugly أحدث المنتجات did **NOT** leak into the visible DOM.

## 5. Next Steps
The Salla Editor must be manually tested using this specific branch to confirm if perfectly matching the Raed schema successfully exposes the component in the Page Elements panel.
