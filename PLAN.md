# PULSAR AUDIO — Pulsar Buds One Landing Page Plan

Single page, static HTML + CSS + vanilla JS. Three files: `index.html`,
`styles.css`, `script.js`. No framework, no build step, no stock photos.
The product is drawn inline in SVG.

---

## Design plan

### Concept

A product page built like a piece of hardware: matte charcoal ground, pearl
product surfaces, one mint signal. The page is quiet until the product moves.
No glass, no gradient cards, no decorative chrome.

### Color tokens

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0F1012` | Page ground, dark sections |
| `--case` | `#1B1D21` | Raised surfaces, nav, demo panel |
| `--pearl` | `#F2EFE9` | Light chapter, product body, text on dark |
| `--pulse` | `#19D3A2` | Only accent: LED, waves, CTAs, focus |
| `--mute` | `#8A9096` | Secondary text |
| `--error` | `#E5484D` | Form error only |
| `--line` | `rgba(242,239,233,.12)` | Hairlines on dark |
| `--line-ink` | `rgba(15,16,18,.14)` | Hairlines on pearl |

Colorways (swatches recolor bud + case live):

| Colorway | Bud | Tip | Case |
|---|---|---|---|
| Pearl | `#F2EFE9` | `#CFC9BE` | `#1B1D21` |
| Graphite | `#3A3D42` | `#26282C` | `#111214` |
| Mint | `#BFEAD9` | `#8FCBB8` | `#16211D` |

### Type

- **Sora 700** — display, tracking `-0.03em`, line-height `0.95`.
- **Inter 400/500** — body, line-height `1.6`, max line length 68ch.
- **JetBrains Mono 400/500** — spec labels and readouts only.

Type scale: hero `clamp(3rem, 7vw, 6.5rem)`; section `clamp(2rem, 4vw, 3.5rem)`;
body `clamp(1rem, 1.1vw, 1.125rem)`; labels `0.75rem`.

### Layout

Max width 1240px, gutters `clamp(20px, 5vw, 48px)`. Mobile-first, split at 900px.

```
NAV      PULSAR        Features  Sound  Specs        [Pre-order]

HERO     Hear everything.            ┌────────────────────┐
         Except the noise.           │      ◉  earbud     │
         Subcopy...                  │   )))  waves       │
         [Pre-order $89] [Hear diff] │   [case cropped]   │
         First batch: 1,000 pairs.   └────────────────────┘

FEATURES ┌──────────────┐  42 hours. Seriously.
         │   sticky     │  ───────────────────────
         │   product    │  Quiet on demand.
         │   (rotates   │  ───────────────────────
         │    ±3°)      │  No lag. No excuses.
         └──────────────┘  ───────────────────────
                           Calls that sound like you.
              ╭─ one mint ring glides to the active block ─╮

SOUND    [ ANC off | ANC on ]     ~~~~~ noisy → calm ~~~~~
         Tap to feel the quiet.   [ Play tone ]

SPECS    pearl chapter, engraved two-column table

COLORS   Pick your pair.   [Pearl] [Graphite] [Mint]
         large bud + case, recolors live

REVIEWS  auto-scrolling strip, pauses on hover / focus / button

CTA      The first 1,000 pairs ship in March.
         [ email ] [ Reserve my pair ]   checkmark success

FOOTER   PULSAR AUDIO. Designed in small batches.
         Support  Warranty  Privacy
```

Materials: radii 8–16px; shadows only under the bud, case, and form panel.
Pearl is used as a physical surface (spec sheet + color catalog + reservation
card), not as a generic warm background.

### Motion plan

- **Personality:** Energetic but restrained — expo-out, 100 / 180 / 300ms.
- **Hero, one orchestrated entrance (~400ms total):**
  LED 0ms → waves 60ms → headline 120ms → subcopy 180ms → buttons 240ms.
- **Ambient:** earbud float 6s, LED pulse 2.4s, glow drift 18s. Nothing else.
- **Scroll:** product stage is sticky; only the product rotates (−3° → +3°).
  A single mint ring glides between feature blocks (300ms). Text never parallaxes.
- **Micro:** press 0.97 (100ms), release overshoot (180ms); magnetic hero and
  form CTAs (max 4px); swatch scale pop 180ms.
- **Sound demo:** noisy SVG waveform when ANC off; 300ms morph to a calm wave
  when on. Optional 2s WebAudio tone only after a click.
- **Form:** error shake ±8px / 320ms + red border + `aria-live`; success
  checkmark stroke draws in 300ms.
- **Reduced motion:** static page — no float, pulse, glow, marquee, rotation,
  or waveform animation; ring jumps instantly; feedback remains textual.

### The one bold moment

**The pinned feature stage.** One earbud stays fixed while four claims scroll
past it; a single mint ring glides from claim to claim, and the product turns
only a few degrees. It is the only large motion after the hero — everything
else is micro-interaction or ambient.

### Avoid-list check

- No purple gradients; palette is brief-locked charcoal / pearl / mint.
- No glassmorphism cards; surfaces are solid with physical shadows.
- No emoji icons; icons are inline SVG or none.
- No identical three-card feature grid; features are a sticky editorial
  sequence, reviews are a moving strip.
- No fade-up on every heading; one hero entrance, then ring + product motion.
- No filler copy; only the supplied copy plus functional labels
  (`ANC off`, `ANC on`, `Play tone`, `Reserve my pair`).

### Build order

1. Semantic HTML with all copy, inline SVG symbols for bud, case, waves, check.
2. Mobile-first CSS: tokens, type, sections, product colorways.
3. JS by section: sticky feature ring + rotation, waveform/ANC/WebAudio,
   color picker, magnetic buttons, review pause, form validation.
4. Reduced-motion and no-JS passes.
5. Preview at 1440 / 768 / 390; self-review against the avoid list; fix.

### Acceptance checks

- Hero reads as one moment; no other section re-enters.
- Feature ring tracks the active claim; product rotation stays subtle.
- ANC toggle visibly flattens the waveform; audio only after click.
- Swatches recolor bud and case; keyboard operable; `aria-pressed` correct.
- Form error/success accessible and visible without relying on color alone.
- Readable with JS disabled; complete static page under reduced motion.
- No horizontal scroll at 390px; focus rings visible on every control.
