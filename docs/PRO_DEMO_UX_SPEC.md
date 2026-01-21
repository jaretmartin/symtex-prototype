# PRO_DEMO_UX_SPEC.md

> Symtex Pro - UX Specification for Demo Workflows
> Version: 1.0.0 | Last Updated: 2026-01-21

---

## 1. Overview

This document specifies the screen-by-screen flows for each demo workflow in Symtex Pro. It defines entry points, screen transitions, UI elements, and completion criteria for all five canonical workflows.

### Document Scope
- **WF1**: Cognate Creation Flow
- **WF2**: Automation Lifecycle Flow
- **WF3**: Knowledge Citation Flow
- **WF4**: NEXIS Insight Flow
- **WF5**: Policy Approval Flow

### Reference Documents
- `PRO_DEMO_BUILD_BLUEPRINT.md` - Master blueprint and constraints
- `PRO_DEMO_ROUTE_MAP.md` - Route definitions and redirects
- `PRO_DEMO_DATASET_CANON.md` - Mock data entities
- `PRO_DEMO_DESIGN_SYSTEM.md` - Design tokens and components

---

## 2. Workflow WF1: Cognate Creation Flow

**Purpose**: Demonstrate the complete lifecycle of creating a Cognate, assigning it to a Space, installing capability Packs, and running a simulation.

**Demonstrates**:
- Cognate as intelligent operator (not "agent")
- Trust hierarchy through autonomy levels
- Pack-based capability extension
- Simulation before execution

### 2.1 Entry Points

| Route | Trigger | Context |
|-------|---------|---------|
| `/team/cognates` | Sidebar nav "Team" | Cognate roster view |
| `/team/cognates/new` | "New Cognate" button | Direct creation |
| Command Palette | Cmd+K -> "New Cognate" | Quick access |

### 2.2 Screen Flow

#### Screen 1: Cognate Roster
**Route**: `/team/cognates`

**Layout**:
```
+----------------------------------------------------------+
| Page Header                                               |
| +--------------------------+  +------------------------+ |
| | Cognate Roster           |  | [+ New Cognate]        | |
| | Manage your AI operators |  |                        | |
| +--------------------------+  +------------------------+ |
+----------------------------------------------------------+
| Filter Bar                                               |
| [All Status v] [All Spaces v] [Search...]               |
+----------------------------------------------------------+
| Cognate Grid (or List View)                              |
| +------------------+  +------------------+               |
| | Compliance       |  | Audit            |               |
| | Monitor          |  | Collector        |               |
| | L2 | 12 SOPs     |  | L3 | 8 SOPs      |               |
| | [Compliance Ops] |  | [Compliance Ops] |               |
| +------------------+  +------------------+               |
| +------------------+  +------------------+               |
| | Revenue Analyst  |  | Customer Success |               |
| | L3 | 15 SOPs     |  | L2 | 10 SOPs     |               |
| | [Revenue Ops]    |  | [Revenue Ops]    |               |
| +------------------+  +------------------+               |
+----------------------------------------------------------+
```

**Elements**:
- Page title: "Cognate Roster" (`.text-headline`)
- Description: "Manage your AI operators" (`.text-body`)
- Primary CTA: "New Cognate" button (primary variant)
- Filter bar: Status dropdown, Space dropdown, search input
- Grid/List toggle
- Cognate cards with:
  - Avatar
  - Name
  - Autonomy level badge (L1/L2/L3)
  - SOP count
  - Assigned space badge
  - Status indicator

**States**:
- Loading: Skeleton cards (6 placeholders)
- Empty: EmptyState with "Create your first Cognate" CTA
- Error: ErrorBanner with retry

**Actions**:
- Click card -> Navigate to Cognate Detail
- Click "New Cognate" -> Navigate to Create Cognate

---

#### Screen 2: Create Cognate
**Route**: `/team/cognates/new`

**Layout**:
```
+----------------------------------------------------------+
| Breadcrumb: Team / Cognates / New                        |
+----------------------------------------------------------+
| Page Header                                               |
| Create Cognate                                            |
| Configure your new AI operator                            |
+----------------------------------------------------------+
| Form Card                                                 |
| +------------------------------------------------------+ |
| | Basic Information                                     | |
| | Name*         [______________________]                | |
| | Description*  [______________________]                | |
| |               [______________________]                | |
| +------------------------------------------------------+ |
| | Autonomy Level                                        | |
| | (i) Controls how independently this Cognate acts     | |
| |                                                       | |
| | [L1] Human Required - Every action needs approval    | |
| | [L2] Human Review - Reviews before high-risk actions | |
| | [L3] Autonomous - Acts on safe tasks independently   | |
| +------------------------------------------------------+ |
| | Space Assignment (Optional)                          | |
| | [Select a space...                            v]     | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Footer                                                    |
| [Cancel]                              [Create Cognate]   |
+----------------------------------------------------------+
```

**Elements**:
- Breadcrumb navigation
- Form sections:
  - Basic Information (name, description)
  - Autonomy Level (radio group with explanations)
  - Space Assignment (optional select)
- Cancel button (ghost variant)
- Create button (primary variant, disabled until valid)

**Validation**:
- Name: Required, 2-50 characters
- Description: Required, 10-500 characters
- Autonomy: Required, one of L1/L2/L3

**States**:
- Pristine: Empty form, Create disabled
- Valid: All required fields filled, Create enabled
- Submitting: Create button shows loading spinner
- Error: Inline field errors, form-level error banner

**Actions**:
- Cancel -> Navigate back to `/team/cognates`
- Create -> POST request, navigate to Cognate Detail

---

#### Screen 3: Cognate Detail
**Route**: `/team/cognates/:id`

