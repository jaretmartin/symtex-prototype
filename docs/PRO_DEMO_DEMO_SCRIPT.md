# PRO_DEMO_DEMO_SCRIPT.md

> Symtex Pro - Live Demo Script & Talking Points
> Version: 1.0.0 | Last Updated: 2026-01-21

---

## 1. Overview

This document provides complete demo scripts for three audience tracks. Each script includes timestamps, navigation paths, talking points, and "wow moments" to highlight.

**Demo Tracks:**
| Track | Duration | Audience | Focus |
|-------|----------|----------|-------|
| A | 3 minutes | Executive | ROI, audit trail, trust signals |
| B | 5 minutes | Operator | Run lifecycle, approvals, governance |
| C | 7 minutes | Builder | Cognate creation, automation, NEXIS, C2S2 |

---

## 2. Pre-Demo Setup

### 2.1 Environment Check

**Before every demo:**

1. **Browser Setup**
   - Open Chrome/Edge in incognito mode (fresh state)
   - Navigate to `http://localhost:5173`
   - Verify dev server is running (`pnpm dev`)

2. **Demo Panel Activation**
   - Press `Ctrl+Shift+D` to open Demo Control Panel
   - Select appropriate scenario:
     - `exec-demo` for Track A
     - `operator-demo` for Track B
     - `builder-demo` for Track C
   - Click "Apply Scenario"
   - Verify toast: "Demo scenario applied"

3. **Visual Verification**
   - CognateDock shows 3-4 active Cognates
   - Home dashboard shows activity
   - No console errors (F12 > Console)

4. **Close Demo Panel**
   - Press `Ctrl+Shift+D` again to hide

### 2.2 Scenario Details

| Scenario | Active Cognates | Runs State | Special Data |
|----------|-----------------|------------|--------------|
| `exec-demo` | 4 | 3 completed, 1 pending approval | ROI metrics populated |
| `operator-demo` | 3 | 2 running, 2 awaiting approval | Approval queue populated |
| `builder-demo` | 6 | Mixed states | All features enabled |

---

## 3. Track A: Executive Overview (3 minutes)

**Scenario:** `exec-demo`
**Persona:** Executive (C-suite, VP, Board)
**Key Message:** "AI operations that are accountable, auditable, and deliver measurable ROI"

### Script

---

#### (0:00 - 0:30) Opening - Home Dashboard

**Navigate:** `/` (Home)

**Talking Point:**
> "This is the Symtex command center - where you see exactly what your AI workforce is doing right now."

**Show:**
- Signals widget (top-right): "12 hours saved this week"
- AI Budget Status: "73% of monthly budget used"
- Active Cognates in CognateDock (bottom-left)
- Quick Actions widget

**Wow Moment:**
- Point to CognateDock: "Each of these represents an AI operator - like your best employees, but they never sleep and every action is logged."

**Click:** Nothing yet - let them absorb the dashboard

---

#### (0:30 - 1:00) Signals Dashboard

**Navigate:** `/signals` (Click "Signals" in sidebar)

**Talking Point:**
> "Here's where we measure the business impact. Not just activity - actual outcomes."

**Show:**
- ROI Dashboard metrics:
  - "156 tasks automated this month"
  - "$12,450 in estimated savings"
  - "94% accuracy rate"
- Cost Savings Chart (time series)
- Pattern Compilation Widget: "23 patterns now deterministic"

**Wow Moment:**
> "See this? 'Pattern Compilation' - when Symtex does something well repeatedly, it learns to do it faster and cheaper. This automation used to cost $2.50 per run. Now it's $0.15."

---

#### (1:00 - 2:00) Audit Trail

**Navigate:** `/control/ledger` (Control > Ledger)

**Talking Point:**
> "For compliance, every action has a complete audit trail. We call this the 6 W's framework."

**Show:**
- Ledger timeline with entries
- Click on any entry to expand
- Point out the 6 W's:
  - **Who:** Which Cognate acted
  - **What:** Specific action taken
  - **When:** Timestamp with timezone
  - **Where:** Space/Project context
  - **Why:** Policy or trigger that initiated
  - **How:** Evidence and artifacts

**Wow Moment:**
- Click "View Evidence" on a compliance entry
- Show attached report/document
> "Your auditors will love this. Every action, every decision, fully documented."

**Filter Demo:**
- Click "Filter by Cognate"
- Select "Compliance Monitor"
> "Need to audit a specific AI operator? One click."

---

#### (2:00 - 2:45) Trust Lifecycle

**Navigate:** `/runs` (Click "Runs" in sidebar)

**Talking Point:**
> "This is the run history. Every automation execution, with full trace and reasoning."

