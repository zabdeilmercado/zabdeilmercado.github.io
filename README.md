# Zabdeil Mercado — portfolio redesign

A self-contained, responsive replacement for the existing GitHub Pages homepage. Open `index.html` directly, or run `python -m http.server 8765` from this folder.

## Files

- `index.html`: biography, projects, certificate links, and contact details
- `style.css`: responsive layout and visual design
- `script.js`: current copyright year; all navigation and disclosures work without JavaScript
- `portrait.png`: existing portrait from the original portfolio repository
- `favicon.svg`: new site icon

## Content to review

The draft uses your existing public biography and repository contents. It deliberately avoids stating graduation status, current employment, project ownership beyond association with your repositories, usage numbers, or commercial outcomes. Confirm your preferred professional title, current background, project contributions, and email before publishing. Project screenshots and live demos can be added when available.

## GitHub Pages

Copy these website files to the root of `zabdeilmercado/zabdeilmercado.github.io` on its publishing branch, keeping its existing Pages settings. No build step, dependencies, or external fonts are required. The replacement homepage does not use the previous BootstrapMade template or vendor assets. Original assets and other pages have been left in the working repository for review.

Published through the repository’s existing GitHub Pages setup.

## Dark theme and portrait update

The site uses a permanent dark navy theme. There is no theme switch or saved theme preference. `portrait-dots.png` replaces the photograph in the page; `portrait.png` remains the original source asset.

The portrait was made with the built-in image-generation tool. Final prompt: “Use case: style-transfer. Website portrait asset. Image 1 is the subject/edit target: preserve this man's face shape, short hair, forward-facing pose and shoulders. Image 2 is the style reference only, do NOT use its subject. Transform the man into a minimalist computational point-cloud portrait: fine widely spaced teal/cyan dots arranged in many gently undulating horizontal contour scanlines that describe his face and shoulders. Abstract yet faintly recognizable, understated like the reference, no solid photographic skin or clothing, no solid fill silhouette. Single centered head and shoulders, generous space, on perfectly flat deep navy #0b192d background, no gradient, no frame, no text, no border, no glow. Color of points #55d9c0 with varied dimness. Portrait composition 4:5.”
