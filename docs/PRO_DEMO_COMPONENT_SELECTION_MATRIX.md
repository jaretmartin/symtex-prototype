# PRO_DEMO_COMPONENT_SELECTION_MATRIX.md

> **Version**: 1.0.0
> **Last Updated**: 2026-01-21
> **Status**: Active
> **Audience**: Engineering, Product, Design

---

## 1. Purpose

This document captures the component selection decisions for Symtex Pro's demo experience. Each component area has been evaluated against a consistent rubric to ensure quality, maintainability, and demo impact.

---

## 2. Scoring Rubric

Each component area is scored 1-5 on six dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Clarity at first glance** | 20% | Is purpose immediately obvious to viewers? |
| **OS-like feel** | 20% | Does it feel commandable, stateful, professional? |
| **Demo impact** | 20% | Credible wow factor without gimmicks? |
| **Implementation cost** | 15% | Effort to build and maintain? |
| **Performance safety** | 15% | Risk of render issues or jank? |
| **Terminology alignment** | 10% | Uses correct Symtex terminology? |

**Scoring Scale**:
- 5 = Exceptional
- 4 = Good
- 3 = Acceptable
- 2 = Needs work
- 1 = Unacceptable

---

## 3. Component Areas Matrix

### 3.1 App Shell + Sidebar + Topbar

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Layout** | Custom | Fixed sidebar, fluid main, responsive | 280px collapsed, 64px mini |
| **Navigation** | Custom | Option A (8 L1 items) | Home, Symbios, Cognates, Automation, Knowledge, NEXIS, Governance, Signals |
| **Spaces Tree** | Custom | Expandable within Spaces nav item | Domains > Projects > Contexts hierarchy |
| **Theme Toggle** | Custom | Footer of sidebar | System, Light, Dark modes |
| **User Menu** | Custom | Avatar dropdown in topbar | Profile, Settings, Logout |
| **Breadcrumbs** | Custom | BreadcrumbRail in topbar | Context-aware navigation |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Standard app shell pattern, instantly familiar |
| OS-like feel | 5 | Persistent chrome, consistent state |
| Demo impact | 4 | Professional but expected |
| Implementation cost | 4 | Well-structured, maintainable |
| Performance safety | 5 | No performance concerns |
| Terminology | 4 | All labels use correct terms |

**Final Score**: 4.5/5
**Risks**: Mobile drawer needs testing on various viewport sizes
**Mitigation**: Implement responsive breakpoints with drawer fallback

---

### 3.2 Command Palette

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Library** | cmdk (shadcn) | Keep existing | Proven, accessible |
| **Trigger** | Cmd+K / Ctrl+K | Standard keyboard shortcut | Also accessible via topbar button |
| **Search** | Fuzzy matching | Via cmdk built-in | Filters as you type |
| **Groups** | Custom | Actions, Navigation, Cognates, Recent | Organized by category |
| **Actions** | Custom | Quick actions with keyboard hints | e.g., "New Narrative", "Switch Space" |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Universal pattern, immediate understanding |
| OS-like feel | 5 | Spotlight/Alfred-like power user feel |
| Demo impact | 4 | Expected but impressive when shown |
| Implementation cost | 5 | Library handles complexity |
| Performance safety | 5 | Lightweight, virtualized list |
| Terminology | 4 | Uses Cognates, Narratives correctly |

**Final Score**: 4.7/5
**Risks**: None significant
**Dependencies**: cmdk package

---

### 3.3 Symbios Shell

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Chat UI** | Custom | SymbiosChat component | Full-height panel with history |
| **Messages** | Custom | SymbiosMessage with citations | User/assistant differentiation |
| **Input** | Custom | SymbiosInput with commands | Slash commands, attachments |
| **Routing** | Custom | SymbiosRoutingIndicator | Shows which Cognate is responding |
| **Suggestions** | Custom | SymbiosSuggestions | Context-aware quick actions |
| **Floating** | Custom | SymbiosFloatingButton | Persistent access from any page |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Chat interface is universally understood |
| OS-like feel | 4 | Good but could use more OS integrations |
| Demo impact | 4 | Core feature, must work flawlessly |
| Implementation cost | 3 | Complex state management |
| Performance safety | 4 | Streaming text needs optimization |
| Terminology | 5 | Symbios branding consistent |

**Final Score**: 4.2/5
**Risks**: Citation rendering needs verification; streaming text performance
**Mitigation**: Implement virtualized message list for long conversations

---

