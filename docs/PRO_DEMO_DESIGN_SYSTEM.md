# PRO_DEMO_DESIGN_SYSTEM.md

> Symtex Pro - Design System Documentation
> Version: 1.0.0 | Last Updated: 2026-01-21

---

## 1. UI Stack

| Category | Choice | Notes |
|----------|--------|-------|
| **Component Library** | shadcn/ui (Radix primitives) | Primary source for accessible components |
| **Styling** | Tailwind CSS | Utility-first, token-driven |
| **Icons** | lucide-react | Consistent icon set |
| **Motion** | Framer Motion | State-driven microinteractions |
| **Graphs** | ReactFlow (2D), Recharts (charts) | NEXIS and Signals |
| **State** | Zustand | Simple, performant state management |
| **Routing** | React Router DOM | Client-side routing |

### Rules
1. Do NOT mix component libraries (no MUI, Chakra, etc.)
2. All colors/spacing/typography MUST use design tokens
3. Legacy components MUST be wrapped and restyled to match tokens
4. No inline styles except for dynamic values

---

## 2. Typography Scale

### Token Definitions
Location: `src/styles/tokens/typography.css`

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display` | 36px (2.25rem) | 700 | 1.1 | Page titles, hero text |
| `headline` | 30px (1.875rem) | 600 | 1.2 | Section headers |
| `title` | 20px (1.25rem) | 600 | 1.3 | Card titles, subsections |
| `subtitle` | 18px (1.125rem) | 500 | 1.4 | Subtitles, descriptions |
| `body` | 16px (1rem) | 400 | 1.5 | Default text |
| `caption` | 14px (0.875rem) | 400 | 1.4 | Secondary text, labels |
| `micro` | 12px (0.75rem) | 400 | 1.4 | Badges, timestamps |

### CSS Classes
```css
.text-display { font-size: var(--font-display); font-weight: 700; line-height: 1.1; }
.text-headline { font-size: var(--font-headline); font-weight: 600; line-height: 1.2; }
.text-title { font-size: var(--font-title); font-weight: 600; line-height: 1.3; }
.text-subtitle { font-size: var(--font-subtitle); font-weight: 500; line-height: 1.4; }
.text-body { font-size: var(--font-body); font-weight: 400; line-height: 1.5; }
.text-caption { font-size: var(--font-caption); font-weight: 400; line-height: 1.4; }
.text-micro { font-size: var(--font-micro); font-weight: 400; line-height: 1.4; }
```

### Font Families
| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | Inter, system-ui, sans-serif | Primary text |
| `--font-mono` | JetBrains Mono, Consolas, monospace | Code, S1 script |

---

## 3. Spacing Scale

### Token Definitions
Location: `src/styles/tokens/spacing.css`

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | Reset |
| `--space-1` | 4px | Tight spacing, icon padding |
| `--space-2` | 8px | Small gaps, button padding |
| `--space-3` | 12px | Medium gaps |
| `--space-4` | 16px | Component padding, card gaps |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Large gaps |
| `--space-8` | 32px | Section separators |
| `--space-10` | 40px | Page margins |
| `--space-12` | 48px | Large section margins |
| `--space-16` | 64px | Hero spacing |

### Semantic Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--component-xs` | 4px | Tight component spacing |
| `--component-sm` | 8px | Small component spacing |
| `--component-md` | 12px | Default component spacing |
| `--component-lg` | 16px | Large component spacing |
| `--component-xl` | 24px | Extra large component spacing |
| `--section-sm` | 24px | Small section padding |
| `--section-md` | 32px | Medium section padding |
| `--section-lg` | 48px | Large section padding |
| `--page-x` | 24px | Page horizontal padding |
| `--page-y` | 32px | Page vertical padding |

---

## 4. Color Tokens

