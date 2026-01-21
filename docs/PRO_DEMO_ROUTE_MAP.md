# PRO_DEMO_ROUTE_MAP.md

> Symtex Pro - Canonical Route Map & Legacy Redirects
> Version: 1.0.0 | Last Updated: 2026-01-21

---

## 1. L1 Navigation Routes

These 8 routes appear in the main sidebar navigation.

| # | Label | Route | Component | Description |
|---|-------|-------|-----------|-------------|
| 1 | Home | `/` | `routes/home/index.tsx` | Dashboard |
| 2 | Spaces | `/spaces` | `routes/spaces/index.tsx` | Space hierarchy |
| 3 | Knowledge | `/knowledge` | `routes/knowledge/index.tsx` | Knowledge hub |
| 4 | Runs | `/runs` | `routes/runs/index.tsx` | Run history |
| 5 | Team | `/team` | `routes/team/index.tsx` | Cognate roster |
| 6 | Signals | `/signals` | `routes/signals/index.tsx` | Insights & ROI |
| 7 | Control | `/control` | `routes/control/index.tsx` | Governance |
| 8 | Symbios | `/symbios` | `routes/symbios/index.tsx` | AI chat |

---

## 2. Full Route Hierarchy

### 2.1 Home (`/`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `routes/home/index.tsx` | Main dashboard |

**Widgets rendered:**
- SignalsWidget (Signals summary)
- QuickActionsWidget
- ActiveMissionsWidget
- CognateActivityWidget
- RecentContextsWidget
- AIBudgetStatus

---

### 2.2 Spaces (`/spaces`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/spaces` | `routes/spaces/index.tsx` | Space overview |
| `/spaces/:spaceId` | `routes/spaces/[spaceId]/index.tsx` | Space detail |
| `/spaces/:spaceId/settings` | `routes/spaces/[spaceId]/settings.tsx` | Space settings |
| `/spaces/:spaceId/projects/:projectId` | `routes/spaces/[spaceId]/projects/[projectId]/index.tsx` | Project detail |
| `/spaces/:spaceId/missions/:missionId` | `routes/spaces/[spaceId]/missions/[missionId]/index.tsx` | Mission detail |

---

### 2.3 Knowledge (`/knowledge`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/knowledge` | `routes/knowledge/index.tsx` | Knowledge hub landing |
| `/knowledge/library` | `routes/knowledge/library.tsx` | Document library |
| `/knowledge/templates` | `routes/knowledge/templates.tsx` | Prompt templates |
| `/knowledge/nexis` | `routes/knowledge/nexis.tsx` | NEXIS entity graph |
| `/knowledge/graph` | `routes/knowledge/graph.tsx` | 3D knowledge visualization |

---

### 2.4 Runs (`/runs`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/runs` | `routes/runs/index.tsx` | Run history list |
| `/runs/:runId` | `routes/runs/[runId]/index.tsx` | Run detail |
| `/runs/:runId/trace` | `routes/runs/[runId]/trace.tsx` | Execution trace |
| `/runs/:runId/evidence` | `routes/runs/[runId]/evidence.tsx` | Evidence panel |

---

### 2.5 Team (`/team`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/team` | `routes/team/index.tsx` | Team overview / Cognate roster |
| `/team/cognates` | `routes/team/cognates/index.tsx` | Cognate list |
| `/team/cognates/new` | `routes/team/cognates/new.tsx` | Create Cognate |
| `/team/cognates/:id` | `routes/team/cognates/[id]/index.tsx` | Cognate detail |
| `/team/cognates/:id/sops` | `routes/team/cognates/[id]/sops.tsx` | SOP management |
| `/team/cognates/:id/sops/rules` | `routes/team/cognates/[id]/sops/rules.tsx` | S1 rule viewer |
| `/team/cognates/:id/sops/validate` | `routes/team/cognates/[id]/sops/validate.tsx` | SOP validation |
| `/team/cognates/:id/packs` | `routes/team/cognates/[id]/packs.tsx` | Pack browser |
| `/team/cognates/:id/training` | `routes/team/cognates/[id]/training.tsx` | Training dashboard |
| `/team/cognates/:id/bootstrap` | `routes/team/cognates/[id]/bootstrap.tsx` | Bootstrap wizard |

---

### 2.6 Signals (`/signals`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/signals` | `routes/signals/index.tsx` | Signals dashboard |
| `/signals/roi` | `routes/signals/roi.tsx` | ROI dashboard |
| `/signals/patterns` | `routes/signals/patterns.tsx` | Pattern compilation |
| `/signals/performance` | `routes/signals/performance.tsx` | Performance metrics |

---

### 2.7 Control (`/control`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/control` | `routes/control/index.tsx` | Governance command center |
| `/control/approvals` | `routes/control/approvals.tsx` | Approval queue |
| `/control/policies` | `routes/control/policies.tsx` | Policy management |
| `/control/concord` | `routes/control/concord.tsx` | Concord collaboration |
| `/control/lux` | `routes/control/lux.tsx` | LUX visual builder |
| `/control/narrative` | `routes/control/narrative.tsx` | Narrative builder |
| `/control/c2s2` | `routes/control/c2s2.tsx` | C2S2 code transformation |
| `/control/ledger` | `routes/control/ledger.tsx` | Audit ledger |

---

### 2.8 Symbios (`/symbios`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/symbios` | `routes/symbios/index.tsx` | Chat interface |
| `/symbios/history` | `routes/symbios/history.tsx` | Conversation list |
| `/symbios/:conversationId` | `routes/symbios/[conversationId]/index.tsx` | Conversation detail |
| `/symbios/reports` | `routes/symbios/reports.tsx` | Generated reports |