### 3.4 Cognate Roster + Detail

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Roster** | Custom | Grid layout with status indicators | Shows all Cognates at a glance |
| **Cards** | Custom | CognateCard with avatar, status, metrics | Quick overview per Cognate |
| **Detail** | Custom | Tabs: Overview, SOPs, Packs, Training | Deep dive into configuration |
| **Dock** | Custom NEW | CognateDock with 10 states | Always-visible quick access |
| **Selector** | Custom | CognateSelector for assignments | Used in Narrative builder |
| **Radar** | Custom | PersonalityRadar visualization | Shows personality dimensions |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Clear visual hierarchy |
| OS-like feel | 5 | Dock feels native, persistent |
| Demo impact | 5 | High "wow" factor with animations |
| Implementation cost | 3 | Multiple complex components |
| Performance safety | 4 | Dock animations need care |
| Terminology | 5 | Cognates terminology throughout |

**Final Score**: 4.5/5
**Risks**: Dock animations need reduced-motion support
**Mitigation**: Implement `prefers-reduced-motion` media query handling

---

### 3.5 SOP Editor + Validation

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Editor** | Custom | SOPEditor with visual rule builder | Drag-and-drop rule construction |
| **Rule Builder** | Custom | RuleBuilder component | Condition + Action pairs |
| **Validation** | Custom | ValidationDashboard | Test scenarios against rules |
| **S1 Preview** | Custom | S1Preview component | Shows compiled S1 output |
| **S1 Viewer** | Custom | S1RuleViewer | Read-only S1 display |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 4 | Novel interface, slight learning curve |
| OS-like feel | 4 | Good but unique to Symtex |
| Demo impact | 5 | Differentiating feature |
| Implementation cost | 2 | Complex editor logic |
| Performance safety | 4 | Large rule sets need testing |
| Terminology | 5 | S1, SOPs correctly used |

**Final Score**: 4.0/5
**Risks**: Complex editor needs thorough testing; edge cases in rule compilation
**Mitigation**: Comprehensive test coverage for rule engine

---

### 3.6 Automation Portfolio + Builder

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **List** | Custom | Runs page with DataTable | Sortable, filterable list |
| **LUX Builder** | ReactFlow | Visual node editor | Drag-and-drop Narrative builder |
| **Narrative** | Custom | Story-driven builder | Alternative to visual builder |
| **Node Palette** | Custom | NodePalette component | Available node types |
| **Custom Nodes** | Custom | TriggerNode, ActionNode, etc. | Specialized node renderers |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 4 | Visual builder intuitive, Narrative unique |
| OS-like feel | 5 | ReactFlow provides smooth interactions |
| Demo impact | 5 | Visual builder is highly impressive |
| Implementation cost | 3 | ReactFlow integration complexity |
| Performance safety | 3 | Large graphs need optimization |
| Terminology | 5 | Narratives, LUX correctly used |

**Final Score**: 4.2/5
**Risks**: ReactFlow bundle size (~150KB gzipped); performance with 50+ nodes
**Mitigation**: Lazy load LUX builder; implement viewport culling

---

### 3.7 Runs (Plan/Simulate/Trace/Review)

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Plan** | Custom NEW | ExplainPlan component | Shows what will happen before execution |
| **Simulate** | Custom | SimulationDiff component | Side-by-side comparison |
| **Trace** | Custom NEW | RunTrace page | Step-by-step execution timeline |
| **Review** | Custom NEW | RunReview component | Post-execution analysis |
| **Timeline** | Custom | TimelineView component | Visual run history |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Clear progression: Plan > Simulate > Run > Review |
| OS-like feel | 5 | Feels like debugging a real system |
| Demo impact | 5 | Transparency builds trust |
| Implementation cost | 3 | Multiple new components |
| Performance safety | 3 | Long traces need pagination |
| Terminology | 4 | Good alignment |

**Final Score**: 4.2/5
**Risks**: Trace timeline needs pagination for runs with 100+ steps
**Mitigation**: Implement virtualized timeline with lazy loading

---

### 3.8 Knowledge Library + Ingest

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Library** | Custom | Document list with filters | Grid/list toggle, search |
| **Ingest** | Custom NEW | IngestModal component | Guided document upload |
| **Citations** | Custom | In SymbiosMessage | Linked to source documents |
| **Graph** | Custom | KnowledgeGraph3D | Visual document relationships |
| **Templates** | Custom | TemplateCard grid | Reusable document templates |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Familiar file browser pattern |
| OS-like feel | 4 | Good but could mirror Finder/Explorer more |
| Demo impact | 4 | Solid but not differentiating |
| Implementation cost | 4 | Straightforward implementation |
| Performance safety | 4 | Graph may need limits |
| Terminology | 4 | Correct terms used |

**Final Score**: 4.2/5
**Risks**: 3D graph performance with many documents
**Mitigation**: Limit visible nodes; implement clustering

