# PRO_DEMO_BUILD_BLUEPRINT.md

> Symtex Pro VC Demo Build - Master Blueprint
> Version: 1.0.0 | Last Updated: 2026-01-21

---

## 1. Executive Summary

This document defines the canonical structure, decisions, and phase gates for the Symtex Pro VC demo build. It serves as the authoritative reference for all implementation work.

**Primary Objective:** Deliver a polished interactive demo that feels like an "AI operating system" with guided demo flows, no dead ends, and clear trust + safety lifecycle.

---

## 2. Non-Negotiable Constraints

### 2.1 Terminology (MANDATORY)

| Never Use | Always Use |
|-----------|------------|
| agents | Cognates |
| workflows | Narratives |
| CX83 | Symtex |
| X83 language | S1 / Symtex Script |

### 2.2 Brand

- Company: **Symtex LLC**
- No inflated/unverified marketing metrics
- Legacy route compatibility via redirects only; legacy terms must not appear in navigation or UI copy

---

## 3. Canonical Navigation Model

**DECISION: Option A (OS-nav)**

### 3.1 L1 Navigation Items (8 total)

| # | Label | Route | Description |
|---|-------|-------|-------------|
| 1 | Home | `/` | Dashboard with signals, quick actions, activity |
| 2 | Spaces | `/spaces` | Domain/Project/Mission hierarchy + context tree |
| 3 | Knowledge | `/knowledge` | Library, templates, NEXIS graph |
| 4 | Runs | `/runs` | Automation executions, run history, trace |
| 5 | Team | `/team` | Cognate roster, training, SOPs |
| 6 | Signals | `/signals` | Insights, ROI metrics, pattern compilation |
| 7 | Control | `/control` | Governance, approvals, policies, LUX builder, C2S2 |
| 8 | Symbios | `/symbios` | AI chat interface (was /chat, /conversations) |

### 3.2 Rationale

Option A provides:
- Flatter, more "OS-like" feel (commandable, stateful)
- Clear mental model mapping: WHO (Team/Cognates), WHAT (Runs), WHY (Knowledge), WHERE (Spaces)
- Reduced cognitive load vs 15+ item sprawl
- Better alignment with trust lifecycle: Intent → Plan → Simulate → Run → Trace → Review → Compile → Signal

### 3.3 Section Breakdown

**Home** (`/`)
- Signals widget
- Quick actions
- Recent contexts
- Active missions
- Cognate activity

**Spaces** (`/spaces`)
- Domain/Project/Mission hierarchy
- Space settings
- Context tree navigation

**Knowledge** (`/knowledge`)
- `/knowledge/library` - Document library
- `/knowledge/templates` - Prompt templates
- `/knowledge/nexis` - NEXIS entity graph
- `/knowledge/graph` - 3D knowledge visualization

**Runs** (`/runs`)
- `/runs` - Run history and status
- `/runs/:id` - Run detail with trace
- `/runs/:id/trace` - Full execution trace
- Automation portfolio (moved from /studio/automations)

**Team** (`/team`)
- `/team/cognates` - Cognate roster
- `/team/cognates/:id` - Cognate detail
- `/team/cognates/:id/sops` - SOP management
- `/team/cognates/:id/packs` - Pack browser
- `/team/cognates/:id/training` - Training dashboard
- `/team/cognates/:id/bootstrap` - Bootstrap wizard

**Signals** (`/signals`)
- ROI dashboard
- Pattern compilation metrics
- Cost savings analysis
- Performance insights

**Control** (`/control`)
- `/control` - Governance command center
- `/control/concord` - Concord collaboration
- `/control/approvals` - Approval queue
- `/control/policies` - Policy management
- `/control/lux` - LUX visual builder
- `/control/c2s2` - C2S2 code transformation
- `/control/narrative` - Narrative builder

**Symbios** (`/symbios`)
- Chat interface
- Conversation history
- Reports

---

## 4. Repository Structure

