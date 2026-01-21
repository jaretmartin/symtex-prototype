# PRO_DEMO_QA_CHECKLIST.md

> **Version**: 1.0.0
> **Last Updated**: 2026-01-21
> **Purpose**: Comprehensive checklist for verifying Symtex Pro demo readiness

---

## 1. Build Verification

### Core Build
- [ ] `pnpm build` passes with no errors
- [ ] `pnpm lint` passes with no errors
- [ ] TypeScript compilation succeeds
- [ ] No missing dependencies

### Bundle Quality
- [ ] Bundle size within acceptable limits (< 500KB gzipped)
- [ ] Code splitting working correctly
- [ ] Lazy-loaded routes chunked properly
- [ ] No duplicate dependencies in bundle

### Runtime Health
- [ ] No console errors on load
- [ ] No React warnings in dev mode
- [ ] No hydration mismatches
- [ ] No memory leaks in long sessions

---

## 2. Navigation Checklist

### L1 Nav Items (8 total)
| Route | Path | Status |
|-------|------|--------|
| Home | `/` | [ ] Renders |
| Spaces | `/spaces` | [ ] Renders |
| Knowledge | `/knowledge` | [ ] Renders |
| Runs | `/runs` | [ ] Renders |
| Team | `/team` | [ ] Renders |
| Signals | `/signals` | [ ] Renders |
| Control | `/control` | [ ] Renders |
| Symbios | `/symbios` | [ ] Renders |

### L2 Sub-Navigation

**Knowledge**
- [ ] `/knowledge` - Index page
- [ ] `/knowledge/nexis` - NEXIS graph
- [ ] `/knowledge/templates` - Template library

**Team**
- [ ] `/team` - Team overview
- [ ] `/team/cognates` - Cognate roster
- [ ] `/team/cognates/:id` - Cognate detail
- [ ] `/team/cognates/:id/bootstrap` - Bootstrap wizard
- [ ] `/team/cognates/:id/packs` - Pack management
- [ ] `/team/cognates/:id/sops` - SOP overview
- [ ] `/team/cognates/:id/sops/rules` - Rule builder
- [ ] `/team/cognates/:id/sops/validate` - Validation dashboard

**Control**
- [ ] `/control` - Command center
- [ ] `/control/lux` - LUX Builder
- [ ] `/control/approvals` - Approval queue
- [ ] `/control/c2s2` - C2S2 interface

### Legacy Redirects (20+)

**Dashboard Redirects**
- [ ] `/dashboard` → `/`
- [ ] `/home` → `/`

**Automation Redirects**
- [ ] `/automations` → `/runs`
- [ ] `/studio/automations` → `/runs`
- [ ] `/workflows` → `/runs`

**LUX Redirects**
- [ ] `/lux` → `/control/lux`
- [ ] `/studio/lux` → `/control/lux`
- [ ] `/builder` → `/control/lux`

**Cognate Redirects**
- [ ] `/cognates` → `/team/cognates`
- [ ] `/studio/cognates` → `/team/cognates`
- [ ] `/agents` → `/team/cognates`

**Control Redirects**
- [ ] `/command` → `/control`
- [ ] `/governance` → `/control`
- [ ] `/command-center` → `/control`

**Knowledge Redirects**
- [ ] `/nexis` → `/knowledge/nexis`
- [ ] `/library` → `/knowledge`
- [ ] `/templates` → `/knowledge/templates`

**Other Redirects**
- [ ] `/c2s1` → `/control/c2s2`
- [ ] `/chat` → `/symbios`
- [ ] `/aria` → `/symbios`
- [ ] `/settings` → `/control`
- [ ] `/studio` → `/control`

---

## 3. Workflow Checklists

### WF1: Cognate → Space → Pack → Simulate

**Cognate Creation**
- [ ] Navigate to `/team/cognates`
- [ ] "New Cognate" button visible
- [ ] Can create new Cognate
- [ ] Cognate appears in roster

**Space Assignment**
- [ ] Can assign Cognate to Space
- [ ] Space tree updates correctly
- [ ] Context breadcrumbs show assignment

**Pack Installation**
- [ ] Can browse Pack library
- [ ] Pack cards show details
- [ ] Can install Pack to Cognate
- [ ] Installed Packs visible in Cognate detail

**Simulation**
- [ ] "Simulate Run" button visible
- [ ] Click opens SimulationDiff modal
- [ ] Modal shows expected changes
- [ ] "View in Ledger" link works
- [ ] Can close modal cleanly