---

### 3.9 NEXIS (Graph/Entity/Insights)

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Graph** | ReactFlow | 2D node graph | Entity relationship visualization |
| **Entity Card** | Custom | NexisContactCard | Detailed entity view |
| **Insights** | Custom | NexisInsightPanel | AI-generated relationship insights |
| **Search** | Custom | Entity search with filters | Find specific entities |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 4 | Graph visualization has learning curve |
| OS-like feel | 4 | Interactive but specialized |
| Demo impact | 5 | Visually impressive |
| Implementation cost | 3 | Graph complexity |
| Performance safety | 3 | Large graphs challenging |
| Terminology | 5 | NEXIS branding consistent |

**Final Score**: 4.0/5
**Risks**: Graph performance with 200+ entities
**Mitigation**: Progressive disclosure; show top entities, expand on demand

---

### 3.10 Governance (Policies/Approvals/Audit)

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Policies** | Custom | PolicyCard list | Rule definitions with status |
| **Approvals** | Custom | ApprovalQueue + ApprovalCard | Pending items for human review |
| **Ledger** | Custom | LedgerViewer with 6 W's | Complete audit trail |
| **Command Center** | Custom | CommandCenter dashboard | System overview |
| **Health** | Custom | SystemHealthGauge | Real-time metrics |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Enterprise governance patterns familiar |
| OS-like feel | 5 | Command center feels authoritative |
| Demo impact | 5 | Critical for enterprise buyers |
| Implementation cost | 4 | Well-scoped components |
| Performance safety | 5 | No complex rendering |
| Terminology | 5 | Correct governance terms |

**Final Score**: 4.8/5
**Risks**: None significant
**Notes**: Critical differentiator for enterprise sales

---

### 3.11 Signals Dashboards

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Charts** | Recharts | ROI, patterns, trends | Line, bar, area charts |
| **Cards** | Custom | MetricCard | KPI display |
| **Widgets** | Custom | PatternCompilationWidget | Usage insights |
| **ROI** | Custom | ROIDashboard | Value demonstration |
| **Ratio** | Custom | SymbolicRatioGauge | Key metric visualization |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Dashboard patterns well-established |
| OS-like feel | 4 | Standard analytics feel |
| Demo impact | 4 | Expected but necessary |
| Implementation cost | 4 | Recharts handles complexity |
| Performance safety | 3 | Many charts can lag |
| Terminology | 4 | Good alignment |

**Final Score**: 4.0/5
**Risks**: Chart bundle size (~50KB gzipped); rendering many charts simultaneously
**Mitigation**: Lazy load charts; implement viewport-based rendering

---

### 3.12 Demo Control Panel

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Panel** | Custom | DemoControlPanel | Floating control interface |
| **Scenarios** | Custom | scenarios.ts engine | Scripted demo flows |
| **Context** | Custom | DemoContext provider | Global demo state |
| **Indicators** | Custom | Demo mode badges | Clear demo labeling |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 5 | Demo controls obvious |
| OS-like feel | N/A | Not visible to end users |
| Demo impact | 5 | Enables smooth demonstrations |
| Implementation cost | 4 | Well-architected |
| Performance safety | 5 | Minimal overhead |
| Terminology | 5 | Correct terms |

**Final Score**: 5.0/5
**Risks**: None - critical for demo success
**Notes**: Foundation for all demo scenarios

---

### 3.13 C2S2 Feature

| Aspect | Source | Decision | Notes |
|--------|--------|----------|-------|
| **Dashboard** | Custom NEW | C2S2Dashboard | Overview of C2S2 capabilities |
| **Explorer** | Custom NEW | C2S2Explorer | Browse C2S2 patterns |
| **Planner** | Custom NEW | C2S2Planner | Plan C2S2 implementations |
| **Preview** | Custom NEW | C2S2Preview | Preview C2S2 output |

**Scores**:
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Clarity | 4 | Novel feature, needs explanation |
| OS-like feel | 4 | Consistent with other areas |
| Demo impact | 4 | Interesting but demo-only |
| Implementation cost | 4 | Scoped appropriately |
| Performance safety | 5 | Simple rendering |
| Terminology | 4 | New terminology introduced |

**Final Score**: 4.2/5
**Risks**: Demo-only feature must be clearly labeled
**Mitigation**: "Preview" badge on all C2S2 components

---

## 4. Design System Primitives

### Core Components

