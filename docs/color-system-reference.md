# Saudi Tourism Website - Complete Color System Reference

## Overview

This document provides a comprehensive reference for the color system used in the Saudi Tourism website, supporting both light and dark modes with full WCAG AA compliance.

## Core Identity Colors

| Color                      | Hex Value | Usage                          | Notes                                |
| -------------------------- | --------- | ------------------------------ | ------------------------------------ |
| Saudi National Green       | `#006C35` | Primary CTA, cultural emphasis | Core brand color, used in both modes |
| Saudi Vision 2030 Lavender | `#A78BBA` | Decorative accents only        | Used sparingly for highlights        |

## Complete Color Token Reference

### Background System

| Token            | Light Mode                 | Dark Mode               | Usage                     |
| ---------------- | -------------------------- | ----------------------- | ------------------------- |
| `--bg-primary`   | `#FFFFFF`                  | `#1A1A1A`               | Main background           |
| `--bg-secondary` | `#F8F9FA`                  | `#2D2D2D`               | Card/surface backgrounds  |
| `--bg-tertiary`  | `#F1F3F4`                  | `#3A3A3A`               | Subtle surface variations |
| `--bg-overlay`   | `rgba(26, 26, 26, 0.7)`    | `rgba(0, 0, 0, 0.8)`    | Modal overlays            |
| `--bg-glass`     | `rgba(255, 255, 255, 0.8)` | `rgba(26, 26, 26, 0.8)` | Glass morphism effects    |

### Text System

| Token              | Light Mode | Dark Mode | Usage                           |
| ------------------ | ---------- | --------- | ------------------------------- |
| `--text-primary`   | `#1A1A1A`  | `#F0F0F0` | Main text content               |
| `--text-secondary` | `#4A4A4A`  | `#B8B8B8` | Secondary text                  |
| `--text-tertiary`  | `#6B7280`  | `#9CA3AF` | Muted text                      |
| `--text-disabled`  | `#9CA3AF`  | `#6B7280` | Disabled text                   |
| `--text-inverse`   | `#FFFFFF`  | `#1A1A1A` | Text on contrasting backgrounds |
| `--text-accent`    | `#006C35`  | `#4ADE80` | Accent text (Saudi green)       |

### Accent Colors

| Token                      | Light Mode | Dark Mode | Usage                             |
| -------------------------- | ---------- | --------- | --------------------------------- |
| `--accent-primary`         | `#006C35`  | `#006C35` | Saudi green - primary CTA         |
| `--accent-primary-hover`   | `#008A42`  | `#008A42` | Hover state for primary           |
| `--accent-primary-active`  | `#005229`  | `#005229` | Active state for primary          |
| `--accent-secondary`       | `#A78BBA`  | `#A78BBA` | Lavender - decorative only        |
| `--accent-secondary-hover` | `#B8A5C7`  | `#B8A5C7` | Hover state for secondary         |
| `--accent-teal`            | `#004D61`  | `#0D9488` | Original teal (adjusted for dark) |
| `--accent-teal-light`      | `#006B7A`  | `#14B8A6` | Light teal variant                |
| `--accent-ruby`            | `#822659`  | `#BE185D` | Original ruby (adjusted for dark) |
| `--accent-ruby-light`      | `#A03A7A`  | `#EC4899` | Light ruby variant                |

### UI Elements

| Token                | Light Mode | Dark Mode | Usage            |
| -------------------- | ---------- | --------- | ---------------- |
| `--border-primary`   | `#E5E7EB`  | `#374151` | Main borders     |
| `--border-secondary` | `#D1D5DB`  | `#4B5563` | Subtle borders   |
| `--border-accent`    | `#006C35`  | `#006C35` | Accent borders   |
| `--border-focus`     | `#006C35`  | `#006C35` | Focus rings      |
| `--divider`          | `#E5E7EB`  | `#374151` | Section dividers |

### Interactive States