**Layout**:
```
+----------------------------------------------------------+
| Breadcrumb: Team / Cognates / Compliance Monitor         |
+----------------------------------------------------------+
| Header Row                                                |
| +--------+                                                |
| |  [A]   | Compliance Monitor           [Edit] [...]     |
| +--------+ L2 Autonomy | 12 SOPs | Active                |
|           Monitors regulatory requirements...             |
+----------------------------------------------------------+
| Tab Bar: [Overview] [SOPs] [Packs] [Training] [Activity] |
+----------------------------------------------------------+
| Overview Content                                          |
| +------------------------+  +---------------------------+ |
| | Assigned Space         |  | Performance Stats         | |
| | Compliance Ops         |  | Tasks: 156   Accuracy: 94%| |
| | [Change Space]         |  | Avg Time: 2.3 min         | |
| +------------------------+  +---------------------------+ |
| +------------------------+  +---------------------------+ |
| | Installed Packs (2)    |  | Quick Actions             | |
| | - SOC2 Compliance      |  | [Browse Packs]            | |
| | - GDPR Toolkit         |  | [Manage SOPs]             | |
| | [Browse More Packs]    |  | [Simulate Run]            | |
| +------------------------+  +---------------------------+ |
+----------------------------------------------------------+
| Recent Activity                                           |
| - Completed: Daily Compliance Report (2 min ago)         |
| - Running: Policy Gap Analysis (in progress)             |
+----------------------------------------------------------+
```

**Elements**:
- Cognate avatar (64px)
- Name, autonomy badge, SOP count, status badge
- Tab navigation:
  - Overview (default)
  - SOPs
  - Packs
  - Training
  - Activity
- Overview cards:
  - Assigned Space (with change action)
  - Performance Stats
  - Installed Packs (with browse action)
  - Quick Actions
- Recent activity list

**States**:
- Loading: Skeleton layout
- No Space: "Assign to Space" CTA prominent
- No Packs: "Install your first Pack" CTA

**Actions**:
- "Change Space" -> Space picker modal
- "Browse Packs" -> Navigate to Packs tab
- "Manage SOPs" -> Navigate to SOPs tab
- "Simulate Run" -> Open Simulation modal

---

#### Screen 4: Pack Browser
**Route**: `/team/cognates/:id/packs`

**Layout**:
```
+----------------------------------------------------------+
| Breadcrumb: Team / Cognates / Compliance Monitor / Packs |
+----------------------------------------------------------+
| Page Header                                               |
| Capability Packs                                          |
| Extend your Cognate with pre-built skill packs           |
+----------------------------------------------------------+
| Filter Bar                                               |
| [All Categories v] [Search packs...]                     |
+----------------------------------------------------------+
| Installed Packs                                          |
| +------------------------+  +---------------------------+ |
| | SOC2 Compliance        |  | GDPR Toolkit              | |
| | 8 SOPs | 12 templates  |  | 6 SOPs | 8 templates      | |
| | [Installed] [Settings] |  | [Installed] [Settings]    | |
| +------------------------+  +---------------------------+ |
+----------------------------------------------------------+
| Available Packs                                          |
| +------------------------+  +---------------------------+ |
| | HIPAA Compliance       |  | Evidence Collection       | |
| | 10 SOPs | 15 templates |  | 5 SOPs | 6 templates      | |
| | [Install]              |  | [Install]                 | |
| +------------------------+  +---------------------------+ |
| +------------------------+  +---------------------------+ |
| | ISO 27001              |  | Audit Reporting           | |
| | 12 SOPs | 20 templates |  | 4 SOPs | 8 templates      | |
| | [Install]              |  | [Install]                 | |
| +------------------------+  +---------------------------+ |
+----------------------------------------------------------+
| Footer                                                    |
| [<- Back to Overview]                           [Done]   |
+----------------------------------------------------------+
```

**Elements**:
- Pack cards showing:
  - Pack name
  - SOP count
  - Template count
  - Category badge
  - Install/Installed button
  - Settings cog (if installed)
- Sections: Installed, Available
- Filter by category
- Search

**States**:
- Loading: Skeleton cards
- Installing: Card shows progress spinner
- Success: Toast "Pack installed", card updates to "Installed"

**Actions**:
- "Install" -> Install pack, add SOPs to Cognate
- "Settings" -> Pack settings modal
- "Done" -> Navigate back to Overview

---

#### Screen 5: Simulation
**Route**: `/team/cognates/:id` (modal overlay)

**Layout**:
```
+----------------------------------------------------------+
| Modal: Simulate Run                                       |
+----------------------------------------------------------+
| Select Automation                                         |
| [Daily Compliance Report               v]                |
+----------------------------------------------------------+
| Simulation Preview                                        |
| +------------------------------------------------------+ |
| | Systems Touched                                       | |
| | - Compliance Database (read)                         | |
| | - Report Generator (write)                           | |
| | - Email Service (send)                               | |
| +------------------------------------------------------+ |
| | Permissions Required                                  | |
| | - database.compliance.read                           | |
| | - reports.generate                                   | |
| | - email.send (requires approval)                     | |
| +------------------------------------------------------+ |
| | Estimated Cost                                        | |
| | $0.48 (within budget cap of $5.00)                   | |
| +------------------------------------------------------+ |
| | Dry Run Results (after simulation)                   | |
| | Step 1: Query compliance database       [OK]         | |
| | Step 2: Generate PDF report             [OK]         | |
| | Step 3: Send to stakeholders            [APPROVAL]   | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| [Cancel]                     [Simulate] / [Run for Real] |
+----------------------------------------------------------+
```

**Elements**:
- Automation selector
- Systems touched (read/write indicators)
- Permissions required (with approval flags)
- Estimated cost vs budget cap
- Dry run results (step-by-step)
- Warnings for high-risk actions

**States**:
- Initial: Show preview, "Simulate" enabled
- Simulating: Progress indicator, steps revealing
- Complete: All steps shown, "Run for Real" enabled
- Blocked: Warning banner, "Run for Real" disabled or requires approval

**Actions**:
- "Simulate" -> Execute dry run, show results
- "Run for Real" -> Start actual run (or approval request)
- "View in Ledger" -> Navigate to `/control/ledger`

---

### 2.3 Completion Criteria

| Criterion | Verification |
|-----------|--------------|
| Cognate created | New Cognate appears in roster |
| Space assigned | Cognate card shows Space badge |
| Pack installed | SOPs from pack visible in Cognate |
| Simulation completed | SimulationDiff shows all steps |
| Trace available | "View in Ledger" link functional |

---

## 3. Workflow WF2: Automation Lifecycle Flow

**Purpose**: Demonstrate the complete trust lifecycle from intent through pattern compilation.

**Demonstrates**:
- Explain Plan (transparency)
- Simulate before Run (safety)
- Policy enforcement
- Cost tracking
- Evidence trail
- Pattern compilation (learning)