| Component | Source | Status | Notes |
|-----------|--------|--------|-------|
| Button | Custom CVA | Complete | Primary, secondary, ghost, destructive variants |
| Card | shadcn | Complete | Standard card with header/content/footer |
| Dialog | shadcn/Radix | Complete | Modal with animations |
| Input | Custom | Complete | With label, error states |
| Select | shadcn/Radix | Complete | Dropdown with search |
| Tabs | shadcn/Radix | Complete | Horizontal tabs |
| Tooltip | shadcn/Radix | Complete | Hover tooltips |
| Avatar | shadcn/Radix | Complete | User/Cognate avatars |
| Progress | shadcn/Radix | Complete | Linear progress bars |
| Switch | shadcn/Radix | Complete | Toggle switches |

### New Primitives (Pro)

| Component | Source | Status | Notes |
|-----------|--------|--------|-------|
| DataTable | Custom NEW | Complete | Sortable, filterable tables |
| SearchInput | Custom NEW | Complete | With icon, clear button |
| FilterBar | Custom NEW | Complete | Multi-select filters |
| ErrorBanner | Custom NEW | Complete | Error/warning/info states |
| PermissionGate | Custom NEW | Complete | Role-based UI visibility |
| EmptyState | Custom | Complete | Consistent empty views |
| LoadingSkeleton | Custom | Complete | Content placeholders |

### Design Tokens

| Token Category | Source | Status |
|----------------|--------|--------|
| Colors | Tailwind + Custom | Complete |
| Typography | Tailwind | Complete |
| Spacing | Tailwind | Complete |
| Shadows | Tailwind + Custom | Complete |
| Animations | Framer Motion | Complete |
| Icons | Lucide React | Complete |

---

## 5. Summary

### Overall Score: 4.3/5

### Strengths

1. **Cohesive design system** - Consistent patterns across all component areas
2. **Full workflow coverage** - Every major user journey has dedicated components
3. **Demo infrastructure solid** - DemoContext and scenarios enable smooth presentations
4. **Terminology alignment** - Cognates, Narratives, S1, Symbios used correctly
5. **Accessibility foundation** - Radix primitives provide ARIA support

### Areas to Watch

| Area | Concern | Priority | Mitigation |
|------|---------|----------|------------|
| Bundle size | vendor-icons large (~200KB) | Medium | Tree-shake unused icons |
| Graph performance | NEXIS/Knowledge with many nodes | High | Viewport culling, clustering |
| Mobile responsiveness | Sidebar, complex tables | Medium | Responsive breakpoints, drawer |
| Reduced motion | Dock and other animations | Medium | prefers-reduced-motion support |
| Long lists | Traces, Ledger entries | Low | Virtual scrolling |

### Component Count Summary

| Category | Count | New for Pro |
|----------|-------|-------------|
| Shell components | 8 | 2 |
| Symbios components | 6 | 1 |
| Cognate components | 12 | 3 |
| SOP components | 5 | 0 |
| Automation components | 8 | 2 |
| Runs components | 5 | 4 |
| Knowledge components | 5 | 1 |
| NEXIS components | 4 | 0 |
| Governance components | 8 | 0 |
| Signals components | 5 | 0 |
| Demo components | 3 | 0 |
| C2S2 components | 4 | 4 |
| Design primitives | 17 | 5 |
| **Total** | **90** | **22** |

### Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-21 | Use ReactFlow for LUX and NEXIS | Industry standard, good performance |
| 2026-01-21 | Keep cmdk for Command Palette | Proven, accessible, low maintenance |
| 2026-01-21 | Custom CognateDock | Differentiating feature, OS-like feel |
| 2026-01-21 | Recharts for analytics | Smaller than alternatives, sufficient |
| 2026-01-21 | Radix for primitives | Accessibility built-in, unstyled |

---

## 6. Appendix: Component Dependencies

```
App Shell
├── Sidebar
│   ├── SpaceTree
│   ├── NavItems
│   └── ThemeToggle
├── Topbar
│   ├── BreadcrumbRail
│   ├── SearchInput
│   └── UserMenu
└── Main Content Area

Symbios Shell
├── SymbiosChat
│   ├── SymbiosMessage
│   │   └── Citations
│   ├── SymbiosInput
│   └── SymbiosSuggestions
├── SymbiosRoutingIndicator
└── SymbiosFloatingButton

Cognate System
├── CognateRoster
│   └── CognateCard
├── CognateDetail
│   ├── Overview Tab
│   ├── SOPs Tab
│   ├── Packs Tab
│   └── Training Tab
├── CognateDock
└── CognateSelector

Automation System
├── RunsList (DataTable)
├── LUX Builder
│   ├── LuxCanvas
│   ├── NodePalette
│   └── Custom Nodes
└── NarrativeBuilder
    ├── NarrativeInput
    └── NarrativePreview
```

---

*Document maintained by Engineering Team*
*Next review: 2026-02-21*
