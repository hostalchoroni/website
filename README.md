# Hostal Nova Colonial – website redesign

Three modern, responsive design proposals for
[hostalnovacolonial.github.io](https://hostalnovacolonial.github.io/), built as plain static
HTML/CSS/JS (no build step, no framework), ready for GitHub Pages.

| Path | Design |
|------|--------|
| `/` | Chooser page linking the three designs |
| `/caribe/` | 1 · Caribe – bright, tropical, rounded cards, floating WhatsApp button |
| `/colonial/` | 2 · Colonial – editorial serif, terracotta & indigo, arch-shaped photos |
| `/moderno/` | 3 · Moderno – dark, bento grid, carousels, app-style tab bar on mobile |

Shared files:

- `img/` – photos taken from the old Mobirise site
- `shared/base.css` – reset, accessibility helpers, lightbox styles
- `shared/site.js` – mobile menu, photo lightbox (keyboard + swipe), room filter,
  carousels, and the booking form, which composes a WhatsApp message or email
  (replaces the old Mobirise/Formoid form)

## GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
The site will be served at `https://hostalchoroni.github.io/website/`.

## Local preview

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```
