---
name: testing-list-tables
description: >
  Conventions for testing admin table server components that render
  lists of entities with actions. Activate when writing tests for
  entity table components.
---

## General

- Test file mirrors source under `src/tests/`
- Naming: `<entity>-table.test.tsx`
- Use `render` and `screen` from `@testing-library/react`
- Server component: call `await Component({...})` directly, then `render()`
- Mock data in `src/tests/admin/<entity>/mocks/<entities>.mock.ts`

## Mocks

### Auth

```typescript
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
    },
  },
}));
```

### Fetch action

```typescript
vi.mock('@/app/admin/.../(actions)/fetch-entities.action');
```
Import it at the top and mock return in `beforeEach`:
```typescript
import { fetchEntitiesAction } from '@/app/admin/.../(actions)/fetch-entities.action';

beforeEach(() => {
  vi.mocked(fetchEntitiesAction).mockResolvedValue(defaultResponse);
});
```

### Child action components (use data-testid)

```typescript
vi.mock('@/app/admin/.../(components)/edit-entity', () => ({
  EditEntity: () => <span data-testid="edit-entity" />,
}));

vi.mock('@/app/admin/.../(components)/delete-entity', () => ({
  DeleteEntity: () => <span data-testid="delete-entity" />,
}));
```

Use `data-testid` (not `() => null`) so you can assert action button counts.

### Shared components

```typescript
vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));
```

Mock other shared components as needed (`ActiveSwitch`, `ShowDetails`, etc.).

## Imports

```typescript
import { EntityTable } from '@/app/admin/.../(components)/entity-table';
import { render, screen } from '@testing-library/react';
import { entitiesMock } from '../mocks/entities.mock';
import { fetchEntitiesAction } from '@/app/admin/.../(actions)/fetch-entities.action';
```

## defaultResponse and renderComponent

```typescript
const defaultResponse = {
  ok: true,
  message: 'Los entidades fueron obtenidas satisfactoriamente',
  entities: entitiesMock,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const renderComponent = async () => {
  const ServerComponent = await EntityTable({ query: '', currentPage: '' });
  return render(ServerComponent);
};
```

`defaultResponse` shape must match the action's return type.

## Required Test Cases

| # | Test | Expectation |
|---|---|---|
| 1 | Render table | `screen.getByRole('table', { name: /tabla/i })` |
| 2 | Empty state | Text like "Aún no hay ... creados" |
| 3 | Data fields | Each entity's name, permalink, etc. visible |
| 4 | Action buttons | Correct count via `getAllByTestId` per row |
| 5 | Pagination | `getByTestId('pagination')` |
| 6 | Error state | Error message visible + no table (`queryByRole`) |

## Optional Test Cases (entity-specific)

- Link to detail page: `expect(screen.getByTestId(id)).toHaveAttribute('href', '/admin/.../${id}')`
- Formatted dates (using `date-fns` with `es` locale)
- Status badges (categories quantity, etc.)
- ActiveSwitch component presence

## Example Reference

- `src/tests/admin/torneos/list/tournaments-table.test.tsx`
- `src/tests/admin/categorias/list/categories-table.test.tsx`
