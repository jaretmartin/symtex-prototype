# AUDIT_REPORT.md

> Symtex Pro VC Demo - Wave 6 Final Audit Report
> Date: 2026-01-21 | Status: P0 ISSUES IDENTIFIED - REQUIRES FIXES

---

## Executive Summary

Six comprehensive audits were performed across UX, Design System, Performance, Security, Demo Tracks, and Terminology. The application has **solid foundations** but requires **11 P0 fixes** before demo readiness.

| Audit Area | P0 | P1 | P2 | Status |
|------------|----|----|-----|--------|
| UX | 3 | 4 | 3 | Needs work |
| Design System | 3 | 5 | 2 | Needs work |
| Performance | 2 | 1 | 2 | Minor fixes |
| Security | 0 | 2 | 0 | **PASS** |
| Demo Tracks | 3 | 3 | 2 | **BLOCKED** |
| Terminology | 4 | 5 | 3 | Needs work |

---

## P0 Issues (MUST FIX BEFORE DEMO)

### UX-P0-1: Home "View Full Report" Links to Self
**File:** `src/routes/home/index.tsx` (line 191)
**Issue:** The "View Full Report" CTA links back to "/" creating a dead-end loop.
**Fix:** Change to `/signals` or remove the CTA.

### UX-P0-2: Team Section Uses Placeholder
**File:** `src/main.tsx` (line 220-222)
**Issue:** `/team` route shows bare placeholder with no navigation.
**Fix:** Redirect to `/team/cognates` or create proper landing page.

### UX-P0-3: Signals Section Uses Placeholder
**File:** `src/main.tsx` (lines 307-314)
**Issue:** `/signals` and `/signals/roi` show placeholders instead of ROIDashboard.
**Fix:** Wire ROIDashboard component to these routes.

---

### DEMO-P0-1: Missing /team/cognates/:id Route
**File:** `src/main.tsx`
**Issue:** Cognate detail route not defined. CognateDetailPage exists but route missing.
**Impact:** Track C fails, WF1 blocked, "Simulation Diff" wow moment broken.
**Fix:** Add route mapping `/team/cognates/:id` to CognateDetailPage.

### DEMO-P0-2: /signals Route Shows Placeholder
**File:** `src/main.tsx` (lines 307-310)
**Issue:** SectionIndex placeholder instead of real content.
**Impact:** Track A blocked at 0:30-1:00.
**Fix:** Wire to ROIDashboard or SignalsDashboard.

### DEMO-P0-3: /signals/roi Shows "Coming Soon"
**File:** `src/main.tsx` (lines 311-314)
**Issue:** ROIDashboard component exists but route shows ComingSoon.
**Fix:** Replace ComingSoon with lazy-loaded ROIDashboard.

---

### DESIGN-P0-1: Hardcoded Colors in LUX Builder
**File:** `src/routes/studio/lux/index.tsx` (20+ violations)
**Issue:** Extensive inline styles with hardcoded hex colors.
**Impact:** LUX Builder theming broken - KEY DEMO FEATURE.
**Note:** P1 for demo (visible but functional).

### DESIGN-P0-2: Automations Route Inline Styles
**File:** `src/routes/studio/automations/index.tsx` (40+ violations)
**Issue:** Nearly all styling via inline styles instead of tokens.
**Note:** P1 for demo (visible but functional).

### DESIGN-P0-3: NEXIS Graph Hardcoded Colors
**File:** `src/features/nexis/NexisGraph.tsx` (25+ violations)
**Issue:** All node colors, relationship colors hardcoded.
**Note:** P1 for demo (visible but functional).

---

### PERF-P0-1: Knowledge Page Auto-Renders 3D Canvas
**File:** `src/routes/library/knowledge.tsx`
**Issue:** Default view mode is `split` which renders canvas immediately.
**Fix:** Change default to `'2d'` or `'list'`.

### PERF-P0-2: CognateDock Loads on Every Page
**File:** `src/App.tsx`
**Issue:** Framer-motion bundle loads on initial app load.
**Note:** P1 for demo (performance only).

---

### TERM-P0-1: CognateActivityWidget Contains "Agent"
**File:** `src/components/home/CognateActivityWidget.tsx` (lines 39, 48, 66)
**Issue:** Mock data uses "Customer Support Agent" (UI-visible).
**Fix:** Change to "Customer Support Cognate" or "Aria Support".

### TERM-P0-2: C2S2Explorer Shows "Workflow"
**File:** `src/features/c2s2/C2S2Explorer.tsx` (line 510)
**Issue:** Project label shows "Customer Support Workflow".
**Fix:** Change to "Customer Support Automation".

### TERM-P0-3: c2s2-store Project Name
**File:** `src/features/c2s2/c2s2-store.ts` (line 103)
**Issue:** Mock project name "Customer Support Workflow".
**Fix:** Change to "Customer Support Automation".