**Show:**
- List of recent runs with status badges
- Point out statuses: Completed (green), Running (blue), Awaiting Approval (yellow)

**Click:** A completed run (e.g., "Daily Compliance Report")

**Show:**
- Run detail panel:
  - Cognate that executed
  - Cost of execution
  - Duration
  - Output/artifacts

**Click:** "View Trace"

**Navigate:** `/runs/:runId/trace`

**Wow Moment:**
> "This is the reasoning trace. Every step the AI took, why it took it, and what evidence it used. Fully explainable AI."

**Show:**
- Timeline of execution steps
- Confidence scores
- Citations to knowledge base

---

#### (2:45 - 3:00) Close

**Navigate:** `/` (Return to Home)

**Closing Statement:**
> "Symtex gives you AI that works like your best employees - accountable, auditable, and continuously improving. Any questions?"

**Leave on screen:** Home dashboard with active CognateDock

---

## 4. Track B: Operator Workflow (5 minutes)

**Scenario:** `operator-demo`
**Persona:** Operations Manager, Team Lead, Power User
**Key Message:** "Day-to-day AI operations with human oversight at the right moments"

### Script

---

#### (0:00 - 0:45) Run Overview

**Navigate:** `/runs`

**Talking Point:**
> "This is where operators manage the AI workforce. Every automation, every execution, in one place."

**Show:**
- Run list with various statuses
- Point out the columns: Automation, Cognate, Status, Duration, Cost

**Wow Moment:**
- Click on a "Running" status run
> "Let's look at this one that's in progress right now."

**Show:**
- Live progress indicator (65% complete)
- Current step: "Correlating log entries"
- Estimated time remaining

---

#### (0:45 - 1:30) Explain Plan

**Click:** "View Plan" button on a pending automation

**Talking Point:**
> "Before any automation runs, you can see exactly what it plans to do."

**Wow Moment - Explain Plan Modal:**
> "This is the Explain Plan. It shows you..."

**Show:**
- **Systems Touched:** "Salesforce, Slack, Google Sheets"
- **Permissions Required:** "Read contacts, Send messages, Write spreadsheet"
- **Estimated Cost:** "$1.75"
- **Risk Level:** "Medium - external communication"
- **Policy Check:** "Requires approval per External Communications policy"

> "No black boxes. You know exactly what will happen before it happens."

---

#### (1:30 - 2:30) Simulation & Diff

**Click:** "Simulate" button

**Talking Point:**
> "Now let's simulate this before we run it for real."

**Wait:** 2-3 seconds for simulation

**Wow Moment - Simulation Diff:**
> "Here's the before/after comparison - what would change if we approved this."

**Show:**
- Split view: Current State | Proposed State
- Highlighted changes:
  - "15 customer records would be updated"
  - "15 emails would be sent"
  - "1 Slack message to #customer-success"

> "If anything looks wrong, you can stop it here. Zero risk."

---

#### (2:30 - 3:30) Approval Gate

**Navigate:** `/control/approvals`

**Talking Point:**
> "Let's look at the approval queue. This is where humans stay in the loop."

**Show:**
- Approval queue with 2-3 pending items
- Click on "Customer Outreach" approval request

**Wow Moment - Policy Reason:**
> "See this? It tells you exactly WHY it needs approval."

**Show:**
- Policy: "External Communications"
- Reason: "This automation will send emails to 15 external recipients"
- Risk assessment
- Recommended action

**Click:** "Approve" button

**Show:**
- Approval confirmation dialog
- Option to add conditions or notes
- Click "Confirm Approval"

**Toast:** "Run approved and queued"

---

#### (3:30 - 4:30) Trace Timeline

**Navigate:** `/runs` (click the just-approved run when it completes, or use a completed run)

**Click:** "View Trace"

**Navigate:** `/runs/:runId/trace`

**Talking Point:**
> "After a run completes, you get the full trace - every step, every decision."

**Wow Moment - Trace Timeline:**
> "This is like a flight recorder for AI. Let's walk through it."

**Show:**
- Step 1: "Loaded customer list from Salesforce" - Confidence: 98%
- Step 2: "Filtered at-risk customers" - Confidence: 94%
- Step 3: "Generated personalized emails" - Confidence: 91%
- Step 4: "Sent emails via SendGrid" - Confidence: 100%

**Click:** Expand a step to show citations

**Show:**
- Knowledge source: "Customer Health Scoring Model"
- Evidence: Screenshot or artifact

> "If something ever goes wrong, you can trace it back to the exact step and data source."

---

#### (4:30 - 5:00) Close

**Navigate:** `/` (Home)

**Closing Statement:**
> "Day-to-day operations with AI: plan before you act, simulate before you commit, trace after you complete. Human oversight without the bottleneck."

---

