# Claude Code Instructions

## CRITICAL: Model Requirements

**YOU MUST use Opus 4.5 exclusively for ALL agents and sub-agents.**

When using the Task tool to spawn any agent:
- ALWAYS set `model: "opus"`
- NEVER use `sonnet` or `haiku`
- This applies to ALL agent types without exception
- No other models are permitted in this project

---

## Project Context

@README.md
@package.json

### About This Project
Symtex Prototype - A React-based frontend application for AI operations management, workflow automation, and prompt engineering. Built with TypeScript, Vite, React Router, and ReactFlow.

### Technology Stack
- **Runtime**: Node.js with pnpm
- **Framework**: React 18 + TypeScript 5
- **Build**: Vite
- **Routing**: React Router DOM
- **UI**: Tailwind CSS, Lucide React icons
- **Workflow**: ReactFlow for visual builders

---

## Key Directories

```
src/
├── components/     # Reusable UI components
│   ├── home/       # Dashboard widgets
│   ├── lux/        # Workflow builder (ReactFlow)
│   ├── dna/        # AI capability metrics
│   └── ui/         # Base UI primitives
├── routes/         # Page components
├── lib/            # Utilities (currently empty)
└── styles/         # Global CSS
```

---

## Development Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server (port 5173)
pnpm build          # Production build
pnpm preview        # Preview production build
pnpm lint           # Run ESLint
```

---

## Workflow Guidelines

### IMPORTANT: Always Use Plan Mode First
Before implementing any non-trivial feature:
1. Press `Shift+Tab` twice to enter Plan Mode
2. Explore the codebase and design approach
3. Get user approval before writing code

### Verification Loop
YOU MUST always verify your work:
1. Run `pnpm build` after code changes
2. Run `pnpm lint` to check for issues
3. Test in browser if UI changes

### Context Management
- Use `/clear` between distinct tasks
- Use `/catchup` to reload recent git changes
- Keep sessions focused on single objectives

---

## Code Standards

### TypeScript
- Explicit return types on all functions
- Prefer `interface` over `type` for objects
- Use `const` assertions where appropriate
- Destructure props in function signatures

### React
- Functional components only
- Custom hooks for shared logic
- Prefer composition over inheritance
- Co-locate component styles

### Imports
```typescript
// 1. React/external libraries
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal components
import { Button } from '@/components/ui/Button';

// 3. Types/utilities
import type { User } from '@/types';
```

---

## Protected Areas

**DO NOT modify without explicit user approval:**
- `package.json` dependencies
- `vite.config.ts`
- `tsconfig.json`
- Any `.env` files

---

## Agent Coordination

When orchestrating parallel agents:
1. Use git worktrees for isolation when needed
2. Each agent handles one focused task
3. Orchestrator (you) synthesizes results
4. All agents use Opus 4.5 (no exceptions)

### Sub-Agent Patterns
- **Explore**: Codebase research and discovery
- **Plan**: Architecture and design decisions
- **Bash**: Git operations, builds, installs
- **General-purpose**: Complex multi-step tasks

---

## Notes

- PromptOps and DNA features are placeholders (not implemented)
- LUX Builder uses ReactFlow for workflow visualization
- All routes are client-side (no SSR)
- Focus on UI/UX - backend integration is future work

---

@.claude/rules/testing.md
@.claude/rules/security.md