### 3.1 Entry Points

| Route | Trigger | Context |
|-------|---------|---------|
| `/runs` | Sidebar nav "Runs" | Run history |
| `/control/lux` | LUX Builder | Visual automation |
| `/control/narrative` | Narrative Builder | Natural language |
| Command Palette | Cmd+K -> "New Run" | Quick trigger |

### 3.2 Screen Flow

#### Screen 1: Runs Page
**Route**: `/runs`

**Layout**:
```
+----------------------------------------------------------+
| Page Header                                               |
| +--------------------------+  +------------------------+ |
| | Runs                     |  | [+ New Run]            | |
| | Automation execution     |  |                        | |
| | history                  |  |                        | |
| +--------------------------+  +------------------------+ |
+----------------------------------------------------------+
| Stats Bar                                                 |
| [Running: 3] [Pending: 2] [Awaiting Approval: 3]        |
| [Completed: 8] [Failed: 2]                              |
+----------------------------------------------------------+
| Filter Bar                                               |
| [All Status v] [All Cognates v] [Date Range v] [Search] |
+----------------------------------------------------------+
| Run List                                                 |
| +------------------------------------------------------+ |
| | [R] Daily Compliance Report                          | |
| |     Compliance Monitor | 2 min ago | $0.48           | |
| |     [View Trace] [Explain Plan]              [...]   | |
| +------------------------------------------------------+ |
| | [A] Customer Outreach                                | |
| |     Customer Success | Awaiting Approval             | |
| |     Policy: External Communications                  | |
| |     [Approve] [Reject] [View Details]       [...]    | |
| +------------------------------------------------------+ |
| | [P] Security Log Analysis                            | |
| |     Threat Hunter | Running... 65%                   | |
| |     Current: Correlating log entries                 | |
| |     [View Progress] [Cancel]                 [...]   | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Page title: "Runs"
- Stats bar with status counts
- Filter bar: Status, Cognate, Date range, Search
- Run list items showing:
  - Status icon (colored badge)
  - Automation name
  - Cognate name
  - Time/cost
  - Actions: View Trace, Explain Plan, Approve/Reject

**States**:
- Loading: Skeleton rows
- Empty: "No runs yet" with CTA
- Error: Error banner

**Actions**:
- Click run -> Run detail view
- "Explain Plan" -> Explain Plan modal
- "View Trace" -> Navigate to trace page
- "Approve" -> Approval confirmation
- "New Run" -> New run modal

---

#### Screen 2: Explain Plan Modal
**Route**: `/runs` (modal overlay)

**Layout**:
```
+----------------------------------------------------------+
| Modal: Explain Plan                                       |
+----------------------------------------------------------+
| Automation: Daily Compliance Report                       |
| Cognate: Compliance Monitor (L2)                          |
+----------------------------------------------------------+
| What will happen:                                         |
| +------------------------------------------------------+ |
| | 1. Read compliance database                          | |
| |    - Query recent policy changes                     | |
| |    - Fetch audit log entries                         | |
| | 2. Analyze compliance gaps                           | |
| |    - Compare against SOC2 requirements               | |
| |    - Flag missing evidence                           | |
| | 3. Generate PDF report                               | |
| |    - Summary statistics                              | |
| |    - Detailed findings                               | |
| | 4. Send to stakeholders                              | |
| |    - sarah.chen@symtex.io                            | |
| |    - compliance-team@symtex.io                       | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Systems Touched                                          |
| +------------------+  +------------------+               |
| | Compliance DB    |  | Report Service   |               |
| | Read access      |  | Write access     |               |
| +------------------+  +------------------+               |
| +------------------+  +------------------+               |
| | Email Service    |  | Audit Ledger     |               |
| | Send (approval)  |  | Write (auto)     |               |
| +------------------+  +------------------+               |
+----------------------------------------------------------+
| Budget & Cost                                             |
| Estimated: $0.48 | Budget Remaining: $4,567.23           |
| [=========-----------] 12% of monthly budget             |
+----------------------------------------------------------+
| [Close]                                   [Simulate Now] |
+----------------------------------------------------------+
```

**Elements**:
- Automation and Cognate info
- Step-by-step plan explanation
- Systems touched with access type
- Budget/cost projection
- Budget progress bar

**Actions**:
- "Simulate Now" -> Navigate to simulation
- "Close" -> Dismiss modal

---

#### Screen 3: Simulation Modal
**Route**: `/runs` or `/runs/:runId` (modal overlay)

**Layout**:
```
+----------------------------------------------------------+
| Modal: Dry Run Simulation                                 |
+----------------------------------------------------------+
| Progress: [=============================] 100%            |
+----------------------------------------------------------+
| Simulation Results                                        |
| +------------------------------------------------------+ |
| | Step 1: Query compliance database                    | |
| |   Status: [OK]                                       | |
| |   Time: 1.2s | Tokens: 450                          | |
| |   Result: 23 policy changes, 156 audit entries      | |
| +------------------------------------------------------+ |
| | Step 2: Analyze gaps                                 | |
| |   Status: [OK]                                       | |
| |   Time: 3.4s | Tokens: 1,250                        | |
| |   Result: 3 gaps identified                         | |
| +------------------------------------------------------+ |
| | Step 3: Generate report                              | |
| |   Status: [OK]                                       | |
| |   Time: 2.1s | Tokens: 890                          | |
| |   Result: PDF ready (32 pages)                      | |
| +------------------------------------------------------+ |
| | Step 4: Send emails                                  | |
| |   Status: [APPROVAL REQUIRED]                        | |
| |   Policy: External Communications                    | |
| |   Recipients: 2 (sarah.chen, compliance-team)       | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Simulation Diff                                          |
| +------------------------------------------------------+ |
| | Before                | After                        | |
| | No report exists      | compliance-2026-01-21.pdf   | |
| | 0 emails sent         | 2 emails queued             | |
| | Gaps: unknown         | Gaps: 3 identified          | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Total Cost: $0.47 | Time: 6.7s                           |
+----------------------------------------------------------+
| [Cancel]              [Request Approval] [Run for Real]  |
+----------------------------------------------------------+
```

**Elements**:
- Progress bar during simulation
- Step-by-step results
- Status badges (OK, Warning, Approval Required)
- Simulation diff (before/after comparison)
- Total cost and time
- Action buttons based on result

**States**:
- Running: Progress bar animating, steps revealing
- Complete (no blocks): "Run for Real" enabled
- Complete (approval needed): "Request Approval" shown

---

#### Screen 4: Run In Progress
**Route**: `/runs/:runId`

**Layout**:
```
+----------------------------------------------------------+
| Breadcrumb: Runs / Daily Compliance Report               |
+----------------------------------------------------------+
| Header                                                    |
| [RUNNING] Daily Compliance Report                        |
| Cognate: Compliance Monitor | Started: 2 min ago         |
+----------------------------------------------------------+
| Progress                                                  |
| [===================>-----------] 65%                    |
| Current Step: Analyzing compliance gaps                  |
+----------------------------------------------------------+
| Live Steps                                               |
| [OK] Step 1: Query compliance database (1.2s)           |
| [OK] Step 2: Fetch audit entries (0.8s)                 |
| [->] Step 3: Analyze gaps (running...)                  |
| [ ] Step 4: Generate report                              |
| [ ] Step 5: Send to stakeholders                         |
+----------------------------------------------------------+
| Cost Meter                                               |
| Current: $0.31 | Estimated: $0.48 | Budget Cap: $5.00   |
| [======--------] 62% of estimated                        |
+----------------------------------------------------------+
| [Cancel Run]                               [View Trace]  |
+----------------------------------------------------------+
```

**Elements**:
- Status badge (Running)
- Overall progress bar with percentage
- Current step description
- Step-by-step log with timing
- Cost meter with budget context
- Cancel option

**States**:
- Running: Steps updating live
- Paused: Awaiting approval
- Completed: All steps green

---

#### Screen 5: Review Modal
**Route**: `/runs/:runId` (modal overlay)

**Layout**:
```
+----------------------------------------------------------+
| Modal: Run Complete                                       |
+----------------------------------------------------------+
| [SUCCESS] Daily Compliance Report                         |
| Completed in 6.7 seconds | Cost: $0.48                   |
+----------------------------------------------------------+
| Results Summary                                           |
| +------------------------------------------------------+ |
| | Outputs                                               | |
| | - Report: compliance-2026-01-21.pdf (32 pages)       | |
| | - Emails: 2 sent successfully                        | |
| | - Gaps Found: 3 (2 medium, 1 low)                    | |
| +------------------------------------------------------+ |
| | Cognate Actions                                      | |
| | - Database queries: 5                                | |
| | - Documents generated: 1                             | |
| | - External communications: 2                         | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Pattern Compilation Available                            |
| +------------------------------------------------------+ |
| | This run matched pattern: "Compliance Report Gen"    | |
| | 15 similar runs | 94% consistency                    | |
| |                                                       | |
| | [Compile to Deterministic]                           | |
| | This will make steps 1-3 faster & cheaper            | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| [Close]            [View Trace] [View in Ledger]         |
+----------------------------------------------------------+
```

**Elements**:
- Success/Failure status
- Run timing and cost
- Results summary
- Pattern compilation suggestion
- Links to trace and ledger

**Actions**:
- "Compile to Deterministic" -> Pattern compilation
- "View Trace" -> Navigate to trace
- "View in Ledger" -> Navigate to ledger

---

#### Screen 6: Pattern Compilation Widget
**Route**: Component appears on Review modal or Signals page

**Layout**:
```
+----------------------------------------------------------+
| Pattern Compilation Widget                                |
| +------------------------------------------------------+ |
| | [COMPILED] Compliance Report Generation              | |
| |                                                       | |
| | This step is now deterministic                       | |
| |                                                       | |
| | Before Compilation:                                  | |
| | - Avg cost: $0.48/run                               | |
| | - Avg time: 6.7s                                     | |
| | - Variability: +/- 15%                              | |
| |                                                       | |
| | After Compilation:                                   | |
| | - Fixed cost: $0.12/run                             | |
| | - Fixed time: 2.1s                                   | |
| | - Variability: +/- 2%                               | |
| |                                                       | |
| | Savings: 75% cost reduction, 69% faster             | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Before/after comparison
- Cost savings percentage
- Time savings percentage
- Variability reduction

