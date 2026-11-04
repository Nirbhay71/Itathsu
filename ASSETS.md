# Showroom presentation assets

The four original product JPEGs were supplied by the owner. They remain unmodified and can be viewed with the **Original photo** control on each product page. The two assets below were prepared using the built-in image-generation/editing tool, then encoded as WebP for delivery. No external stock photographs were added.

These AI-prepared cutouts are visual interpretations of the supplied photos. Small product details may differ, and hidden parts have been completed by the model. Use verified commercial product cutouts before selling actual stock. The original-photo view is retained for comparison.

## Transparent watch atlas

- Project path: `client/public/images/watch-cutouts-v2.webp`
- Source: four owner-supplied photos, in catalogue order: Noir, Argent, Aureum, Sable.
- Alpha transparency is preserved.
- Each product's `showroomSlice` selects its own part of the atlas. These values are specific to this image; omit `showroomSlice` when using standalone cutouts.

Prompt:

> Use case: background-extraction. Create ONE transparent PNG product cutout atlas for a website, wide landscape canvas, exactly FOUR EQUAL WIDTH COLUMNS in a single horizontal row. Input images 1 through 4 are edit targets. Place exactly one isolated watch in each equal column in the SAME ORDER: 1 rose-gold green-dial leather watch, 2 blue-dial silver bracelet watch, 3 gold and silver ornate watch, 4 dark-dial cushion-case leather watch. Remove ONLY surrounding background, display stands, fabric, cushions and props. Preserve each actual watch's photographed appearance, design, dial, hands, strap, finish and perspective as faithfully as possible. Do not redesign the watches. Within each column center the corresponding watch, fit its complete photographed silhouette without clipping, leave transparent margins on all sides and between products. Watches should have similar visual weight, with their dials at a similar vertical level. No floor, no platform, no glow, no cast shadow, no labels, no added text. Actual alpha transparency, not a painted checkerboard. This is a single sprite atlas: each column must contain ONLY its own watch so CSS can display each quarter separately. Make the overall image aspect ratio 2:1, with four portrait cells.

The output's spacing was not perfectly equal, so the catalogue records measured slice boundaries rather than assuming equal columns.

## Empty showroom alcove

- Project path: `client/public/images/showroom-alcove-v2.webp`
- Style reference: the stone alcoves visible in the owner's supplied screen recording.
- No reference video frames or third-party website logos are shipped in the project.
- The alcove is a static backplate; product reflections and hover lighting are composited by CSS.

Prompt:

> Use case: product-mockup. Asset type: EMPTY architectural display alcove backplate for a website, not a website screenshot. The attached screen recording frame is ONLY a style reference for the dark perfume showroom visible on its monitor. Create just ONE empty tall portrait display niche, perfectly frontal centered view, no product. Photorealistic luxury showroom architectural render. Deep black rough-hewn basalt / dark veined marble back wall, subtle organic veins and uneven tactile stone texture, narrow black metal vertical side reveals with faint silver edge highlights, one tiny recessed ceiling spotlight exactly centered at the very top. The spotlight softly grazes the rock surface, bright only in a small area near the top and fading downwards. Deep dramatic black shadows near the sides, subtle cool lavender undertone like the reference. NO opaque triangular light shape, only physically realistic soft illumination. The wall extends from the top to precisely 77 percent down the image. At 77 percent there is a razor-thin polished black shelf edge; the bottom 23 percent is a glossy black reflective plinth/floor, fading into darkness. Make it portrait aspect ratio 1:2. Full-bleed alcove, no margins around it. Keep it dark and cinematic; the wall must not become light grey. Absolutely empty: no watch, no perfume, no bottle, no product, no figure, no writing, no logo, no signage, no Instagram interface or phone. This image will be reused behind different isolated product cutouts.

### Stone gallery v3
`client/public/images/stone-gallery-v3.png` was generated using the built-in image generation tool with `detailes.jpeg` as the architecture reference. It supplies the continuous stone wall, four carved openings, downlights and architectural reflections. Watches, product reflections, labels and hover colour remain live elements.
Prompt: Create a photorealistic landscape luxury website architecture background matching only the perfume website on the reference monitor. One almost black rough basalt wall, four identical tall narrow empty rectangular niches carved into it, centered at 20%, 40%, 60%, 80%; openings approximately 12% wide, top 18%, bottom 73%. Frontal camera, no metal frames or bevelled picture frames, deep dark glossy inner side walls with thin reflected light, one tiny ceiling downlight per niche, white cone on rough back wall, continuous black glossy floor reflecting entire niches. No products, people, monitor, phone, social UI, logos or text.