### Brand Colors
Location: `src/styles/tokens/colors.css`

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--color-primary-500` | #6366f1 | #818cf8 | Primary actions, links |
| `--color-primary-600` | #4f46e5 | #6366f1 | Primary hover |
| `--color-accent-500` | #a855f7 | #c084fc | Accent elements |
| `--color-gold-500` | #eab308 | #facc15 | Premium, highlight |

### Status Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | #22c55e | Success states, completed |
| `--color-warning` | #f59e0b | Warnings, pending |
| `--color-error` | #ef4444 | Errors, failed |
| `--color-info` | #3b82f6 | Information, neutral |

### Trust Indicators (TO ADD)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-trust-verified` | #22c55e | Verified/approved |
| `--color-trust-pending` | #f59e0b | Awaiting review |
| `--color-trust-blocked` | #ef4444 | Policy blocked |
| `--color-trust-running` | #3b82f6 | In progress |

### Surface Colors
| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--surface-base` | #ffffff | #0f172a | Page background |
| `--surface-card` | #ffffff | #1e293b | Card background |
| `--surface-elevated` | #f8fafc | #334155 | Elevated elements |
| `--surface-hover` | #f1f5f9 | #475569 | Hover states |

### Text Colors
| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--text-primary` | #0f172a | #f8fafc | Primary text |
| `--text-secondary` | #475569 | #94a3b8 | Secondary text |
| `--text-muted` | #94a3b8 | #64748b | Muted/disabled |

---

## 5. Shadow Tokens

Location: `src/styles/tokens/shadows.css`

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `--shadow-sm` | 0 1px 3px rgba(0,0,0,0.1) | Cards, buttons |
| `--shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Dropdowns, popovers |
| `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals |
| `--shadow-xl` | 0 20px 25px rgba(0,0,0,0.1) | Full-screen overlays |

### Glow Effects
| Token | Value | Usage |
|-------|-------|-------|
| `--glow-primary` | 0 0 20px rgba(99,102,241,0.3) | Primary focus |
| `--glow-accent` | 0 0 20px rgba(168,85,247,0.3) | Accent focus |
| `--glow-success` | 0 0 15px rgba(34,197,94,0.3) | Success highlight |

---

## 6. Border Radius

Location: `src/styles/tokens/shadows.css`

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Square corners |
| `--radius-sm` | 4px | Subtle rounding |
| `--radius-md` | 6px | Default rounding |
| `--radius-lg` | 8px | Cards, buttons |
| `--radius-xl` | 12px | Large cards, modals |
| `--radius-2xl` | 16px | Hero sections |
| `--radius-full` | 9999px | Pills, avatars |

---

## 7. Animation Tokens

Location: `src/styles/tokens/animations.css`

### Durations
| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 50ms | Immediate feedback |
| `--duration-fast` | 150ms | Quick transitions |
| `--duration-normal` | 300ms | Standard transitions |
| `--duration-slow` | 500ms | Complex animations |

