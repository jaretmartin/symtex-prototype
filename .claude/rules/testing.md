---
paths:
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
  - "src/**/*.spec.ts"
  - "src/**/*.spec.tsx"
---

# Testing Guidelines

## Framework
- Use Vitest for unit tests (when implemented)
- React Testing Library for component tests
- Playwright for E2E tests (when implemented)

## Patterns
- Test behavior, not implementation details
- One assertion per test when possible
- Use descriptive test names: `it('should display error when form is invalid')`

## File Naming
- Unit tests: `ComponentName.test.tsx`
- Integration tests: `feature.integration.test.ts`
- E2E tests: `user-flow.e2e.ts`

## Mocking
- Mock external dependencies, not internal modules
- Use MSW for API mocking
- Avoid mocking React hooks directly
