# 24yash.github.io

My personal site: https://24yash.github.io

It's a small static app with no build step: `index.html`, `assets/styles.css` and `assets/app.js`. GitHub Pages serves it from `main`.

- **Views:** home, system map, career trace, lab, now, 30-second version and contact. They're hash routes (`#map`, `#trace`, …).
- **Shortcuts:** ⌘K opens the jump menu, keys 1–7 switch views, P opens an email to me and T toggles the theme.
- **Live data:** `.github/workflows/leetcode.yml` runs `scripts/update_leetcode.py` every morning and commits `data/leetcode.json` when the numbers change.

Run it locally:

```bash
python3 -m http.server 4173
```
