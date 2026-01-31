# Water Plant Safety Monitor - Visual Identity Colors

## Primary Brand Colors

### Cyan/Teal (Primary Accent)
- **Hex**: `#00E3FF`
- **RGB**: `rgb(0, 227, 255)`
- **RGBA**: `rgba(0, 227, 255, 1)`
- **Usage**: Primary UI elements, borders, glows, highlights, focus states
- **Variations**:
  - 75% opacity: `rgba(0, 227, 255, 0.75)` - Active elements
  - 50% opacity: `rgba(0, 227, 255, 0.5)` - Focused borders
  - 30% opacity: `rgba(0, 227, 255, 0.3)` - Glows/shadows
  - 20% opacity: `rgba(0, 227, 255, 0.2)` - Hover states
  - 15% opacity: `rgba(0, 227, 255, 0.15)` - Subtle hover
  - 10% opacity: `rgba(0, 227, 255, 0.1)` - Background panels

### Dark Cyan (Secondary)
- **Hex**: `#034078`
- **RGB**: `rgb(3, 64, 120)`
- **RGBA**: `rgba(3, 64, 120, 1)`
- **Usage**: Borders, dividers
- **Variations**:
  - 25% opacity: `rgba(3, 64, 120, 0.25)` - Subtle borders

---

## System State Colors

### Safe Green
- **Hex**: `#57FF1A`
- **RGB**: `rgb(87, 255, 26)`
- **RGBA**: `rgba(87, 255, 26, 1)`
- **Usage**: Safe status indicator, success states
- **Variations**:
  - 75% opacity: `rgba(87, 255, 26, 0.75)` - Status lights

### Warning Amber
- **Hex**: `#FFBF00`
- **RGB**: `rgb(255, 191, 0)`
- **RGBA**: `rgba(255, 191, 0, 1)`
- **Usage**: Warning status, alerts
- **Variations**:
  - 75% opacity: `rgba(255, 191, 0, 0.75)` - Status lights

### Critical Red
- **Hex**: `#FF1A1A`
- **RGB**: `rgb(255, 26, 26)`
- **RGBA**: `rgba(255, 26, 26, 1)`
- **Usage**: Critical alerts, danger states, pump severed
- **Variations**:
  - 75% opacity: `rgba(255, 26, 26, 0.75)` - Status lights

---

## Text Colors

### Primary White
- **Hex**: `#FFFFFF`
- **RGB**: `rgb(255, 255, 255)`
- **Usage**: Primary text, headings
- **Variations**:
  - 50% opacity: `rgba(255, 255, 255, 0.5)` - Chart borders/grid lines
  - 30% opacity: `rgba(255, 255, 255, 0.3)` - Subtle grid lines

### Off-White
- **Hex**: `#EFEFEF`
- **RGB**: `rgb(239, 239, 239)`
- **Usage**: Secondary text, button labels

### Chart Bar Blue
- **Hex**: `#BFECFF`
- **RGB**: `rgb(191, 236, 255)`
- **Usage**: Chart bars, data visualization

### Full Cyan
- **Hex**: `#00FFFF`
- **RGB**: `rgb(0, 255, 255)`
- **Usage**: Dividers, accent lines
- **Variations**:
  - 25% opacity: `rgba(0, 255, 255, 0.25)` - Divider lines

---

## Background Colors

### Deep Black
- **Hex**: `#000000`
- **RGB**: `rgb(0, 0, 0)`
- **RGBA**: `rgba(0, 0, 0, 1)`
- **Usage**: Base background (before glitch effect)
- **Variations**:
  - 80% opacity: `rgba(0, 0, 0, 0.8)` - Vignette overlay
  - 50% opacity: `rgba(0, 0, 0, 0.5)` - Panel overlays
  - 30% opacity: `rgba(0, 0, 0, 0.3)` - Settings panels
  - 15% opacity: `rgba(0, 0, 0, 0.15)` - Scanlines