### WF2: Automation → Plan → Simulate → Run → Review → Compile

**Plan Phase**
- [ ] Select automation from list
- [ ] "Explain Plan" button works
- [ ] Modal shows:
  - [ ] Systems to be accessed
  - [ ] Permissions required
  - [ ] Estimated cost/tokens
  - [ ] Risk assessment

**Simulate Phase**
- [ ] "Simulate" button works
- [ ] Dry-run results display
- [ ] No side effects from simulation
- [ ] Can review before proceeding

**Run Phase**
- [ ] "Run" button executes automation
- [ ] Progress indicator visible
- [ ] Can monitor execution
- [ ] Errors handled gracefully

**Review Phase**
- [ ] Results modal appears
- [ ] Shows execution summary
- [ ] Links to affected resources
- [ ] Audit trail created

**Compile Phase**
- [ ] PatternCompilationWidget appears
- [ ] Shows compilation opportunity
- [ ] Can accept/reject pattern
- [ ] Pattern saved to library

### WF3: Knowledge → Citations → Audit

**Knowledge Index**
- [ ] `/knowledge` loads correctly
- [ ] Document list renders
- [ ] Search/filter works
- [ ] Categories display

**Document Ingestion**
- [ ] "Add Document" button visible
- [ ] Modal opens correctly
- [ ] Can upload/paste content
- [ ] Processing indicator shows
- [ ] Document appears in index

**Citation Flow**
- [ ] Symbios responses include citations
- [ ] Citation badges clickable
- [ ] "View Source" shows document
- [ ] "View in Ledger" creates audit link

**Audit Trail**
- [ ] Ingest creates audit event
- [ ] Ledger shows ingestion record
- [ ] Can trace document usage
- [ ] Access logs maintained

### WF4: NEXIS → Automation → Budget

**NEXIS Graph**
- [ ] `/knowledge/nexis` renders
- [ ] 3D graph loads (lazy)
- [ ] Nodes interactive
- [ ] Relationships visible
- [ ] Can zoom/pan/rotate

**Insight Actions**
- [ ] "Create Automation from Insight" button works
- [ ] Navigates to LUX Builder
- [ ] Context pre-filled
- [ ] "Send to Symbios" navigates correctly
- [ ] Insight context preserved

**Budget Management**
- [ ] Budget status visible in header
- [ ] Warning shows at 80% threshold
- [ ] Critical alert at 95%
- [ ] Can view budget details
- [ ] Cost attribution accurate

### WF5: Policy → Approval → Rerun

**Approval Queue**
- [ ] `/control/approvals` renders
- [ ] Pending items listed
- [ ] Priority indicators visible
- [ ] Can filter by type

**Policy Display**
- [ ] Policy reason banner visible
- [ ] Shows why approval needed
- [ ] "View Policy" link works
- [ ] Policy details modal opens
- [ ] Can view full policy text

**Approval Flow**
- [ ] "Approve" button works
- [ ] Confirmation required
- [ ] Status updates immediately
- [ ] Audit record created

**Rerun Flow**
- [ ] "Rerun" button appears after approval
- [ ] Click triggers execution
- [ ] Progress shown
- [ ] Results displayed

---

## 4. Demo Infrastructure

### Demo Control Panel (Ctrl+Shift+D)

**Access**
- [ ] `Ctrl+Shift+D` opens panel
- [ ] `Ctrl+Shift+D` closes panel
- [ ] Panel position correct
- [ ] Z-index above other content
- [ ] Draggable (if implemented)

**Scenario Management**
- [ ] Scenario selector dropdown works
- [ ] Available scenarios listed:
  - [ ] Clean Slate
  - [ ] Active Operations
  - [ ] Policy Pending
  - [ ] Pattern Opportunity
  - [ ] Budget Alert
- [ ] "Apply Scenario" changes state
- [ ] State reflects immediately

**Persona Switcher**
- [ ] Persona selector works
- [ ] Available personas:
  - [ ] Ops Lead
  - [ ] Analyst
  - [ ] Executive
  - [ ] Developer
- [ ] UI adapts to persona
- [ ] Permissions reflect role

**Feature Toggles**
- [ ] All toggles functional
- [ ] Toggle states persist in session
- [ ] Features enable/disable correctly
- [ ] No errors on toggle

