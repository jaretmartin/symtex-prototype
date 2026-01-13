---
paths:
  - "src/components/**/*.tsx"
  - "src/routes/**/*.tsx"
---

# React Component Guidelines

## Component Structure
```tsx
// 1. Imports
import { useState } from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
  onAction: () => void;
}

// 3. Component
export function ComponentName({ title, onAction }: Props): JSX.Element {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Handlers
  const handleClick = (): void => {
    onAction();
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

## Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE

## Performance
- Use `useMemo` for expensive calculations
- Use `useCallback` for handlers passed to children
- Avoid inline object/array creation in JSX
