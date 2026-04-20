---
name: react:components
description: Creates React components following Qwantic Coders project conventions with TypeScript, plain CSS, and Tailwind.
allowed-tools:
  - "Bash"
  - "Read"
  - "Write"
  - "glob"
  - "grep"
---

# React Components Skill

You create React components following the Qwantic Coders project conventions.

## Project Conventions

### Component Structure
- Use `FC` type from React for functional components
- Use plain `.css` files with Tailwind ONLY (NEVER use CSS modules - dark mode doesn't work with modules)
- Props interface named `[ComponentName]Props`
- Export as named export and default
- All imports MUST use single quotes (`'path'` not `"path"`)

### Next.js Pages vs React Components

**If the file is a Next.js page inside `app/` folder:**
- Do NOT include empty Props
- Use this format:

```typescript
import type { FC } from 'react';
import './PageName.css';

const PageName: FC = () => {
  return (
    <div className="container">
      {/* content */}
    </div>
  );
};

export default PageName;
```

**If it's a reusable React component (in `components/` or elsewhere):**
- Include Props interface

```typescript
import type { FC } from 'react';
import './ComponentName.css';

type Props = Readonly<{
  // sample: string;
}>;

const ComponentName: FC<Props> = ({ /* sample */ }) => {
  return (
    <div className="container">
      {/* content */}
    </div>
  );
};

export default ComponentName;
```

### File Organization
```
components/
├── ComponentName/
│   ├── ComponentName.tsx
│   └── ComponentName.css  (plain CSS with @apply, NOT .module.css)
```

IMPORTANT: NEVER use `.module.css` files. Always use plain `.css` files.

### Component Template
```typescript
import type { FC } from 'react';
import './ComponentName.css';

type Props = Readonly<{
  // sample: string;
}>;

const ComponentName: FC<Props> = ({ /* sample */ }) => {
  return (
    <div className="container">
      {/* content */}
    </div>
  );
};

export default ComponentName;
```

### Naming
- Components: PascalCase (`Button`, `UserCard`)
- Files: PascalCase (`Button.tsx`, `UserCard.tsx`)
- CSS classes: kebab-case (`.container`, `.main-content`)

### Plain CSS with Tailwind
- Always reference globals.css at the top: `@reference "../../globals.css";`
- The `globals.css` is at project root, NOT in `app/` folder
- Group related Tailwind classes in their own `@apply` rows
- Each row should contain classes that share a concern (layout, spacing, visual, typography, states)

Good:
```css
.button {
  @apply flex flex-col md:flex-row gap-5;
  @apply px-4 py-2;
  @apply text-blue-600 dark:text-blue-500 font-semibold;
  @apply bg-white hover:bg-gray-50 rounded-lg;
  @apply transition-all duration-200;
}
```

Bad (all in one line):
```css
.button {
  @apply flex flex-col md:flexRow gap-5 px-4 py-2 text-blue-600 dark:text-blue-500 font-semibold;
}
```

## Execution Steps
1. Check existing components in `components/` or `app/` directory for reference
2. Create component folder with proper name
3. Create TypeScript file with props interface
4. Create plain CSS file (NOT .module.css)
5. Export from `components/index.ts` if barrel export exists