```
symtex-prototype/
├── docs/                          # Documentation artifacts
│   ├── PRO_DEMO_BUILD_BLUEPRINT.md
│   ├── PRO_DEMO_ROUTE_MAP.md
│   ├── PRO_DEMO_DATASET_CANON.md
│   ├── PRO_DEMO_DESIGN_SYSTEM.md
│   ├── PRO_DEMO_UX_SPEC.md
│   ├── PRO_DEMO_DEMO_SCRIPT.md
│   ├── PRO_DEMO_QA_CHECKLIST.md
│   └── PRO_DEMO_COMPONENT_SELECTION_MATRIX.md
├── src/
│   ├── components/
│   │   ├── ui/                    # Design system primitives
│   │   ├── cognate/               # Cognate-related components
│   │   │   └── CognateDock.tsx    # Persistent "alive" dock
│   │   ├── home/                  # Dashboard widgets
│   │   ├── context/               # Breadcrumbs, space tree
│   │   └── ...
│   ├── features/
│   │   ├── c2s2/                  # C2S2 feature module
│   │   ├── collaboration/         # Approvals, inbox
│   │   ├── insights/              # ROI, pattern compilation
│   │   ├── ledger/                # Audit trail
│   │   ├── nexis/                 # Entity graph
│   │   ├── simulation/            # SimulationDiff
│   │   └── symbios/               # Chat interface
│   ├── hooks/
│   │   └── useCognateEvents.ts    # Trigger event system
│   ├── mocks/                     # Centralized mock data
│   │   ├── index.ts
│   │   ├── spaces.ts
│   │   ├── projects.ts
│   │   ├── cognates.ts
│   │   ├── automations.ts
│   │   ├── runs.ts
│   │   ├── knowledge.ts
│   │   ├── nexis.ts
│   │   ├── policies.ts
│   │   └── ledger.ts
│   ├── routes/                    # Page components
│   │   ├── home/
│   │   ├── spaces/
│   │   ├── knowledge/
│   │   ├── runs/
│   │   ├── team/
│   │   ├── signals/
│   │   ├── control/
│   │   └── symbios/
│   ├── demo/                      # Demo infrastructure
│   │   ├── DemoControlPanel.tsx
│   │   ├── DemoContext.tsx
│   │   ├── scenarios.ts
│   │   └── scenarios/
│   ├── store/                     # Zustand stores
│   ├── styles/                    # CSS tokens
│   │   └── tokens/
│   └── types/                     # TypeScript types
│       └── entities/
├── main.tsx                       # Router configuration
└── App.tsx                        # App shell
```

---

## 5. Phase Gates & Acceptance Criteria

### Wave 0: Bootstrap (Documentation)
**Gate:** All 4 foundation docs exist and are internally consistent
- [ ] PRO_DEMO_BUILD_BLUEPRINT.md complete
- [ ] PRO_DEMO_ROUTE_MAP.md complete with all redirects
- [ ] PRO_DEMO_DATASET_CANON.md complete with all entities
- [ ] PRO_DEMO_DESIGN_SYSTEM.md complete with token references

### Wave 1: Foundation (Nav + Data)
**Gate:** App builds, nav shows 8 L1 items, all redirects work
- [ ] `pnpm build` passes
- [ ] Sidebar shows exactly 8 L1 items
- [ ] All legacy redirects functional
- [ ] `/src/mocks/` contains 10 data files
- [ ] Duplicate Skeleton removed

### Wave 2: Demo Infrastructure
**Gate:** CognateDock renders, demo panel toggles change state
- [ ] CognateDock visible in app
- [ ] Ctrl+Shift+D opens demo panel
- [ ] Scenario toggles update app state
- [ ] Persona switching works
- [ ] Toast rate limiting active