---

### 3.3 Completion Criteria

| Criterion | Verification |
|-----------|--------------|
| Plan explained | Explain Plan modal shows all steps |
| Simulation complete | SimulationDiff shows before/after |
| Run executed | Run status is "completed" |
| Trace available | Trace page shows all steps |
| Ledger entry | Audit event created |
| Pattern compiled | PatternCompilationWidget shows savings |

---

## 4. Workflow WF3: Knowledge Citation Flow

**Purpose**: Demonstrate how Knowledge is sourced, cited, and audited in Cognate actions.

**Demonstrates**:
- Knowledge library as source of truth
- Citations in Cognate reasoning
- Audit trail for evidence
- Knowledge refresh and validation

### 4.1 Entry Points

| Route | Trigger | Context |
|-------|---------|---------|
| `/knowledge` | Sidebar nav "Knowledge" | Knowledge hub |
| `/knowledge/library` | Library tab | Documents |
| Run trace | Citation click | From trace |
| Symbios chat | Citation in response | From chat |

### 4.2 Screen Flow

#### Screen 1: Knowledge Hub
**Route**: `/knowledge`

**Layout**:
```
+----------------------------------------------------------+
| Page Header                                               |
| +--------------------------+  +------------------------+ |
| | Knowledge                |  | [+ Add Document]       | |
| | Your organization's      |  |                        | |
| | source of truth          |  |                        | |
| +--------------------------+  +------------------------+ |
+----------------------------------------------------------+
| Tab Bar: [Library] [Templates] [NEXIS] [Graph]           |
+----------------------------------------------------------+
| Quick Stats                                              |
| +------------+  +------------+  +------------+           |
| | 40 Docs    |  | 56 Cited   |  | 12 Pending |           |
| | Total      |  | Last 7d    |  | Review     |           |
| +------------+  +------------+  +------------+           |
+----------------------------------------------------------+
| Recent Citations                                          |
| +------------------------------------------------------+ |
| | "SOC2 Requirements 2025" cited by Compliance Monitor | |
| |   Run: Daily Compliance Report | 2 min ago           | |
| |   [View Citation] [View Document]                    | |
| +------------------------------------------------------+ |
| | "Lead Qualification Process" cited by Revenue Analyst| |
| |   Run: Lead Score Update | 15 min ago                | |
| |   [View Citation] [View Document]                    | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Tab navigation (Library, Templates, NEXIS, Graph)
- Quick stats cards
- Recent citations list
- Add document CTA

---

#### Screen 2: Document Library
**Route**: `/knowledge/library`

**Layout**:
```
+----------------------------------------------------------+
| Breadcrumb: Knowledge / Library                          |
+----------------------------------------------------------+
| Filter Bar                                               |
| [All Types v] [All Spaces v] [Sort: Recent v] [Search]  |
+----------------------------------------------------------+
| Document Grid                                             |
| +------------------------+  +---------------------------+ |
| | [DOC] SOC2 Requirements|  | [POL] Incident Response  | |
| |       2025             |  |       Policy v3.2        | |
| | 45 citations           |  | 18 citations             | |
| | Last cited: 2 min ago  |  | Last cited: 1 hr ago     | |
| | [Compliance Ops]       |  | [Security Ops]           | |
| +------------------------+  +---------------------------+ |
| +------------------------+  +---------------------------+ |
| | [PROC] Lead            |  | [REF] NIST Framework     | |
| |        Qualification   |  |                          | |
| | 27 citations           |  | 56 citations             | |
| | Last cited: 15 min ago |  | Last cited: 3 hr ago     | |
| | [Revenue Ops]          |  | [Security, Compliance]   | |
| +------------------------+  +---------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Document type badges (DOC, POL, PROC, REF)
- Citation count
- Last cited timestamp
- Space assignments
- Filter/sort options