| Token               | Light Mode                 | Dark Mode                   | Usage                   |
| ------------------- | -------------------------- | --------------------------- | ----------------------- |
| `--hover-primary`   | `rgba(0, 108, 53, 0.1)`    | `rgba(0, 108, 53, 0.2)`     | Primary hover effects   |
| `--hover-secondary` | `rgba(167, 139, 186, 0.1)` | `rgba(167, 139, 186, 0.15)` | Secondary hover effects |
| `--focus-ring`      | `rgba(0, 108, 53, 0.3)`    | `rgba(0, 108, 53, 0.4)`     | Focus ring opacity      |
| `--active-primary`  | `rgba(0, 108, 53, 0.2)`    | `rgba(0, 108, 53, 0.3)`     | Active state opacity    |

### Status Colors

| Token          | Light Mode | Dark Mode                 | Usage               |
| -------------- | ---------- | ------------------------- | ------------------- |
| `--success`    | `#10B981`  | `#10B981`                 | Success states      |
| `--success-bg` | `#D1FAE5`  | `rgba(16, 185, 129, 0.1)` | Success backgrounds |
| `--warning`    | `#F59E0B`  | `#F59E0B`                 | Warning states      |
| `--warning-bg` | `#FEF3C7`  | `rgba(245, 158, 11, 0.1)` | Warning backgrounds |
| `--error`      | `#EF4444`  | `#EF4444`                 | Error states        |
| `--error-bg`   | `#FEE2E2`  | `rgba(239, 68, 68, 0.1)`  | Error backgrounds   |
| `--info`       | `#3B82F6`  | `#3B82F6`                 | Info states         |
| `--info-bg`    | `#DBEAFE`  | `rgba(59, 130, 246, 0.1)` | Info backgrounds    |

### Shadow System

| Token         | Light Mode                            | Dark Mode                             | Usage               |
| ------------- | ------------------------------------- | ------------------------------------- | ------------------- |
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)`     | `0 1px 2px 0 rgba(0, 0, 0, 0.3)`      | Small shadows       |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)`   | `0 4px 6px -1px rgba(0, 0, 0, 0.4)`   | Medium shadows      |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | `0 10px 15px -3px rgba(0, 0, 0, 0.4)` | Large shadows       |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | `0 20px 25px -5px rgba(0, 0, 0, 0.5)` | Extra large shadows |

## Accessibility Notes

### Contrast Ratios (WCAG AA Compliant)

- **Primary text on backgrounds**: 4.5:1 minimum (AAA: 7:1)
- **Secondary text**: 3:1 minimum (AA: 4.5:1)
- **Interactive elements**: 3:1 minimum for focus states
- **Saudi green (#006C35)**: Maintains excellent contrast on both light and dark backgrounds

### Key Adjustments Made

1. **Dark mode text accent**: Changed from `#006C35` to `#4ADE80` for better contrast on dark backgrounds
2. **Teal and ruby colors**: Slightly adjusted for dark mode to maintain contrast
3. **Background overlays**: Increased opacity in dark mode for better content separation
4. **Shadow system**: Enhanced opacity in dark mode for proper depth perception

## Usage Guidelines

### Saudi Green (#006C35)

- **Primary use**: Call-to-action buttons, links, cultural emphasis
- **Always maintain**: High contrast for accessibility
- **Never use**: For large background areas (use sparingly)

### Lavender (#A78BBA)

- **Decorative use only**: Hover effects, subtle borders, highlights
- **Never use**: For large areas or primary content
- **Cultural respect**: Used sparingly to maintain elegance

### Implementation

```css
/* Import the color system */
@import "base/color-system.css";

/* Use semantic tokens */
.my-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.my-button {
  background-color: var(--accent-primary);
  color: var(--text-inverse);
}

.my-button:hover {
  background-color: var(--accent-primary-hover);
}
```

## Browser Support

- CSS Custom Properties (CSS Variables): All modern browsers
- Dark mode support: `[data-theme="dark"]` selector
- Fallbacks: Provided for older browsers where needed