**Wow Moment Buttons**
- [ ] All buttons navigate correctly
- [ ] Target views render
- [ ] Animation/effects trigger
- [ ] Can return to previous state

**Reset Function**
- [ ] "Reset Demo State" button works
- [ ] Confirmation dialog appears
- [ ] State fully resets
- [ ] No stale data remains

### CognateDock

**Rendering**
- [ ] Renders in bottom-left corner
- [ ] Position consistent across routes
- [ ] Does not overlap critical UI
- [ ] Responsive on smaller screens

**Content**
- [ ] Shows active Cognates from scenario
- [ ] Maximum visible count respected
- [ ] Overflow handled (if applicable)
- [ ] Empty state handled

**State Indicators**
- [ ] Colors correct per state:
  - [ ] Green: Active/Running
  - [ ] Yellow: Pending/Waiting
  - [ ] Red: Error/Blocked
  - [ ] Gray: Idle
- [ ] Pulse animation for active
- [ ] State transitions smooth

**Interaction**
- [ ] Click navigates to Cognate detail
- [ ] Hover shows tooltip/name
- [ ] Animations work (with motion enabled)
- [ ] No interaction lag

---

## 5. C2S2 Feature

### Route & Access
- [ ] `/control/c2s2` renders
- [ ] Accessible from Control nav
- [ ] Breadcrumbs correct
- [ ] Page title accurate

### Demo Mode Banner
- [ ] "DEMO MODE" banner visible
- [ ] Banner explains limitations
- [ ] Cannot be dismissed accidentally
- [ ] Styling prominent but not intrusive

### Tab: Dashboard
- [ ] Tab accessible
- [ ] Stats cards render
- [ ] Metrics populated (demo data)
- [ ] Charts display correctly
- [ ] Refresh works

### Tab: Explorer
- [ ] Tab accessible
- [ ] Code browser renders
- [ ] File tree navigable
- [ ] Syntax highlighting works
- [ ] Search functional

### Tab: Planner
- [ ] Tab accessible
- [ ] Transformation steps display
- [ ] Steps are ordered
- [ ] Status indicators present
- [ ] Can expand step details

### Tab: Preview
- [ ] Tab accessible
- [ ] Before/after split view
- [ ] Diff highlighting works
- [ ] Can toggle view mode
- [ ] Changes clearly visible

---

## 6. Design System Verification

### Typography
- [ ] H1 styling consistent
- [ ] H2 styling consistent
- [ ] H3 styling consistent
- [ ] Body text consistent
- [ ] Caption text consistent
- [ ] Code/mono text consistent
- [ ] Line heights appropriate
- [ ] Font weights correct

### Spacing
- [ ] Page margins consistent
- [ ] Component padding consistent
- [ ] Gap between elements consistent
- [ ] Section spacing consistent
- [ ] Responsive adjustments work

### Colors
- [ ] Primary color matches tokens
- [ ] Secondary colors match
- [ ] Accent colors match
- [ ] Success/warning/error colors
- [ ] Background colors consistent
- [ ] Text colors appropriate contrast

### Dark Mode
- [ ] Toggle works
- [ ] All components adapt
- [ ] No contrast issues
- [ ] Images/icons visible
- [ ] Charts readable
- [ ] No flash on load

### States

**Loading States**
- [ ] Skeleton loaders present
- [ ] Spinners where appropriate
- [ ] Progress indicators work
- [ ] No blank screens during load

**Empty States**
- [ ] Empty message displayed
- [ ] Helpful guidance provided
- [ ] Call-to-action present
- [ ] Illustration/icon appropriate

**Error States**
- [ ] Error boundaries catch crashes
- [ ] User-friendly messages
- [ ] Recovery options provided
- [ ] No raw error dumps

---

## 7. Terminology Audit

### Prohibited Terms

**"Agent" → "Cognate"**
- [ ] Navigation labels
- [ ] Page titles
- [ ] Button labels
- [ ] Modal headers
- [ ] Tooltips
- [ ] Help text
- [ ] Error messages

**"Workflow" → "Narrative"**
- [ ] Navigation labels
- [ ] Page titles
- [ ] Button labels
- [ ] Card titles
- [ ] Descriptions
- [ ] Status messages

**"CX83" → Removed**
- [ ] No occurrences in UI
- [ ] No occurrences in console
- [ ] No occurrences in network
- [ ] No occurrences in localStorage

**"X83" → "S1"**
- [ ] Code references updated
- [ ] UI labels updated
- [ ] Documentation updated