---

#### Screen 3: Document Detail
**Route**: `/knowledge/library/:docId`

**Layout**:
```
+----------------------------------------------------------+
| Breadcrumb: Knowledge / Library / SOC2 Requirements 2025 |
+----------------------------------------------------------+
| Document Header                                           |
| [DOC] SOC2 Type II Requirements 2025                     |
| Last updated: Jun 1, 2025 | 45 citations                 |
| Spaces: Compliance Ops                                    |
| [Edit] [Download] [Archive]                              |
+----------------------------------------------------------+
| Tab Bar: [Content] [Citations] [History] [Settings]      |
+----------------------------------------------------------+
| Content Panel                                             |
| +------------------------------------------------------+ |
| | ## 1. Security Principles                            | |
| |                                                       | |
| | The SOC2 framework defines five trust service        | |
| | principles...                                        | |
| |                                                       | |
| | ## 2. Control Requirements                           | |
| | ...                                                   | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Citation Panel (Collapsible)                             |
| +------------------------------------------------------+ |
| | Recent Citations (45 total)                          | |
| | +--------------------------------------------------+ | |
| | | Compliance Monitor cited Section 2.1             | | |
| | | "Control requirements mandate..."                | | |
| | | Run: Daily Compliance Report | 2 min ago         | | |
| | | [View in Trace]                                  | | |
| | +--------------------------------------------------+ | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Document metadata
- Content viewer (markdown rendered)
- Citations tab showing usage
- History tab showing changes
- Edit and archive actions

---

#### Screen 4: Citation in Trace
**Route**: `/runs/:runId/trace` (with citation highlight)

**Layout**:
```
+----------------------------------------------------------+
| Trace: Daily Compliance Report                           |
+----------------------------------------------------------+
| Step 2: Analyze compliance gaps                          |
| +------------------------------------------------------+ |
| | Reasoning                                             | |
| | "Based on SOC2 Requirements 2025 Section 2.1,        | |
| |  the following controls are required:                | |
| |  - CC6.1: Logical access controls [CITED]            | |
| |  - CC6.2: Physical access controls [CITED]           | |
| |  - CC6.3: Encryption requirements [CITED]"           | |
| +------------------------------------------------------+ |
| | Sources                                               | |
| | +--------------------------------------------------+ | |
| | | [DOC] SOC2 Requirements 2025                     | | |
| | | Section: 2.1 Control Requirements                | | |
| | | Confidence: 98%                                   | | |
| | | [View Source] [Verify]                           | | |
| | +--------------------------------------------------+ | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Reasoning text with citation markers
- Source cards showing:
  - Document reference
  - Section/page
  - Confidence score
  - Verify action

**Actions**:
- "View Source" -> Navigate to document
- "Verify" -> Open verification modal

---

#### Screen 5: Audit Event
**Route**: `/control/ledger` (filtered to citation)

**Layout**:
```
+----------------------------------------------------------+
| Ledger: Citation Event                                    |
+----------------------------------------------------------+
| Event: knowledge_cited                                    |
| Timestamp: 2026-01-21T08:02:15Z                          |
+----------------------------------------------------------+
| Who                                                       |
| Cognate: Compliance Monitor                              |
| Run: run-001 (Daily Compliance Report)                   |
+----------------------------------------------------------+
| What                                                      |
| Document: SOC2 Requirements 2025 (kb-soc2-requirements)  |
| Section: 2.1 Control Requirements                        |
| Quote: "The following controls are required..."          |
+----------------------------------------------------------+
| Context                                                   |
| Space: Compliance Ops                                    |
| Project: Audit Automation                                |
| Step: Analyze compliance gaps                            |
+----------------------------------------------------------+
| Evidence Hash: 0x7f3d2a...                               |
| [View Full Document] [View Run Trace]                    |
+----------------------------------------------------------+
```

**Elements**:
- Structured audit event
- Who (Cognate, run)
- What (document, section, quote)
- Context (space, project, step)
- Evidence hash for verification

---

### 4.3 Completion Criteria

| Criterion | Verification |
|-----------|--------------|
| Document accessed | Document detail loads |
| Citation shown | Trace shows source reference |
| Confidence displayed | Citation has confidence score |
| Audit event created | Ledger shows knowledge_cited event |
| Evidence hash | Hash is visible and verifiable |

---

## 5. Workflow WF4: NEXIS Insight Flow

**Purpose**: Demonstrate how NEXIS entity graph connects knowledge, people, and automation creation.

**Demonstrates**:
- Entity relationship visualization
- Insight generation from connections
- Automation creation from insights
- Budget-aware execution

### 5.1 Entry Points

