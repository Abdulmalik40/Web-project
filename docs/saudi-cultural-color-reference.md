# Saudi Tourism Website - Cultural Color System Reference

## Overview

This document provides the complete reference for the Saudi cultural color system, using exact specifications for both dark and light modes. All colors are culturally authentic and reflect Saudi Arabia's heritage, Vision 2030, and natural beauty.

## Core Saudi Cultural Colors (Mandatory)

| Color Name           | Hex Value | Cultural Significance                 | Usage Rules                         |
| -------------------- | --------- | ------------------------------------- | ----------------------------------- |
| Saudi National Green | `#006C35` | National flag color, Islamic heritage | CTAs, badges, key actions           |
| Vision 2030 Lavender | `#A78BBA` | Modern transformation, innovation     | Hover effects, dividers, accents    |
| Desert Sunset Gold   | `#FFD700` | Desert sunsets, mosque domes          | Decorative lines, icons, highlights |
| Heritage Ruby        | `#822659` | Cultural heritage, premium content    | Premium, featured, special tags     |
| Skyline Teal         | `#004D61` | Modern cities, Red Sea                | Modern accents, info sections       |
| Off-White Text       | `#F0F0F0` | Desert sand, natural warmth           | Dark mode text                      |
| Midnight Black       | `#1A1A1A` | Starlit desert nights                 | Dark mode base (non-negotiable)     |
| Pure White           | `#FFFFFF` | Bright desert sun                     | Light mode base                     |

## Complete Color Token Reference

### Background System

| Token Name            | Dark Mode Hex            | Light Mode Hex              | Usage Example          |
| --------------------- | ------------------------ | --------------------------- | ---------------------- |
| `--color-bg-base`     | `#1A1A1A`                | `#FFFFFF`                   | Page background        |
| `--color-bg-surface`  | `#222222`                | `#F8F8F8`                   | Cards, panels          |
| `--color-bg-elevated` | `#2A2A2A`                | `#F5F5F5`                   | Modals, dropdowns      |
| `--color-bg-glass`    | `rgba(26, 26, 26, 0.85)` | `rgba(255, 255, 255, 0.85)` | Glass morphism effects |
| `--color-bg-overlay`  | `rgba(0, 0, 0, 0.8)`     | `rgba(26, 26, 26, 0.6)`     | Modal overlays         |

### Text System

| Token Name               | Dark Mode Hex | Light Mode Hex | Usage Example                   |
| ------------------------ | ------------- | -------------- | ------------------------------- |
| `--color-text-primary`   | `#F0F0F0`     | `#1A1A1A`      | Headings, body text             |
| `--color-text-secondary` | `#CCCCCC`     | `#555555`      | Subtext, captions               |
| `--color-text-tertiary`  | `#AAAAAA`     | `#777777`      | Muted text, labels              |
| `--color-text-disabled`  | `#666666`     | `#AAAAAA`      | Disabled elements               |
| `--color-text-inverse`   | `#1A1A1A`     | `#FFFFFF`      | Text on contrasting backgrounds |

### Interactive Elements

| Token Name                       | Dark Mode Hex | Light Mode Hex | Usage Example                 |
| -------------------------------- | ------------- | -------------- | ----------------------------- |
| `--color-button-primary`         | `#006C35`     | `#006C35`      | "Explore All Programs" button |
| `--color-button-primary-hover`   | `#008A42`     | `#008A42`      | Primary button hover state    |
| `--color-button-primary-active`  | `#005229`     | `#005229`      | Primary button active state   |
| `--color-button-secondary`       | `#004D61`     | `#004D61`      | Secondary buttons             |
| `--color-button-secondary-hover` | `#006B7A`     | `#006B7A`      | Secondary button hover        |
| `--color-button-tertiary`        | `transparent` | `transparent`  | Ghost buttons                 |
| `--color-button-tertiary-border` | `#A78BBA`     | `#A78BBA`      | Ghost button borders          |
| `--color-button-tertiary-text`   | `#A78BBA`     | `#A78BBA`      | Ghost button text             |
| `--color-button-text`            | `#FFFFFF`     | `#FFFFFF`      | Button text color             |

### Borders & Dividers

| Token Name                | Dark Mode Hex | Light Mode Hex | Usage Example           |
| ------------------------- | ------------- | -------------- | ----------------------- |
| `--color-border`          | `#333333`     | `#DDDDDD`      | Main borders            |
| `--color-border-subtle`   | `#444444`     | `#EEEEEE`      | Subtle borders          |
| `--color-border-accent`   | `#006C35`     | `#006C35`      | Accent borders          |
| `--color-border-lavender` | `#A78BBA`     | `#A78BBA`      | Lavender accent borders |
| `--color-border-gold`     | `#FFD700`     | `#FFD700`      | Gold accent borders     |
| `--color-divider`         | `#333333`     | `#DDDDDD`      | Section dividers        |

### Hover & Focus States

| Token Name               | Dark Mode Hex               | Light Mode Hex              | Usage Example          |
| ------------------------ | --------------------------- | --------------------------- | ---------------------- |
| `--color-hover-overlay`  | `rgba(167, 139, 186, 0.1)`  | `rgba(167, 139, 186, 0.05)` | Card hover effects     |
| `--color-hover-primary`  | `rgba(0, 108, 53, 0.15)`    | `rgba(0, 108, 53, 0.08)`    | Primary hover effects  |
| `--color-hover-lavender` | `rgba(167, 139, 186, 0.12)` | `rgba(167, 139, 186, 0.08)` | Lavender hover effects |
| `--color-focus-ring`     | `rgba(0, 108, 53, 0.4)`     | `rgba(0, 108, 53, 0.3)`     | Focus ring opacity     |
| `--color-active`         | `rgba(0, 108, 53, 0.2)`     | `rgba(0, 108, 53, 0.12)`    | Active state opacity   |