### Wave 3: Workflow Spine
**Gate:** WF1-WF5 can be walked through entry-to-completion
- [ ] WF1: Cognate → Space → Pack → Simulate (with trace link)
- [ ] WF2: Automation → Plan → Simulate → Run → Compile (with trace link)
- [ ] WF3: Knowledge → Cite → Audit event created
- [ ] WF4: NEXIS → Create automation → Run with budget
- [ ] WF5: Policy block → Approve → Rerun

### Wave 4: Advanced Features
**Gate:** C2S2 accessible, all primitives exist
- [ ] `/control/c2s2` route works
- [ ] C2S2 shows "DEMO MODE" label
- [ ] Table, SearchInput, FilterBar, ErrorBanner, PermissionGate exist

### Wave 5: Documentation + Polish
**Gate:** Demo tracks A/B/C complete successfully
- [ ] Track A (3 min) timed and documented
- [ ] Track B (5 min) timed and documented
- [ ] Track C (7 min) timed and documented
- [ ] All "wow moments" functional

### Wave 6: Audit & Fixes
**Gate:** P0/P1 issues resolved
- [ ] `AUDIT_REPORT.md` created
- [ ] All P0 issues fixed
- [ ] All P1 issues fixed
- [ ] Terminology audit passes (`grep -r "agent" src/` = 0 UI-facing)

---

## 6. UI Stack (Confirmed)

| Category | Choice |
|----------|--------|
| Component Library | shadcn/ui (Radix primitives) |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Motion | Framer Motion |
| Graphs | ReactFlow (2D), Recharts (charts) |
| State | Zustand |
| Routing | React Router DOM |

**Rules:**
- Do NOT mix component libraries
- All colors/spacing/typography via tokens
- Legacy components must be wrapped and restyled

---

## 7. Core Mental Model

This mental model must be consistent across all UI:

| Concept | Meaning | Primary Route |
|---------|---------|---------------|
| **Cognates** | WHO executes (operators with skills, autonomy, packs) | `/team/cognates` |
| **Runs** | WHEN it executed (instances with trace/cost/audit) | `/runs` |
| **Knowledge** | WHY it's correct (evidence, citations, provenance) | `/knowledge` |
| **Control** | WHAT is allowed (policies, approvals, audit) | `/control` |
| **Spaces** | WHERE it happens (domains, projects, missions) | `/spaces` |
| **Signals** | HOW it performs (ROI, patterns, insights) | `/signals` |

---

## 8. Trust + Safety Lifecycle

Every demo flow must demonstrate this lifecycle:

```
Intent → Explain Plan → Simulate → Run → Trace → Review → Compile Pattern → Signal
```

**UI Coupling Rules:**
- Cognate page includes "Run something" (automation picker + safe ladder)
- Run page always includes: Operator + Definition + Evidence + Policy + Cost + Controls
- Automation page includes "Choose operator" (Cognate picker + policy context)

---

## 9. "Wow" Moments Checklist

Each must be achievable via demo panel:

1. [ ] **Explain Plan** - Shows touched systems, permissions, budget cap
2. [ ] **Simulation Diff** - Before/after "what would change"
3. [ ] **Approval Gate** - Human-readable policy reason
4. [ ] **Trace Timeline** - Evidence/citations panel
5. [ ] **Compile Pattern** - "This step is now deterministic/cheaper"
6. [ ] **NEXIS → Automation** - Create automation from insight
7. [ ] **Symbios Command** - "Open last run; explain why blocked; request approval"

---

## 10. Avoid List (Hard Constraints)

- [ ] No `dangerouslySetInnerHTML` or unsanitized HTML
- [ ] No multiple competing command palettes
- [ ] No L1 nav sprawl (>10 items)
- [ ] No deep graph rendering on initial load
- [ ] No animations without meaning
- [ ] No ambiguous terms ("agent", "workspace" drift)
- [ ] No dead-end "coming soon" pages without CTAs out
- [ ] No copying legacy components without token alignment
- [ ] No 3D graphs as default
- [ ] No "alive" animations that don't map to state

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial creation |