| Route | Trigger | Context |
|-------|---------|---------|
| `/knowledge/nexis` | Knowledge tab | NEXIS graph |
| Entity mention | Click entity in UI | From any context |
| Command Palette | Cmd+K -> "NEXIS" | Quick access |

### 5.2 Screen Flow

#### Screen 1: NEXIS Graph
**Route**: `/knowledge/nexis`

**Layout**:
```
+----------------------------------------------------------+
| Page Header                                               |
| +--------------------------+  +------------------------+ |
| | NEXIS Entity Graph       |  | [+ Add Entity]         | |
| | Relationship intelligence|  |                        | |
| +--------------------------+  +------------------------+ |
+----------------------------------------------------------+
| Control Bar                                              |
| [Zoom: 100%] [Filter: All v] [Layout: Force v]          |
+----------------------------------------------------------+
| Graph Canvas                                              |
| +------------------------------------------------------+ |
| |                    [Q1 Audit]                        | |
| |                        |                              | |
| |                   validates                          | |
| |                        |                              | |
| |    [Sarah Chen] ---- [SOC2] ---- [David Kim]         | |
| |         |               |              |              | |
| |     works_at       implements     works_at           | |
| |         |               |              |              | |
| |    [Symtex] <---- customer_of ---- [TechCorp]        | |
| |         |                              |              | |
| |     manages                       works_at           | |
| |         |                              |              | |
| |    [Lisa Wang] ------------------- [James Wilson]    | |
| |                                                       | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Entity Detail Panel (slide-out)                          |
| +------------------------------------------------------+ |
| | Sarah Chen                                            | |
| | VP Compliance | Symtex LLC                           | |
| | +--------------------------------------------------+ | |
| | | Relationships (4)                                | | |
| | | - works_at: Symtex LLC                           | | |
| | | - responsible_for: SOC2 Compliance               | | |
| | | - approves_for: Audit Submission                 | | |
| | | - collaborates_with: David Kim                   | | |
| | +--------------------------------------------------+ | |
| | | Insights                                         | | |
| | | "Sarah is the key approver for compliance runs"  | | |
| | | [Create Notification Automation]                 | | |
| | +--------------------------------------------------+ | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Force-directed graph visualization
- Entity nodes (colored by type)
- Relationship edges (labeled)
- Zoom and filter controls
- Click to select entity
- Detail panel slides in on selection

---

#### Screen 2: Entity Detail Panel
**Route**: `/knowledge/nexis` (panel overlay)

**Layout**:
```
+----------------------------------------------------------+
| Entity: TechCorp                                          |
| Type: Organization | Customer                             |
+----------------------------------------------------------+
| Overview                                                  |
| Domain: techcorp.io                                       |
| Customer since: 2024-03-15                               |
| Health Score: 85/100                                     |
+----------------------------------------------------------+
| Relationships (5)                                         |
| +------------------------------------------------------+ |
| | [PERSON] James Wilson                                | |
| |   works_at TechCorp | CTO                            | |
| +------------------------------------------------------+ |
| | [PERSON] Lisa Wang                                   | |
| |   manages TechCorp (at Symtex)                       | |
| +------------------------------------------------------+ |
| | [ORG] Symtex LLC                                     | |
| |   customer_of (inverse)                              | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Generated Insights                                        |
| +------------------------------------------------------+ |
| | [!] Renewal coming up in 45 days                    | |
| |     James Wilson hasn't engaged in 2 weeks          | |
| |     Lisa Wang should reach out                      | |
| |                                                       | |
| |     [Create Outreach Automation]                    | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Entity metadata
- Relationship list with types
- AI-generated insights
- Suggested automation creation

---

#### Screen 3: Create Automation from Insight
**Route**: Modal from NEXIS

**Layout**:
```
+----------------------------------------------------------+
| Modal: Create Automation                                  |
+----------------------------------------------------------+
| Based on Insight:                                         |
| "TechCorp renewal in 45 days, engagement dropping"       |
+----------------------------------------------------------+
| Suggested Automation                                      |
| +------------------------------------------------------+ |
| | Name: TechCorp Renewal Outreach                      | |
| | [____________________________________]               | |
| |                                                       | |
| | Cognate: [Customer Success              v]           | |
| |                                                       | |
| | Trigger: [Scheduled - Weekly            v]           | |
| |                                                       | |
| | Actions:                                              | |
| | 1. Check TechCorp engagement metrics                 | |
| | 2. If declining, draft outreach email                | |
| | 3. Send to Lisa Wang for review                      | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Budget Check                                              |
| Estimated cost: $1.75/run                                |
| Weekly total: ~$7.00/month                               |
| Budget remaining: $9,234.00                              |
| [===---------] 8% of monthly budget                      |
+----------------------------------------------------------+
| [Cancel]                          [Create Automation]    |
+----------------------------------------------------------+
```

**Elements**:
- Insight context
- Pre-filled automation details
- Cognate selector
- Trigger configuration
- Budget projection

---

#### Screen 4: Run with Budget
**Route**: `/runs/:runId`

**Layout**:
```
+----------------------------------------------------------+
| Run: TechCorp Renewal Outreach                           |
| Status: [RUNNING] | Cost: $1.42 / $1.75 est             |
+----------------------------------------------------------+
| Budget Context                                            |
| +------------------------------------------------------+ |
| | Monthly Budget: $10,000                              | |
| | Used this month: $766.00 (7.66%)                     | |
| | This run: $1.42 (0.01%)                              | |
| | [======-------------------------] Safe               | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Progress                                                  |
| [OK] Check engagement metrics (0.8s, $0.42)             |
| [OK] Engagement declining, drafting email (2.1s, $0.89) |
| [->] Sending to Lisa Wang for review... ($0.11)         |
+----------------------------------------------------------+
```

**Elements**:
- Real-time cost tracking
- Budget context (monthly, used, this run)
- Step-by-step costs
- Budget health indicator

---

### 5.3 Completion Criteria

| Criterion | Verification |
|-----------|--------------|
| Graph loads | Entities and relationships visible |
| Entity selected | Detail panel shows relationships |
| Insight generated | Insight card with action suggestion |
| Automation created | New automation in runs list |
| Budget respected | Run completes within budget |

---

## 6. Workflow WF5: Policy Approval Flow

**Purpose**: Demonstrate governance controls, policy enforcement, and human-in-the-loop approval.

