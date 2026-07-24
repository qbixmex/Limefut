---
name: testing-list-pages
description: >
  Conventions for testing admin list pages that are server components
  with searchParams and default export. Activate when writing page-level
  tests for default-export admin pages.
---

## General

- Test file mirrors source under `src/tests/`
- Naming: `<entity>-page.test.tsx` or `<entity>-view.test.tsx`
- Use `render` and `screen` from `@testing-library/react`
- Do NOT use `renderHook` or `act` (these are synchronous server renders)

## Mock Pattern

Always mock these at the top level (before imports):

```typescript
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/admin',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('@/shared/components/search', () => ({
  Search: () => null,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/.../(components)/create-entity', () => ({
  CreateEntity: () => null,
}));

vi.mock('@/app/admin/.../view-component', () => ({
  ViewComponent: () => <div data-testid="view-component" />,
}));
```

Use `() => null` for components that don't need testid assertions.
Use `<div data-testid="..."/>` for components you need to assert presence.

## Imports

```typescript
import PageComponent from '@/app/admin/.../page';
import { render, screen } from '@testing-library/react';
```

Import the **default export** from the page file.

## SearchParams Type

```typescript
type SearchParams = { query?: string; page?: string; };
```

## Test Template

```typescript
describe('Tests on <EntityPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await PageComponent({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByRole('heading', { name: /recurso/i })).toBeInTheDocument();
  });

  test('Should render child component', async () => {
    const ServerComponent = await PageComponent({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('create-entity')).toBeInTheDocument();
    expect(screen.getByTestId('view-component')).toBeInTheDocument();
  });
});
```

## Required Test Cases

| # | Test | Expectation |
|---|---|---|
| 1 | Render page heading | `screen.getByRole('heading')` matches resource name |
| 2 | Render child components | Each mocked child present via `testid` or text |

## Example Reference

- `src/tests/admin/torneos/list/tournaments.test.tsx`
- `src/tests/admin/categorias/list/categories-page.test.tsx`
