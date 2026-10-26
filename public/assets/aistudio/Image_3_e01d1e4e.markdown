---
name: The Scam Triangle Triage System
colors:
  surface: '#faf9fd'
  surface-dim: '#dbd9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7ec'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1b1b1f'
  on-surface-variant: '#454556'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f2f0f4'
  outline: '#767588'
  outline-variant: '#c6c4d9'
  surface-tint: '#3e41f2'
  primary: '#0a00a3'
  on-primary: '#ffffff'
  primary-container: '#1b14da'
  on-primary-container: '#a7aaff'
  inverse-primary: '#c0c1ff'
  secondary: '#bb0011'
  on-secondary: '#ffffff'
  secondary-container: '#e22525'
  on-secondary-container: '#fffbff'
  tertiary: '#1d3400'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d4c00'
  on-tertiary-container: '#7dc406'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#04006d'
  on-primary-fixed-variant: '#1f1bdc'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000a'
  tertiary-fixed: '#acf847'
  tertiary-fixed-dim: '#91db2a'
  on-tertiary-fixed: '#102000'
  on-tertiary-fixed-variant: '#304f00'
  background: '#faf9fd'
  on-background: '#1b1b1f'
  surface-variant: '#e3e2e6'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.12em
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-urgency cybersecurity and triage platform explicitly built to demystify, counter, and neutralize rampant psychological scam vectors in India (Digital Arrest scams, fake Mumbai Police/CBI Skype summons, spoofed FedEx/Customs narcotics extortion, and malicious WhatsApp financial APKs).

The brand visual language rejects sanitized corporate enterprise design in favor of an uncompromising **Retro-Cyberpunk / Brutalist Forensic Terminal** aesthetic directly inspired by early digital-defense interfaces and CRT monitor output. It blends cold, calming operational authority with urgent cryptographic clarity:

- **The Atmosphere:** A tactical operations desk. Phosphor-etched raster backgrounds with persistent CRT horizontal scanline banding across a muted slate-silver parchment tone.
- **Visual Tenets:** Heavy pixelated display letterforms, sharp stepped geometric 8-bit glyphs, cobalt/electric blue `#1b14da` structural framing, and monospace bracketed status headers (`[PROTOCOLE D'ALERTE : 1930]`, `[DIGITAL ARREST : STATUT INVENTÉ]`).
- **Psychological Effect:** Immediate de-escalation of panic. Scammers rely on manufactured urgency and artificial authority via video calls; this interface visually strips away their façade with raw forensic precision, making victims realize instantly: *this is a known algorithmic scam pattern, you are safe, do not transfer funds.*

## Colors

The palette operates on high-contrast tactical clarity. The default canvas simulates an anti-glare monochrome CRT display with subtle hardware scanline rasterization over a cool metallic silver-tinted slate parchment:

- **Primary Cobalt (`#1b14da`):** The signature electric pixel-blue. Used for structural pixel glyphs, top/bottom geometric framing motifs, high-priority interactive borders, active state selections, and critical system badges.
- **Secondary Crimson Alert (`#c80815`):** Reserved strictly for immediate anti-harm commands: `[NE PAS PAYER / DO NOT TRANSFER]`, kill-switch disconnection prompts, and simulated arrest debunking banners.
- **Tertiary Terminal Lime (`#84cc16`):** Neon lime accent used for verified state indicators, decrypted malicious APK analysis, and secondary pixel icons embedded inline in headers.
- **Base Canvas Silver (`#dcdfe4` / `#e5e7eb`):** Emulates a muted, matte CRT monitor surface crossed with alternating 1px/2px horizontal scanlines (`rgba(18, 19, 22, 0.08)` and `transparent`).
- **Neutral Dark Phosphor (`#121316`):** Deep charcoal-black for heavy pixel titles, bracketed monospace telemetry, and border structures. No soft diluted greys for critical text.

## Typography

The type system pairs raw, mechanical display density with monospaced forensic teletype:

- **Display & Headlines (`Space Grotesk`):** Rendered with crisp anti-aliasing disabling or bitmap-styled pixelated rendering engines where possible. Heavy letterforms echo vintage 1980s low-resolution computing manuals, giving undeniable weight to debunking proclamations.
- **Teletype, Labels & Body (`Space Mono`):** All systemic notifications, scam descriptions, victim action steps, and triage tags use monospaced letterforms. Monospaced layout enforces emotional detachment and methodical execution.
- **Bracket Notation Standard:** System tags, urgency markers, and field indicators must strictly appear wrapped in bracket format with full uppercase spacing (e.g., `[ACTION REQUISE : COUPER L'APPEL SKYPE]`, `[CODE INCIDENT : CBI-FAKE-092]`).
- **Inline Bitmap Badges:** Headlines routinely interleave colored 16x16 / 24x24 pixel icons (warning flames, pixelated shields, phone disconnects, padlocks) directly within the running sentence line height.

## Layout & Spacing

The layout adopts a rigid, centered column-grid surrounded by tactical framing motifs:

- **CRT Canvas Layer:** The body background applies a repeating vertical gradient scanline texture (`repeating-linear-gradient(0deg, rgba(18,19,22,0.06) 0px, rgba(18,19,22,0.06) 1px, transparent 1px, transparent 3px)`) that spans edge-to-edge.
- **Hero Arch Framing:** Main triage pages anchor top and bottom with geometric pixelated cobalt banners (stepped pixel arch wings and inverted focal pedestals) flanking centered bracket tags.
- **Grid Architecture:** 12-column rigid alignment on desktop; full single-column stepped stacks on mobile. Margins are framed by a continuous solid cobalt or dark phosphor 2px border framing the viewport like an oscilloscope screen.
- **Information Density:** High density with generous structural gutters. Triage information must not feel diluted; concise instructions appear in distinct pixel-bordered cells that guide the user step-by-step through incident logging without cognitive overload.

## Elevation & Depth

This system avoids soft Gaussian blurs, colored dropshadows, and modern float states. Visual depth is strictly mechanical, architectural, and rooted in hardware:

- **Stepped Pixel Borders:** Visual prominence is achieved via 2px to 3px solid borders in Cobalt (`#1b14da`) or Dark Phosphor (`#121316`).
- **Hard Offset Shadow (Brutalist Projection):** When an active card or emergency button needs elevation, it casts a zero-blur hard-edged drop offset shadow: `box-shadow: 4px 4px 0px 0px #1b14da` (or `#121316`).
- **Translucent Top HUD Bar:** The global navigation and emergency hotline banner (1930 Cyber Crime) uses a frosted slate-silver translucent overlay with an immediate 1px solid border (`background: rgba(220, 223, 228, 0.85); backdrop-filter: blur(8px)`), mimicking an illuminated heads-up monitor gauge.
- **Inverted Focus States:** Elements gain hierarchy by inverting their color space: a silver card turns cobalt with bright white pixel typography upon cursor lock or selection.

## Shapes

The shape philosophy is strictly **Sharp (`roundedness: 0`)**. 

- **Absolute Zero Radius:** All containers, buttons, tags, dialogs, inputs, and modal screens maintain sharp 90-degree corners (`border-radius: 0px`).
- **Stepped Pixel Geometry:** Decorative icons, divider lines, and frame headers use pixel-art stepping (e.g., 2px × 2px or 4px × 4px modular corner cutouts and symmetrical stepped temple-style crests).
- **Embedded Vignettes:** Rectangular photo thumbnails or evidence previews embedded within text blocks carry sharp 1px borders with zero corner radii.

## Components

### 1. Bracketed Status Badges & Chips
- **Structure:** Monospaced uppercase text enclosed within square brackets: `[STATUT : COMPROMIS]` or `[URGENCE : 1930]`.
- **Variants:**
  - *Alert:* Text `#c80815`, background transparent or `#c80815` at 10% fill, 1px border.
  - *Standard System:* Text `#1b14da`, border 1px solid `#1b14da`.
  - *Neutral Info:* Text `#121316`, border 1px solid `#121316`.
- **Iconography:** Optional 12x12 inline pixel glyph positioned immediately adjacent to the bracket.

### 2. Emergency Action Buttons
- **Primary [DISCONNECT & PRESERVE]:** Zero radius, bold `Space Mono`, background `#1b14da`, text `#ffffff`. Hard offset shadow `3px 3px 0px 0px #121316`. On hover/active: translate 2px 2px with shadow collapsed.
- **Destructive Panic Button:** Background `#c80815`, text `#ffffff`, solid 2px `#121316` border with blinking cursor indicator.
- **Secondary Ghost:** Background transparent, text `#121316`, border 2px solid `#121316`.

### 3. Triage Matrix Cards (Scam Identification)
- **Visuals:** Matte canvas background over scanlines, framed by a continuous 2px solid border. Top header strip features an inline pixel emblem (e.g., pixelated badge for Fake Police/CBI, parcel box for FedEx scam, APK payload gear for malicious links).
- **Debunking Strip:** Highlighted horizontal bar inside the card explicitly stating the legal reality in bold red brackets: `[FAIT : AUCUNE POLICE EN INDE N'EFFECTUE D'ARRESTATION SUR SKYPE]`.

### 4. Terminal Input Fields & Evidence Dropzones
- **Input Fields:** Flat rectangular fields with 2px solid `#121316` borders. Monospaced caret symbol (`>`) prepended to the placeholder. Fixed monospace typing font. Focus state turns border to `#1b14da` with a solid 2px cobalt outline.
- **File Inspector (APK / Screenshot Analysis):** A drag-and-drop zone with a dashed 2px border, crosshair corner markers (`+`), and an interactive diagnostic status log printing real-time file hashes.

### 5. Floating Triage HUD & Cybercrime Hotline (1930) Bar
- Positioned permanently at the top or bottom viewport edge. Contains the rapid one-touch action to dial the National Cyber Crime Reporting Portal (1930) alongside an instantaneous audio mute / call kill-switch command.