## 5. Track C: Builder Deep Dive (7 minutes)

**Scenario:** `builder-demo`
**Persona:** Technical Lead, Platform Engineer, Architect
**Key Message:** "Build sophisticated AI automations with enterprise-grade governance"

### Script

---

#### (0:00 - 1:00) Cognate Setup

**Navigate:** `/team/cognates`

**Talking Point:**
> "Let's start with Cognates - these are your AI operators. Each one has specific skills, autonomy levels, and SOPs."

**Show:**
- Cognate roster grid
- Click on "Compliance Monitor"

**Navigate:** `/team/cognates/compliance-monitor`

**Wow Moment:**
> "Each Cognate is like an employee profile - skills, permissions, training history."

**Show:**
- Autonomy Level: L2 (Can act with human review)
- Skills: Regulatory analysis, Document review, Gap assessment
- Assigned Spaces: Compliance Ops
- SOP Count: 12
- Stats: 156 tasks, 94% accuracy

**Click:** "SOPs" tab

**Show:**
- List of Standard Operating Procedures
- "Policy Violation Detection"
- "Evidence Collection Protocol"
- "Compliance Report Generation"

---

#### (1:00 - 2:00) Automation Building

**Navigate:** `/control/lux` (Control > LUX Builder)

**Talking Point:**
> "LUX is our visual automation builder. Drag-and-drop workflow design."

**Show:**
- Canvas with existing automation
- Node palette on the left
- Properties panel on the right

**Wow Moment:**
> "Let me show you how fast you can build an automation."

**Action:** Drag a "Trigger" node onto canvas
**Action:** Drag a "Condition" node and connect
**Action:** Drag an "Action" node and connect

**Show:**
- Trigger: "When new document uploaded"
- Condition: "If document type is 'compliance'"
- Action: "Assign to Compliance Monitor for review"

> "That's it. A complete automation in 30 seconds."

---

#### (2:00 - 3:00) Narrative Builder

**Navigate:** `/control/narrative`

**Talking Point:**
> "For complex multi-step workflows, we have the Narrative builder."

**Show:**
- Narrative structure with chapters
- Chapter 1: "Trigger and Context"
- Chapter 2: "Analysis and Decision"
- Chapter 3: "Action and Verification"

**Wow Moment:**
> "Narratives are like playbooks. They tell your Cognates HOW to think through problems."

**Click:** Expand a chapter

**Show:**
- Natural language instructions
- Variable placeholders
- Decision trees
- Output requirements

---

#### (3:00 - 4:00) NEXIS Knowledge Graph

**Navigate:** `/knowledge/nexis`

**Talking Point:**
> "NEXIS is our entity relationship graph. It maps your organization's knowledge."

**Show:**
- 2D graph visualization
- Nodes: People, Organizations, Concepts, Events
- Edges: Relationships

**Click:** On "Sarah Chen" node

**Show:**
- Sarah Chen - VP Compliance
- Relationships:
  - Works at: Symtex LLC
  - Responsible for: SOC2 Compliance
  - Connected to: Q1 2026 SOC2 Audit

**Wow Moment - Create Automation from Insight:**
> "Here's the magic. Click on any entity..."

**Click:** "Create Automation" button on the "Q1 2026 SOC2 Audit" event

**Show:**
- Pre-filled automation template
- Context pulled from NEXIS:
  - Relevant people
  - Related documents
  - Deadlines

> "NEXIS turns your organization's knowledge into actionable automations."

---

#### (4:00 - 5:00) C2S2 Code Transformation

**Navigate:** `/control/c2s2`

**Talking Point:**
> "C2S2 is where AI-generated code becomes production-ready."

**Note:** Show "DEMO MODE" label prominently

**Show:**
- Code transformation pipeline
- Input: AI-generated code (natural language intent)
- Stage 1: Parse and validate
- Stage 2: Type inference
- Stage 3: Safety checks
- Output: Production S1 code

**Wow Moment:**
> "Watch this transformation."

**Show example:**
- Input: "Send renewal reminder to customers expiring in 30 days"
- Output: Type-safe S1 code with error handling

> "From intent to production code, with full type safety."

---

#### (5:00 - 6:00) Policy & Governance

**Navigate:** `/control/policies` (if exists) or `/control`

**Talking Point:**
> "Enterprise governance is built-in, not bolted on."

**Show:**
- Policy list:
  - External Communications
  - Budget Cap
  - Sensitive Data Access
  - System Modifications

**Click:** "External Communications" policy

**Show:**
- Scope: Revenue Ops space
- Triggers: Email send, Message send
- Requires: Manager + Compliance approval
- Limits: Working hours only