### Dark Blue Gradient
- **Colors**:
  - Start: `#0a0a0f` - Very dark blue-black
  - Middle: `#12121a` - Dark blue-grey
  - End: `#0a0a12` - Very dark blue-black
- **Usage**: Main background gradient (in glitch effect)

### Dark Teal
- **Hex**: `#0a0e1a`
- **RGB**: `rgb(10, 14, 26)`
- **Usage**: Fallback dark background

---

## Glitch Effect Colors

### Cyan Radial Gradients
- **Primary**: `rgba(0, 255, 255, 0.15)` - 30% at 40% ellipse
- **Secondary**: `rgba(0, 255, 255, 0.10)` - 70% at 60% ellipse
- **RGB Split 1**: `rgba(0, 255, 255, 0.20)` at 50% center
- **RGB Split 2**: `rgba(255, 0, 0, 0.18)` at 50% center (red channel)

### Slice Glitch
- **Color**: `rgba(0, 255, 255, 0.30)` - Horizontal slice effect
- **Shadow**: `rgba(0, 255, 255, 0.50)` - Box shadow glow

---

## Typography

### Font Family
- **Primary**: `'Electrolize', sans-serif`
- **Fallback**: `sans-serif`
- **Source**: Google Fonts

### Font Sizes
- **Mobile Small**: `text-base` (16px)
- **Mobile Large**: `text-xl` (20px)
- **Desktop Small**: `text-lg` (18px)
- **Desktop Medium**: `text-2xl` (24px)

---

## Shadows and Glows

### Cyan Glow
- `box-shadow: 0 0 10px currentColor` - For status lights
- `box-shadow: 0 0 20px rgba(0, 227, 255, 0.3)` - For focused states
- `text-shadow: 0 0 10px rgba(0, 255, 157, 0.5)` - For glowing text

---

## Usage Guidelines

### Button States
```css
/* Default */
background: rgba(0, 227, 255, 0.1);
border: 4px solid rgba(3, 64, 120, 0.25);

/* Hover */
background: rgba(0, 227, 255, 0.15);

/* Focused/Active */
background: rgba(0, 227, 255, 0.2);
border: 4px solid rgba(0, 227, 255, 0.5);
box-shadow: 0 0 20px rgba(0, 227, 255, 0.3);
```

### Panel Containers
```css
background: rgba(0, 227, 255, 0.1);
backdrop-filter: blur(sm);
border: 4px solid rgba(3, 64, 120, 0.25);
border-radius: 8px;
```

### Divider Lines
```css
height: 1px;
background: rgba(0, 255, 255, 0.25);
```

---

## Accessibility Notes

- **Contrast Ratios**: All text meets WCAG AA standards against dark backgrounds
- **Color Blindness**: State colors (green/amber/red) should always be paired with text labels
- **High Contrast Mode**: System maintains readability with increased opacity values

---

## Export Formats

### For Design Tools (Figma, Sketch, Adobe XD)
```
Primary Cyan:     #00E3FF
Dark Cyan:        #034078
Safe Green:       #57FF1A
Warning Amber:    #FFBF00
Critical Red:     #FF1A1A
White:            #FFFFFF
Off-White:        #EFEFEF
Chart Blue:       #BFECFF
Divider Cyan:     #00FFFF
Deep Black:       #000000
```

### For CSS/Tailwind
```css
--color-primary: #00E3FF;
--color-secondary: #034078;
--color-safe: #57FF1A;
--color-warning: #FFBF00;
--color-critical: #FF1A1A;
--color-text-primary: #FFFFFF;
--color-text-secondary: #EFEFEF;
--color-chart: #BFECFF;
--color-divider: #00FFFF;
--color-bg: #000000;
```

### For Branding/Marketing
- **Primary Brand Color**: Cyan (#00E3FF)
- **Background**: Deep Black with Cyan Accents
- **Typography**: Electrolize (Sci-Fi/Tech aesthetic)
- **Mood**: Industrial, Cybersecurity, Retro-Futuristic

---

**Last Updated**: January 2026
**Version**: 1.0