**Demonstrates**:
- Policy triggers and blocks
- Human-readable policy reasons
- Approval workflow
- Re-run after approval
- Audit trail

### 6.1 Entry Points

| Route | Trigger | Context |
|-------|---------|---------|
| `/control/approvals` | Sidebar nav "Control" | Approval queue |
| `/runs` | Run blocked | From runs list |
| Notification | Toast/email | Alert |
| CognateDock | Yellow "Waiting" state | From dock |

### 6.2 Screen Flow

#### Screen 1: Policy Block
**Route**: `/runs/:runId`

**Layout**:
```
+----------------------------------------------------------+
| Run: Customer Outreach                                    |
| Status: [AWAITING APPROVAL]                              |
+----------------------------------------------------------+
| Policy Block                                              |
| +------------------------------------------------------+ |
| | [!] Action Blocked by Policy                         | |
| |                                                       | |
| | Policy: External Communications                      | |
| | Rule: "Approval required for any automated           | |
| |        external communications"                      | |
| |                                                       | |
| | Why this triggered:                                  | |
| | - This run will send emails to 15 customers         | |
| | - External email requires manager approval          | |
| | - Recipients include: james.wilson@techcorp.io,     | |
| |   sarah.johnson@acme.co, and 13 others             | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Approval Request                                          |
| +------------------------------------------------------+ |
| | Requested: 2 hours ago                               | |
| | Approvers: Emily Rodriguez (Manager)                 | |
| |           Compliance Team (Policy)                   | |
| |                                                       | |
| | Status:                                               | |
| | [Pending] Emily Rodriguez                            | |
| | [Pending] Compliance Team                            | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| [Cancel Run]                         [Request Approval]  |
+----------------------------------------------------------+
```

**Elements**:
- Blocked status badge (yellow)
- Policy name and description
- Human-readable reason
- Specific trigger details
- Approver list with status
- Request/Cancel actions

---

#### Screen 2: Approval Queue
**Route**: `/control/approvals`

**Layout**:
```
+----------------------------------------------------------+
| Page Header                                               |
| +--------------------------+  +------------------------+ |
| | Approval Queue           |  | [3 Pending]            | |
| | Review and approve       |  |                        | |
| | Cognate actions          |  |                        | |
| +--------------------------+  +------------------------+ |
+----------------------------------------------------------+
| Filter Bar                                               |
| [All Policies v] [All Cognates v] [Sort: Oldest v]      |
+----------------------------------------------------------+
| Pending Approvals                                         |
| +------------------------------------------------------+ |
| | [!] Customer Outreach                                | |
| |     Customer Success | 2 hours ago                   | |
| |     Policy: External Communications                  | |
| |     Impact: 15 external emails                       | |
| |     [Review] [Quick Approve] [Reject]               | |
| +------------------------------------------------------+ |
| | [!] Audit Evidence Submission                        | |
| |     Audit Collector | 30 min ago                     | |
| |     Policy: Audit Evidence Submission                | |
| |     Impact: Submit to external portal                | |
| |     [Review] [Quick Approve] [Reject]               | |
| +------------------------------------------------------+ |
| | [!] Threat Containment                               | |
| |     Incident Responder | 5 min ago                   | |
| |     Policy: Automated Threat Response                | |
| |     Impact: Block 3 IPs, isolate 1 system           | |
| |     [Review] [Quick Approve] [Reject]               | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Queue count badge
- Approval cards with:
  - Run name
  - Cognate
  - Time waiting
  - Policy triggered
  - Impact summary
  - Quick actions

---

#### Screen 3: Approval Review Modal
**Route**: `/control/approvals` (modal overlay)

**Layout**:
```
+----------------------------------------------------------+
| Modal: Review Approval Request                            |
+----------------------------------------------------------+
| Customer Outreach                                         |
| Cognate: Customer Success | Requested: 2 hours ago       |
+----------------------------------------------------------+
| Policy Triggered                                          |
| External Communications                                   |
| "Approval required for any automated external comms"     |
+----------------------------------------------------------+
| What will happen:                                         |
| +------------------------------------------------------+ |
| | 1. Send personalized email to 15 customers           | |
| |    - Subject: "Quick check-in on your experience"   | |
| |    - Template: Renewal Reminder Email                | |
| |    - Recipients:                                     | |
| |      * james.wilson@techcorp.io                     | |
| |      * sarah.johnson@acme.co                        | |
| |      * +13 more [View All]                          | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Preview Email                                             |
| +------------------------------------------------------+ |
| | Subject: Quick check-in on your experience           | |
| |                                                       | |
| | Hi James,                                            | |
| |                                                       | |
| | I wanted to reach out personally to see how things   | |
| | are going with your Symtex implementation...         | |
| |                                                       | |
| | [View Full Email]                                    | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Approval Notes (optional)                                 |
| [Add a note for the audit trail...]                     |
+----------------------------------------------------------+
| [Cancel]                   [Reject] [Approve and Run]   |
+----------------------------------------------------------+
```

**Elements**:
- Full policy and trigger context
- Detailed action preview
- Email/content preview
- Notes field for audit
- Approve/Reject with reasons

---

#### Screen 4: Approval Confirmation
**Route**: `/control/approvals` (inline update)

**Layout**:
```
+----------------------------------------------------------+
| Approval Granted                                          |
| +------------------------------------------------------+ |
| | [APPROVED] Customer Outreach                         | |
| |                                                       | |
| | Approved by: Emily Rodriguez                         | |
| | Time: Just now                                        | |
| | Note: "Reviewed recipients, all are active customers"| |
| |                                                       | |
| | Run Status: Starting...                              | |
| |                                                       | |
| | [View Run Progress]                                  | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Approval confirmation
- Approver name and time
- Notes captured
- Run status update
- Link to run progress

---

#### Screen 5: Re-run Execution
**Route**: `/runs/:runId`

**Layout**:
```
+----------------------------------------------------------+
| Run: Customer Outreach                                    |
| Status: [RUNNING] | Previously: Awaiting Approval        |
+----------------------------------------------------------+
| Approval Context                                          |
| +------------------------------------------------------+ |
| | Approved by: Emily Rodriguez                         | |
| | Time: 2 min ago                                       | |
| | Policy: External Communications                      | |
| | Note: "Reviewed recipients, all are active"          | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Progress                                                  |
| [OK] Fetch customer list (0.5s)                         |
| [OK] Generate personalized emails (3.2s)                |
| [->] Sending emails... (8/15 complete)                  |
+----------------------------------------------------------+
| [Cancel]                               [View Ledger]     |
+----------------------------------------------------------+
```