**Wow Moment:**
> "These policies are enforced automatically. Try to send an email at 2 AM? Blocked. Try to exceed budget? Blocked. No exceptions."

---

#### (6:00 - 6:45) Symbios Command Interface

**Navigate:** `/symbios`

**Talking Point:**
> "Symbios is the command interface. Natural language control of your entire AI workforce."

**Type in chat:** "Show me the last blocked run"

**Show:**
- Symbios response with run details
- Link to the blocked run

**Type:** "Why was it blocked?"

**Show:**
- Policy explanation
- Recommendation

**Wow Moment:**
**Type:** "Request approval for this run"

**Show:**
- Approval request initiated
- Confirmation message

> "Natural language to action. No forms, no navigation, just ask."

---

#### (6:45 - 7:00) Close

**Navigate:** `/` (Home)

**Closing Statement:**
> "From Cognate creation to visual automation, from knowledge graphs to code transformation - all with enterprise governance baked in. Symtex is the operating system for AI."

---

## 6. Wow Moments Reference

Quick reference for all demo-worthy moments:

| Moment | Navigation | What to Show | Key Phrase |
|--------|------------|--------------|------------|
| **Explain Plan** | `/runs` > Click automation | Systems, permissions, cost modal | "No black boxes" |
| **Simulation Diff** | After "Simulate" click | Before/after comparison | "Zero risk testing" |
| **Approval Gate** | `/control/approvals` | Policy reason, approve flow | "Humans in the loop" |
| **Trace Timeline** | `/runs/:runId/trace` | Step-by-step reasoning | "Flight recorder for AI" |
| **Pattern Compile** | `/signals` | "Now deterministic" badge | "Gets cheaper over time" |
| **NEXIS Insight** | `/knowledge/nexis` | Create automation from entity | "Knowledge to action" |
| **Symbios Command** | `/symbios` | "Show last blocked run" | "Just ask" |
| **Audit Trail** | `/control/ledger` | 6 W's framework | "Auditors love this" |
| **Cognate Profile** | `/team/cognates/:id` | Skills, autonomy, SOPs | "Like an employee" |
| **LUX Visual** | `/control/lux` | Drag-drop automation | "30-second build" |

---

## 7. Emergency Recovery

### 7.1 If Demo Breaks

**Immediate Recovery:**
1. Press `Ctrl+Shift+D` to open Demo Panel
2. Click "Reset Demo State"
3. Refresh page (`Ctrl+R`)
4. Reapply scenario
5. Continue from current section

**While Recovering:**
> "Let me reset our demo environment - one of the great things about Symtex is that you can always start fresh."

### 7.2 If Feature Not Working

**Skip Gracefully:**
> "Let me show you something related..."

**Alternative Routes:**

| If This Fails | Show This Instead |
|---------------|-------------------|
| Simulation | Trace of completed run |
| Approval flow | Ledger audit trail |
| NEXIS graph | Knowledge library |
| C2S2 | LUX builder |
| Symbios | Command palette |

### 7.3 Common Issues

| Issue | Quick Fix |
|-------|-----------|
| CognateDock not showing | Refresh page, reapply scenario |
| Runs list empty | Apply different scenario |
| Graph not loading | Skip to next section |
| Slow performance | "Our demo server is under load" |
| Console errors | Ignore unless blocking |

---

## 8. Q&A Preparation

### Executive Questions

**Q: "What's the ROI?"**
> "Customers typically see 60-80% reduction in manual compliance work, and the time savings compound as patterns compile."

**Q: "Is this SOC2/HIPAA compliant?"**
> "Our audit trail captures the 6 W's for every action - who, what, when, where, why, how. Your compliance team can audit any AI decision."

**Q: "What if the AI makes a mistake?"**
> "Two safeguards: First, simulation before execution. Second, every action is reversible with full trace. You can undo and understand why."

### Operator Questions

**Q: "How do I know what needs my attention?"**
> "The approval queue surfaces anything that needs human review, prioritized by risk level."

**Q: "Can I customize when approval is required?"**
> "Absolutely. Policies are fully configurable - by action type, risk level, cost threshold, time of day."

### Builder Questions

**Q: "Can I write my own S1 code?"**
> "Yes - the C2S2 pipeline accepts both natural language and direct S1 code. Advanced users can bypass the AI layer."

**Q: "How does it integrate with our existing tools?"**
> "We have pre-built packs for Salesforce, Slack, Google Workspace, and more. Custom integrations via our SDK."

---

## 9. Post-Demo Checklist

After every demo:

- [ ] Close Demo Panel (`Ctrl+Shift+D`)
- [ ] Note any issues encountered
- [ ] Record questions asked
- [ ] Save scenario state (if needed)
- [ ] Clear browser state (if sharing machine)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | Claude | Initial creation |