### Easings
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Standard |
| `--ease-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Playful |
| `--ease-elastic` | cubic-bezier(0.68, -0.6, 0.32, 1.6) | Springy |

### Rate Limiting (TO IMPLEMENT)
| Rule | Value |
|------|-------|
| Max toasts per 30s | 1 |
| Max ambient animations per 10s | 1 |
| Reduced motion support | Required |

---

## 8. Component Inventory

### Existing (Complete)

| Component | Location | Source | Notes |
|-----------|----------|--------|-------|
| Button | `components/ui/Button/Button.tsx` | Custom CVA | Full variants, sizes, loading |
| Card | `components/ui/card.tsx` | shadcn | Header, content, footer |
| Tabs | `components/ui/tabs.tsx` | shadcn/Radix | Accessible |
| Badge | `components/ui/badge.tsx` | shadcn CVA | Variants |
| Input | `components/ui/input.tsx` | shadcn | Basic text input |
| Dialog/Modal | `components/ui/dialog.tsx` | shadcn/Radix | Full dialog |
| Dropdown | `components/ui/dropdown-menu.tsx` | shadcn/Radix | Full menu |
| Sheet/Drawer | `components/ui/sheet.tsx` | shadcn/Radix | Side panels |
| Toast | `components/ui/Toast/Toast.tsx` | Custom | With store |
| Tooltip | `components/ui/tooltip.tsx` | shadcn/Radix | Accessible |
| Select | `components/ui/select.tsx` | shadcn/Radix | Full select |
| Popover | `components/ui/popover.tsx` | shadcn/Radix | Positioning |
| Command | `components/ui/command.tsx` | shadcn/cmdk | Palette primitives |
| Progress | `components/ui/progress.tsx` | shadcn/Radix | Linear progress |
| ProgressRing | `components/ui/ProgressRing.tsx` | Custom | Circular SVG |
| Separator | `components/ui/separator.tsx` | shadcn/Radix | Dividers |
| Avatar | `components/ui/avatar.tsx` | shadcn/Radix | With fallback |
| EmptyState | `components/empty/EmptyState.tsx` | Custom | Generic + presets |
| ErrorFallback | `components/error/ErrorFallback.tsx` | Custom | Error boundary |
| Breadcrumbs | `components/context/BreadcrumbRail.tsx` | Custom | With keyboard nav |
| Sidebar | `components/ui/Sidebar.tsx` | Custom | Main nav |
| ThemeToggle | `components/ui/ThemeToggle.tsx` | Custom | Dark mode |

### To Consolidate (Duplicates)

| Component | Issue | Action |
|-----------|-------|--------|
| Skeleton | Two implementations | Keep `Skeleton/Skeleton.tsx`, delete `skeleton.tsx` |

### Missing (To Build)

| Component | Priority | Description |
|-----------|----------|-------------|
| IconButton | P1 | Dedicated icon-only button with sizes |
| Table | P1 | Data table with sorting, pagination |
| SearchInput | P1 | Search input with icon, clear button |
| FilterBar | P2 | Faceted filtering component |
| ErrorBanner | P2 | Inline error display |
| PermissionGate | P2 | Authorization wrapper |

---

## 9. Page Template Requirements

Every page MUST include:

### Header
- Page title (`.text-headline`)
- Description (`.text-body`, optional)
- Primary CTA button
- Max 2 secondary CTAs

### Content
- Loading state (Skeleton)
- Empty state (EmptyState)
- Error state (ErrorBanner or ErrorFallback)
- No-access state (PermissionGate)

### Footer
- Navigation (back button or breadcrumbs)
- Action buttons (if applicable)

---

## 10. UX Rules

### Progressive Disclosure
- Advanced panels collapsed by default
- "Show more" for long lists
- Expandable cards for details

### Keyboard Accessibility
- Command palette: `Cmd+K`
- Demo panel: `Ctrl+Shift+D`
- All interactive elements focusable
- Tab order logical

### Empty States
- Clear explanation of why empty
- Actionable CTA to add content
- Illustration (optional)

### Loading States
- Skeleton for content areas
- Spinner for actions
- Progress bar for long operations

### Error States
- Clear error message
- Suggested actions
- Retry option (if applicable)
- Support link

---

## 11. Cognate Dock Spec (TO IMPLEMENT)

### Position
- Fixed bottom-left (configurable)
- z-index: 40 (below modals, above content)

### Avatar Grid
- Up to 6 active Cognates
- 32x32px avatars
- Overflow indicator (+N)

### States
| State | Visual | Animation |
|-------|--------|-----------|
| Idle | Gray border | None |
| Listening | Blue border | Pulse |
| Planning | Purple border | Gentle pulse |
| WaitingApproval | Yellow border | Flash |
| Simulating | Blue border | Progress ring |
| Running | Green border | Progress ring |
| Blocked | Red border | Shake |
| NeedsReview | Yellow border | Badge bounce |
| Completed | Green check | Celebrate |
| Error | Red X | Shake |

### Rate Limiting
- Max 1 toast per 30 seconds
- Max 1 ambient animation per 10 seconds
- `prefers-reduced-motion` respected

---

## 12. Implementation Checklist

### Wave 1
- [ ] Consolidate Skeleton (delete duplicate)
- [ ] Add trust indicator color tokens
- [ ] Create IconButton component
- [ ] Create Table component

### Wave 2
- [ ] Create CognateDock component
- [ ] Implement rate limiting hook
- [ ] Add Cognate state animations

### Wave 4
- [ ] Create SearchInput component
- [ ] Create FilterBar component
- [ ] Create ErrorBanner component
- [ ] Create PermissionGate component

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial creation |