---

### 2.9 Settings (`/settings`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/settings` | `routes/settings/index.tsx` | Settings landing |
| `/settings/profile` | `routes/settings/profile.tsx` | User profile |
| `/settings/budget` | `routes/settings/budget.tsx` | Budget management |
| `/settings/integrations` | `routes/settings/integrations.tsx` | Integrations |

---

## 3. Legacy Redirects

All legacy routes must redirect to their canonical equivalents.

| Legacy Route | Redirects To | Status |
|--------------|--------------|--------|
| `/dashboard` | `/` | TO ADD |
| `/chat` | `/symbios` | EXISTS |
| `/conversations` | `/symbios` | EXISTS (→/chat) |
| `/automations` | `/runs` | TO ADD |
| `/studio/automations` | `/runs` | TO ADD |
| `/lux` | `/control/lux` | TO ADD |
| `/studio/lux` | `/control/lux` | TO ADD |
| `/cognates` | `/team/cognates` | TO ADD |
| `/studio/cognates` | `/team/cognates` | TO ADD |
| `/studio/cognates/:id` | `/team/cognates/:id` | TO ADD |
| `/studio/cognates/:id/sops` | `/team/cognates/:id/sops` | TO ADD |
| `/studio/cognates/:id/packs` | `/team/cognates/:id/packs` | TO ADD |
| `/studio/cognates/:id/bootstrap` | `/team/cognates/:id/bootstrap` | TO ADD |
| `/studio/cognates/:id/training` | `/team/cognates/:id/training` | TO ADD |
| `/studio/agents` | `/team/cognates` | EXISTS |
| `/studio/narrative` | `/control/narrative` | TO ADD |
| `/command` | `/control` | TO ADD |
| `/governance` | `/control` | TO ADD |
| `/governance/concord` | `/control/concord` | TO ADD |
| `/concord` | `/control/concord` | TO ADD |
| `/nexis` | `/knowledge/nexis` | TO ADD |
| `/c2s1` | `/control/c2s2` | TO ADD |
| `/activity` | `/` | EXISTS |
| `/build` | `/runs` | EXISTS (→/missions) |
| `/missions` | `/runs` | TO UPDATE |
| `/dna` | `/signals` | TO ADD |
| `/analytics` | `/signals` | TO ADD |
| `/library/templates` | `/knowledge/templates` | TO ADD |
| `/library/knowledge` | `/knowledge/library` | TO ADD |

---

## 4. Command Palette Only Routes

These routes are accessible via command palette (Cmd+K) but not in sidebar nav.

| Route | Access | Description |
|-------|--------|-------------|
| `/settings/*` | Cmd+K → "Settings" | All settings pages |
| `/debug` | Cmd+K → "Debug" | Debug panel (dev only) |
| `/demo` | Ctrl+Shift+D | Demo control panel |

---

## 5. Demo Mode Only Routes

These routes are only visible when demo mode is active.

| Route | Description |
|-------|-------------|
| `/demo/scenario/:scenarioId` | Jump to demo scenario |
| `/demo/wow/:momentId` | Jump to wow moment |

---

## 6. 404 / Not Found

| Route | Component | Description |
|-------|-----------|-------------|
| `*` | `routes/NotFound.tsx` | Catch-all 404 |

**Not Found page must include:**
- Clear "Page not found" message
- Link back to Home
- Search suggestion
- Report issue link

---

## 7. Route Guards

| Guard | Routes | Behavior |
|-------|--------|----------|
| `DemoModeRequired` | `/demo/*` | Only accessible in demo mode |
| `FeatureFlagRequired(c2s2)` | `/control/c2s2` | Requires C2S2 feature flag |
| `FeatureFlagRequired(nexis)` | `/knowledge/nexis` | Requires NEXIS feature flag |

---

## 8. Implementation Notes

### 8.1 Redirect Implementation

```typescript
// In main.tsx
<Route path="/dashboard" element={<Navigate to="/" replace />} />
<Route path="/automations" element={<Navigate to="/runs" replace />} />
<Route path="/studio/automations" element={<Navigate to="/runs" replace />} />
<Route path="/lux" element={<Navigate to="/control/lux" replace />} />
<Route path="/studio/lux" element={<Navigate to="/control/lux" replace />} />
<Route path="/cognates" element={<Navigate to="/team/cognates" replace />} />
<Route path="/studio/cognates" element={<Navigate to="/team/cognates" replace />} />
<Route path="/studio/cognates/:id" element={<Navigate to="/team/cognates/:id" replace />} />
// ... etc
```

### 8.2 Dynamic Route Parameters

| Parameter | Type | Example |
|-----------|------|---------|
| `:spaceId` | string (slug) | `compliance-ops` |
| `:projectId` | string (slug) | `audit-automation` |
| `:missionId` | string (slug) | `q1-compliance-review` |
| `:runId` | string (uuid) | `run-abc123` |
| `:id` (Cognate) | string (slug) | `cog-compliance-monitor` |
| `:conversationId` | string (uuid) | `conv-xyz789` |
| `:scenarioId` | string | `healthcare`, `financial` |
| `:momentId` | string | `explain-plan`, `approval-gate` |

---

## 9. Route Testing Checklist

For each route:
- [ ] Route renders without error
- [ ] Breadcrumb shows correct path
- [ ] Back button works
- [ ] Command palette can navigate to it
- [ ] No dead ends (always has CTA or back)
- [ ] Loading state shown
- [ ] Error state handled
- [ ] Empty state handled

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial creation |
