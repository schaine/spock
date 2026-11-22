# Spock — Brand assets

Logo mark: **The Pointed S** — a geometric S formed by two opposing arcs with upward-pointing blade finials at each arm terminal. Black/white/grey only.

## Files

### `svg/` — Masters (import these into Figma)

| File | Use |
| --- | --- |
| `symbol-black.svg` | The S mark, black (#0C0D0D) — light backgrounds |
| `symbol-white.svg` | The S mark, white (#FFFFFF) — dark backgrounds |
| `symbol-accent.svg` | The S mark, cyan (#17E5E5) — CTAs, active states, flags |
| `lockup-horizontal-black.svg` | Symbol + SPOCK side by side — desktop headers |
| `lockup-horizontal-white.svg` | Same, white — dark headers |
| `lockup-stacked-black.svg` | Symbol above SPOCK — mobile / compact |
| `lockup-stacked-white.svg` | Same, white — dark mobile |

**Wordmark font:** Newsreader, weight SemiBold (600), letter-spacing −2% (−1.04px at 52px for horizontal; −0.76px at 38px for stacked). Load Newsreader from Google Fonts. The SVG carries the font-family and weight attributes; in Figma, verify the text layer reads "Newsreader / SemiBold / 600" and set letter-spacing to −2%.

**To convert strokes to paths in Figma:** select the S path → Object → Outline Stroke. Do this before publishing to your design system.

### `icons/` — Favicon and web icon package

Drop the contents of this folder into your `public/` directory. Copy the `<head>` snippet from `head-snippet.html` into your HTML `<head>`.

| File | Use |
| --- | --- |
| `favicon.ico` | Browser tab icon (16/32/48 px bundled) |
| `favicon.svg` | SVG favicon (modern browsers) |
| `favicon-16.png` | 16 × 16 |
| `favicon-32.png` | 32 × 32 |
| `favicon-48.png` | 48 × 48 |
| `apple-touch-icon.png` | 180 × 180, iOS home screen |
| `icon-192.png` | 192 × 192, Android / PWA |
| `icon-512.png` | 512 × 512, PWA splash |
| `maskable-512.png` | 512 × 512 with safe-zone padding, PWA maskable icon |
| `site.webmanifest` | Web app manifest (icons block) |
| `symbol-black-square.svg` | Padded square SVG for icon contexts |
| `symbol-black-favicon.svg` | Simplified SVG for tiny sizes |
| `symbol-black-app-icon.svg` | App-icon optimised SVG |

### `png/` — Raster exports (transparent background)

| File | Dimensions |
| --- | --- |
| `symbol-black-512.png` | 512 × 512 |
| `symbol-black-256.png` | 256 × 256 |
| `symbol-black-128.png` | 128 × 128 |
| `symbol-black-64.png` | 64 × 64 |
| `symbol-black-32.png` | 32 × 32 |
| `symbol-white-512.png` | 512 × 512 (white mark, transparent bg) |
| `symbol-white-256.png` | 256 × 256 (white mark, transparent bg) |
| `lockup-horizontal-black-1200.png` | 1200 × 417 |
| `lockup-stacked-black-640.png` | 640 × 520 |

## Colour

Design system tokens (Tailwind CSS 4 `@theme`):

| Token | Value | Use |
| --- | --- | --- |
| `white` | `#FFFFFF` | Page background, mark on dark |
| `light-grey` | `#F2F7F7` | Alternate surface |
| `grey` | `#677373` | Secondary text, borders |
| `black` | `#0C0D0D` | Primary text, strong labels, mark on light |
| `tertiary` | `#17E5E5` | Cyan accent — CTAs, active states, flags |

The `symbol-accent.svg` file uses `#17E5E5` and is intended for use on dark (`#0C0D0D`) backgrounds. The black and white variants remain ink-only by design — this avoids a colour position in a category where data credibility matters more than brand warmth.

## Typography

| Typeface | Role | Weights used |
| --- | --- | --- |
| Newsreader (Google Fonts) | Display / wordmark | Regular 400, SemiBold 600 |
| Urbanist (Google Fonts) | UI / body | Light 300, Medium 500 |

**Wordmark** (navigation, lockups): Newsreader SemiBold 600, letter-spacing −2%.
**Headings**: Newsreader Regular 400 (Heading-1/3) or SemiBold 600 (Heading-2).
**Body and labels**: Urbanist Light 300 (paragraphs) or Medium 500 (labels).

## Mark geometry (for reproduction)

```text
Two circular arcs, each radius 68 units, centred at (128, 89) and (128, 168)
in a 256 × 256 coordinate space.

Top arc:    CCW from (196, 89) to (60, 89)  — the upper C-curve
Spine:      diagonal from (60, 89) to (196, 168) — 30° from horizontal
Bottom arc: CW  from (196, 168) to (60, 168) — the lower C-curve

Stroke weight: 16 units  ·  linecap: butt  ·  linejoin: round

Finial (top):    triangle  (188,89) – (204,89) – (196,65)
Finial (bottom): triangle  (52,168) – (68,168) – (60,144)
Both finials point upward.
```
