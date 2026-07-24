---
name: testing-view-pages
description: >
  Conventions for testing admin view server components that use Suspense
  with skeleton fallback. Activate when writing tests for view components
  between the page and table layer.
---

## General

- Test file mirrors source under `src/tests/`
- Naming: `<entity>-view.test.tsx`
- Import `{ use, act }` from `react`, plus `{ render, screen }` from `@testing-library/react`

## Mock Pattern for Suspense

The child table component must be mocked with a **Suspense trigger**:

```typescript
const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/.../(components)/entity-table', () => ({
  EntityTable: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => {}));  // triggers Suspense fallback
    }
    return <div data-testid="entity-table" />;
  },
}));
```

The `use(new Promise(() => {}))` call makes React suspend indefinitely when `shouldSuspend.value` is `true`.

## Imports

```typescript
import { use, act } from 'react';
import { EntityView } from '@/app/admin/.../entity-view';
import { render, screen } from '@testing-library/react';
```

Import `EntityView` as a **named export** (not default).

## SearchParams Type

```typescript
type SearchParams = { query?: string; page?: string; };
```

## Test Template

```typescript
describe('Tests on EntityView', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render correctly', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await EntityView({
      searchParams: Promise.resolve<SearchParams>({ query: undefined, page: undefined }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('entity-table')).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    const ServerComponent = await EntityView({
      searchParams: Promise.resolve<SearchParams>({ query: undefined, page: undefined }),
    });

    await act(() => render(ServerComponent));

    expect(screen.getByTestId('entity-table-skeleton')).toBeInTheDocument();
  });
});
```

## Required Test Cases

| # | Test | Expectation |
|---|---|---|
| 1 | Render successfully (table loaded) | Child table component present |
| 2 | Render skeleton while suspended | Skeleton testid present |

## Key Differences from Page Tests

| Page tests | View tests |
|---|---|
| Mock children as `() => null` | Mock table with Suspense trigger |
| No `shouldSuspend` flag | `vi.hoisted()` `shouldSuspend` flag |
| Default export | Named export |
| No `act` needed | `await act()` for skeleton test |

## Example Reference

- `src/tests/admin/categorias/list/categories-view.test.tsx`