### Verification Method
```bash
# Run from project root
grep -ri "agent" src/ --include="*.tsx" --include="*.ts" | grep -v "Cognate" | grep -v "user-agent"
grep -ri "workflow" src/ --include="*.tsx" --include="*.ts" | grep -v "Narrative"
grep -ri "CX83" src/
grep -ri "X83" src/ | grep -v "S1"
```

---

## 8. Performance

### Load Times
- [ ] Initial load < 3 seconds
- [ ] Route transitions < 500ms
- [ ] Modal opens < 200ms
- [ ] Search results < 1 second
- [ ] NEXIS graph < 5 seconds (lazy)

### Visual Stability
- [ ] No layout shifts during load
- [ ] Images have dimensions
- [ ] Fonts load smoothly
- [ ] No content jumps
- [ ] Scrollbar doesn't cause shifts

### Resource Management
- [ ] NEXIS graph lazy-loaded
- [ ] Images optimized
- [ ] Unused routes not loaded
- [ ] Memory usage stable
- [ ] No render thrashing
- [ ] No infinite loops

### Metrics (if available)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

## 9. Accessibility (A11y)

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Skip links present
- [ ] Modal trap works
- [ ] Escape closes modals

### Screen Reader
- [ ] ARIA labels present
- [ ] Roles appropriate
- [ ] Live regions announce
- [ ] Images have alt text
- [ ] Form labels associated

### Visual
- [ ] Color not sole indicator
- [ ] Contrast ratios pass
- [ ] Text scalable to 200%
- [ ] Motion can be reduced

---

## 10. Final Demo Tracks

### Track A: Quick Overview (3 minutes)

**Setup**
- [ ] Demo panel accessible
- [ ] "Active Operations" scenario loaded
- [ ] Timer ready

**Checkpoints**
- [ ] 0:00 - Home dashboard loads
- [ ] 0:30 - Navigate to Spaces
- [ ] 1:00 - Show Cognate roster
- [ ] 1:30 - Open Cognate detail
- [ ] 2:00 - Show running automation
- [ ] 2:30 - Symbios quick interaction
- [ ] 3:00 - Return to dashboard

**Wow Moments**
- [ ] CognateDock animation
- [ ] Real-time status updates

### Track B: Feature Deep-Dive (5 minutes)

**Setup**
- [ ] Demo panel accessible
- [ ] "Clean Slate" scenario loaded
- [ ] Timer ready

**Checkpoints**
- [ ] 0:00 - Start at Home
- [ ] 1:00 - Create new Cognate
- [ ] 2:00 - Assign to Space
- [ ] 2:30 - Install Pack
- [ ] 3:30 - Run simulation
- [ ] 4:00 - Review results
- [ ] 4:30 - Show in Ledger
- [ ] 5:00 - Wrap up

**Wow Moments**
- [ ] Cognate creation flow
- [ ] SimulationDiff visualization
- [ ] Ledger audit trail

### Track C: Full Narrative (7 minutes)

**Setup**
- [ ] Demo panel accessible
- [ ] "Pattern Opportunity" scenario
- [ ] Timer ready

**Checkpoints**
- [ ] 0:00 - Executive dashboard
- [ ] 1:00 - NEXIS insight discovery
- [ ] 2:00 - Create automation from insight
- [ ] 3:00 - Configure in LUX Builder
- [ ] 4:00 - Run with approval flow
- [ ] 5:00 - Pattern compilation
- [ ] 6:00 - C2S2 code preview
- [ ] 7:00 - Budget and wrap-up

**Wow Moments**
- [ ] NEXIS graph navigation
- [ ] LUX drag-and-drop
- [ ] Pattern compilation widget
- [ ] C2S2 before/after preview

---

## 11. Sign-Off

### QA Completed By
- **Name**: ________________________
- **Date**: ________________________
- **Environment**: [ ] Dev / [ ] Staging / [ ] Prod

### Build Information
- **Commit**: ________________________
- **Branch**: ________________________
- **Version**: ________________________

### Issues Found
| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| | | | |
| | | | |
| | | | |

### Final Status
- [ ] **PASS** - Ready for demo
- [ ] **CONDITIONAL PASS** - Minor issues, proceed with caution
- [ ] **FAIL** - Critical issues must be resolved

### Notes
```
[Additional observations, workarounds, or recommendations]
```

---

*End of QA Checklist*