**Elements**:
- Run status (now running)
- Approval context preserved
- Progress with email count
- Link to audit ledger

---

#### Screen 6: Audit Trail
**Route**: `/control/ledger` (filtered)

**Layout**:
```
+----------------------------------------------------------+
| Ledger: Approval Flow                                     |
+----------------------------------------------------------+
| Timeline                                                  |
| +------------------------------------------------------+ |
| | 14:35:00 | approval_granted                          | |
| |          | Emily Rodriguez approved Customer Outreach| |
| |          | Policy: External Communications           | |
| |          | Note: "Reviewed recipients..."            | |
| +------------------------------------------------------+ |
| | 14:35:02 | run_started                               | |
| |          | Customer Outreach resumed after approval  | |
| +------------------------------------------------------+ |
| | 14:35:05 | action_executed                           | |
| |          | Fetched 15 customer records               | |
| +------------------------------------------------------+ |
| | 14:35:08 | action_executed                           | |
| |          | Generated 15 personalized emails          | |
| +------------------------------------------------------+ |
| | 14:35:45 | run_completed                             | |
| |          | Customer Outreach completed               | |
| |          | 15 emails sent, cost: $1.75              | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Elements**:
- Chronological timeline
- Event types with icons
- Actor (human or Cognate)
- Details for each event
- Filter by run, Cognate, policy

---

### 6.3 Completion Criteria

| Criterion | Verification |
|-----------|--------------|
| Policy blocks run | Run shows "Awaiting Approval" |
| Reason is human-readable | Plain English explanation |
| Approver notified | Appears in approval queue |
| Approval recorded | Audit event with approver name |
| Run resumes | Status changes to "Running" |
| Ledger complete | Full timeline of approval flow |

---

## 7. Common UI Patterns

### 7.1 Page Template

Every page MUST include:

```
+----------------------------------------------------------+
| Page Header                                               |
| +------------------------------------------------------+ |
| | Title (.text-headline)                               | |
| | Description (.text-body) - optional                  | |
| | Primary CTA (1)                                       | |
| | Secondary CTAs (max 2)                               | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Content Area                                              |
| +------------------------------------------------------+ |
| | - Loading state (Skeleton)                           | |
| | - Empty state (EmptyState)                           | |
| | - Error state (ErrorBanner/ErrorFallback)            | |
| | - Data content                                        | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
| Footer / Navigation                                       |
| +------------------------------------------------------+ |
| | Back button or breadcrumbs                           | |
| | Action buttons (if applicable)                       | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 7.2 Modal Template

```
+----------------------------------------------------------+
| Modal Header                                              |
| Title                                          [X Close] |
+----------------------------------------------------------+
| Modal Content                                             |
| - Scrollable if needed                                   |
| - Max height: 80vh                                       |
+----------------------------------------------------------+
| Modal Footer                                              |
| [Secondary Action]                   [Primary Action]    |
+----------------------------------------------------------+
```

### 7.3 Progressive Disclosure

| Pattern | Implementation |
|---------|----------------|
| Advanced panels | Collapsed by default, "Show advanced" toggle |
| Long lists | Show 5 items, "Show all (N)" button |
| Details | Summary visible, expand for full content |
| Settings | Basic vs Advanced tabs |

### 7.4 State Indicators

| State | Visual | Animation |
|-------|--------|-----------|
| Loading | Skeleton | Pulse |
| Empty | Illustration + CTA | None |
| Error | Red banner | Shake (once) |
| Success | Green toast | Slide in/out |
| Warning | Yellow banner | None |
| Running | Progress bar/ring | Continuous |
| Blocked | Yellow badge | Pulse |
| Completed | Green badge | Check appear |

### 7.5 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open Command Palette |
| `Ctrl+Shift+D` | Toggle Demo Panel |
| `Escape` | Close modal/panel |
| `Enter` | Confirm action (in modals) |
| `Tab` | Navigate focusable elements |
| `Arrow keys` | Navigate lists |

### 7.6 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640-1024px | Two columns, collapsed sidebar |
| Desktop | > 1024px | Full layout, expanded sidebar |

---

## 8. Accessibility Requirements

### 8.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | 4.5:1 minimum for text |
| Focus indicators | Visible focus ring on all interactive elements |
| Screen reader | ARIA labels on all buttons/icons |
| Keyboard navigation | All actions accessible via keyboard |
| Reduced motion | Respect `prefers-reduced-motion` |

### 8.2 ARIA Landmarks

| Landmark | Element |
|----------|---------|
| `main` | Page content area |
| `navigation` | Sidebar, breadcrumbs |
| `dialog` | Modals |
| `alert` | Toast notifications |
| `status` | Progress indicators |

---

## 9. Demo Panel Integration

### 9.1 Scenario Triggers

Each workflow can be triggered via Demo Panel (Ctrl+Shift+D):

| Scenario | Trigger | Effect |
|----------|---------|--------|
| WF1 Complete | "Cognate Created" | Pre-populate Cognate with Pack |
| WF2 Complete | "Run Complete" | Show completed run with trace |
| WF3 Citation | "Show Citation" | Highlight citation in trace |
| WF4 Insight | "NEXIS Insight" | Select entity with insight |
| WF5 Block | "Policy Block" | Show blocked run |
| WF5 Approve | "Approve Run" | Grant approval |

### 9.2 Wow Moment Shortcuts

| Moment | Trigger | Navigate To |
|--------|---------|-------------|
| Explain Plan | "Wow: Plan" | Explain Plan modal |
| SimulationDiff | "Wow: Simulate" | Simulation with diff |
| Approval Gate | "Wow: Approval" | Approval review modal |
| Trace Timeline | "Wow: Trace" | Full trace with evidence |
| Pattern Compile | "Wow: Compile" | Pattern compilation widget |
| NEXIS Automation | "Wow: NEXIS" | Automation from insight |
| Symbios Command | "Wow: Symbios" | Chat with run context |

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial creation |
