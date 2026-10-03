# Zabdeil Mercado — Portfolio

A responsive, dependency-free portfolio published with GitHub Pages.

## Run locally

From the repository root:

```powershell
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## Repository files

- `index.html` — portfolio content and accessible page structure
- `style.css` — permanent dark theme, responsive layout, project cards, and visual effects
- `script.js` — site-wide animated background and interactive particle portrait
- `portrait-dots.png` — static portrait source and no-JavaScript fallback
- `favicon.svg` — custom Zab browser icon

The website uses plain HTML, CSS, and JavaScript. It has no package dependencies, build step, framework, external font, or retained template vendor files.

## Main features

- Responsive single-page layout
- Canvas-based character-field background
- Interactive dotted portrait with reduced-motion support
- Compact project cards linked to their GitHub repositories
- Accessible navigation, focus states, and semantic content

## Publishing

GitHub Pages serves the repository directly. Push the website files to the branch configured in the repository’s Pages settings.