### TERM-P0-4: Demo Scenarios Use "Workflow"
**File:** `src/demo/scenarios.ts` (lines 150, 152, 265)
**Issue:** Scenario names/descriptions contain "Workflow".
**Fix:** Change to "Operations Walkthrough" or "Automation".

---

## P1 Issues (SHOULD FIX)

### UX-P1-1: QuickActions Routes to Non-Existent Pages
- `src/components/home/QuickActionsWidget.tsx`
- Routes `/studio/lux/new`, `/missions/new`, `/spaces/new` don't exist

### UX-P1-2: "Coming Soon" Without Alternatives
- Multiple locations show toast "Coming Soon" without context

### UX-P1-3: Settings Link Shows "Soon" Badge but Works
- `src/components/ui/Sidebar.tsx` - Settings page exists but shows locked badge

### UX-P1-4: Keyboard Shortcut Link 404
- `src/components/home/QuickActionsWidget.tsx` - `/help/shortcuts` doesn't exist

---

### DESIGN-P1-1: Typography Scale Not Used
- Design system defines custom classes but 0 usages found
- Using standard Tailwind instead (acceptable)

### DESIGN-P1-2: Raw Tailwind Colors vs Tokens
- Hundreds of `text-red-400`, `bg-green-500/20` etc.
- Should use semantic `text-error`, `text-success`

### DESIGN-P1-3: Chart Components Hardcoded
- CostSavingsChart, SymbolicRatioGauge, DNAHelixViz all hardcoded

---

### PERF-P1-1: Framer-Motion Global Load
- DemoControlPanel, CognateDock, ThemeToggle all load framer-motion on startup

---

### SECURITY-P1-1: Dual CommandPalette Implementations
- `src/components/command/CommandPalette.tsx`
- `src/components/command-palette/CommandPalette.tsx`
- Both register Cmd+K

### SECURITY-P1-2: Unvalidated URL Parameter
- `src/features/nexis/NexisContactCard.tsx` - node.id interpolated without encoding

---

### DEMO-P1-1: "Simulation Diff" Links to Invalid Route
- `src/demo/DemoControlPanel.tsx` - links to non-existent `/team/cognates/:id`

### DEMO-P1-2: No /control/policies Route
- Demo script references it, has fallback to /control

### DEMO-P1-3: Symbios Query String Not Handled
- `?command=` param not processed by Chat component

---

### TERM-P1-1: Ledger Mock Contains "workflow"
- `src/mocks/ledger.ts` - tool names and trace messages

### TERM-P1-2: Knowledge Mock Contains "workflow"
- `src/mocks/knowledge.ts` - document descriptions

---

## Demo Track Status

| Track | Duration | Status | Blocker |
|-------|----------|--------|---------|
| Track A (Exec) | 3 min | **BLOCKED** | /signals placeholder |
| Track B (Operator) | 5 min | **READY** | None |
| Track C (Builder) | 7 min | **BLOCKED** | Missing /team/cognates/:id |

---

## Workflow Status

| Workflow | Status | Blocker |
|----------|--------|---------|
| WF1: Cognate → Space → Pack → Simulate | **BLOCKED** | Missing cognate detail route |
| WF2: Automation → Plan → Simulate → Run → Compile | **READY** | None |
| WF3: Knowledge → Cite → Audit | **READY** | None |
| WF4: NEXIS → Automation → Budget | **READY** | None |
| WF5: Policy → Approval → Rerun | **READY** | None |

---

## Passing Checks

### Security
- All dangerouslySetInnerHTML properly sanitized with DOMPurify
- No eval() or Function() usage
- No dynamic script injection
- External links use `noopener noreferrer`

### Performance
- Routes properly lazy-loaded with React.lazy()
- Suspense boundaries with fallbacks
- Vendor chunk splitting configured
- No three.js/3D library in bundle

### Navigation
- 8 L1 nav items correctly configured
- Mobile responsive drawer pattern
- ARIA attributes present
- SpaceTree expansion works

### Component Library
- No MUI/Chakra mixing detected
- lucide-react icons only
- shadcn/Radix components properly used

---

## Recommended Fix Order

### Critical (Before Demo)
1. Add `/team/cognates/:id` route → Unblocks Track C + WF1
2. Wire `/signals` to ROIDashboard → Unblocks Track A
3. Fix Home "View Full Report" link
4. Fix terminology violations (4 files)
5. Change Knowledge default view to '2d'

### Important (If Time)
6. Fix QuickActions routes
7. Remove Settings "Soon" badge
8. Handle Symbios query param
9. Remove duplicate CommandPalette

---

## Verification After Fixes

```bash
# Build verification
pnpm build

# Terminology check
grep -r "agent" src/ --include="*.tsx" | grep -v "userAgent" | grep -v "type Agent"

# Route check
# Navigate to: /, /team/cognates, /signals, /runs

# Demo tracks
# Run Track A (3 min)
# Run Track B (5 min)
# Run Track C (7 min)
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial audit report |