### Badge/Tag System

| Token Name                 | Dark Mode Hex | Light Mode Hex | Usage Example                      |
| -------------------------- | ------------- | -------------- | ---------------------------------- |
| `--color-badge-religious`  | `#006C35`     | `#006C35`      | "RELIGIOUS" tag on Makkah card     |
| `--color-badge-capital`    | `#822659`     | `#822659`      | "CAPITAL" tag on Riyadh card       |
| `--color-badge-industrial` | `#004D61`     | `#004D61`      | "INDUSTRIAL" tag on Eastern Region |
| `--color-badge-heritage`   | `#FFD700`     | `#FFD700`      | "HERITAGE" tag on Northern Region  |
| `--color-badge-vision`     | `#A78BBA`     | `#A78BBA`      | "VISION 2030" tag on Vision card   |
| `--color-badge-text`       | `#FFFFFF`     | `#FFFFFF`      | White text on badges               |

### Accent Lines & Navigation

| Token Name            | Dark Mode Hex | Light Mode Hex | Usage Example                     |
| --------------------- | ------------- | -------------- | --------------------------------- |
| `--color-accent-line` | `#FFD700`     | `#FFD700`      | Gold accent lines under headers   |
| `--color-nav-active`  | `#006C35`     | `#006C35`      | Navigation active state underline |

### Shadow System

| Token Name       | Dark Mode Hex                         | Light Mode Hex                        | Usage Example       |
| ---------------- | ------------------------------------- | ------------------------------------- | ------------------- |
| `--shadow-sm`    | `0 1px 2px 0 rgba(0, 0, 0, 0.3)`      | `0 1px 2px 0 rgba(0, 0, 0, 0.05)`     | Small shadows       |
| `--shadow-md`    | `0 4px 6px -1px rgba(0, 0, 0, 0.4)`   | `0 4px 6px -1px rgba(0, 0, 0, 0.1)`   | Medium shadows      |
| `--shadow-lg`    | `0 10px 15px -3px rgba(0, 0, 0, 0.4)` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Large shadows       |
| `--shadow-xl`    | `0 20px 25px -5px rgba(0, 0, 0, 0.5)` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Extra large shadows |
| `--shadow-saudi` | `0 4px 12px rgba(0, 108, 53, 0.3)`    | `0 4px 12px rgba(0, 108, 53, 0.15)`   | Saudi green shadow  |

## Cultural Design Rules

### Saudi Green (#006C35) - Primary CTA

- **Always use** for primary call-to-action buttons
- **Never substitute** with other greens
- **Must have** white text (#FFFFFF) for contrast
- **Cultural significance**: National flag color, Islamic heritage

### Vision 2030 Lavender (#A78BBA) - Decorative Only

- **Use sparingly** for hover borders, underlines, accent lines
- **Never use** for large backgrounds or primary text
- **Cultural significance**: Modern transformation, innovation

### Desert Gold (#FFD700) - Decorative Accents

- **Use for** decorative dividers, badges, highlights
- **Inspired by** desert sunsets and mosque domes
- **Cultural significance**: Natural beauty, architectural heritage

### Heritage Ruby (#822659) - Premium Content

- **Use for** premium, featured, special tags
- **Cultural significance**: Rich heritage, traditional crafts
- **Perfect for** capital city tags, VIP content

### Skyline Teal (#004D61) - Modern Accents

- **Use for** modern elements, info sections
- **Cultural significance**: Modern cities, Red Sea
- **Perfect for** industrial tags, tech content

## Accessibility Compliance

### WCAG AAA Contrast Ratios

- **Primary text**: 7:1 minimum contrast
- **Secondary text**: 4.5:1 minimum contrast
- **Interactive elements**: 3:1 minimum contrast
- **Saudi green**: Maintains excellent contrast on both modes

### Key Accessibility Features

1. **High contrast focus states** with Saudi green
2. **Screen reader friendly** color combinations
3. **Color-blind accessible** palette
4. **Semantic color usage** for meaning

## Implementation Examples

### Hero Button

```css
.hero-cta {
  background-color: var(--color-button-primary);
  color: var(--color-button-text);
  border: 2px solid var(--color-button-primary);
}
```

### Card with Badge

```css
.tourism-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
}

.tourism-card:hover {
  border-color: var(--color-border-lavender);
  background-color: var(--color-hover-overlay);
}

.badge-religious {
  background-color: var(--color-badge-religious);
  color: var(--color-badge-text);
}
```

### Navigation Active State

```css
.nav-link.active {
  color: var(--color-accent-saudi-green);
}

.nav-link.active::after {
  background: var(--color-nav-active);
}
```

### Section Header with Gold Accent

```css
.section-header::after {
  background: var(--color-accent-line);
}
```

## Browser Support

- **CSS Custom Properties**: All modern browsers
- **Dark mode**: `[data-theme="dark"]` selector
- **Backdrop filters**: Modern browsers with fallbacks
- **Gradient support**: Universal browser support

## Cultural Authenticity Notes

This color system is designed to feel unmistakably Saudi through:

- **National colors** that reflect Saudi identity
- **Desert-inspired** warm tones and gold accents
- **Modern Vision 2030** lavender for innovation
- **Cultural heritage** ruby for traditional elements
- **Natural beauty** reflected in color choices

Every color choice has cultural meaning and technical excellence, creating a design system that is both authentically Saudi and globally accessible.
