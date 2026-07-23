---
name: testing-custom-hooks
description: >
  Conventions for testing custom client hooks that use react-hook-form
  and call server actions. Activate when writing or modifying hook test files.
---

## General

- Mirror source layout under `src/tests/`
- File naming: `<hook-name>.test.ts` (no `.tsx`)
- Use `renderHook` and `act` from `@testing-library/react`
- Use Vitest globals (`vi`)
- Mock data goes in `mocks/<entity>.mock.ts` co-located with the test

## Implementation Patterns (for reference)

All admin create/edit hooks follow this signature:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
// import schema, action, routes

export const useMyHook = ({
  authenticatedUserId,
  authenticatedUserRoles,
  // optional: entity for edit mode
}: {
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}) => {
  const router = useRouter();
  const form = useForm<...>({
    resolver: zodResolver(mySchema),
    defaultValues: { ... },
  });

  const onSubmit = async (data: ...) => {
    const formData = new FormData();
    // append fields...
    const { ok, message } = await myAction({ ... });
    if (!ok) { toast.error(message); return; }
    toast.success(message);
    form.reset(DEFAULT_VALUES);
    router.replace(ROUTES.SOME_ROUTE);
  };

  const handleNavigateBack = () => {
    form.reset(DEFAULT_VALUES);
    router.replace(ROUTES.SOME_ROUTE);
  };

  return { form, onSubmit, handleNavigateBack };
};
```

Delete hooks are simpler (no react-hook-form):

```typescript
export const useDeleteMyEntity = (id: string, userId: string | undefined, roles: string[]) => {
  const onDelete = async () => {
    if (!roles.includes('admin')) {
      toast.error('...');
      return;
    }
    const { ok, message } = await deleteAction({ ... });
    if (!ok) { toast.error(message); return; }
    toast.success(message);
  };
  return { onDelete };
};
```

## Test File Template

### 1. Hoisted mocks (top of file, before any imports)

```typescript
const { mockReplace, mockAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockAction: vi.fn<
    (params: { ... }) => Promise<{ ok: boolean; message: string }>
  >(),
}));
```

Always type the `vi.fn()` generic with the exact action params and return type.

### 2. Module mocks (after hoisted, before imports)

```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/path/to/action', () => ({
  myAction: mockAction,
}));
```

### 3. Imports

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/app/path/to/hook';
// for edit hooks:
import { mockEntity } from './mocks/entity.mock';
import { ROUTES } from '@/shared/constants/routes';
```

### 4. Data definitions (outside describe)

```typescript
const defaultProps = {
  authenticatedUserId: 'some-uuid',
  authenticatedUserRoles: ['admin'],
  // category, tournament, etc. (edit mode only)
};

const validData = {
  // JS data that would come from the form
  name: 'Test Name',
  permalink: 'test-name',
  // ... other fields
};
```

Files in `mocks/` export plain objects matching the entity shape:

```typescript
export const mockEntity = {
  id: 'uuid',
  name: 'Test',
  permalink: 'test',
  // ...
};
```

### 5. Describe block

```typescript
describe('Tests on useMyHook hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAction.mockResolvedValue({
      ok: true,
      message: '¡ Success message !',
    });
  });
```

Do NOT use `vi.spyOn(console, 'log')` for hooks (only for server actions).

### 6. Required test cases (create/edit hooks)

| # | Test | Expectation |
|---|---|---|
| 1 | Initialize form with empty default values | `form.getValues()` matches defaults |
| 2 | Initialize form with entity values (edit mode) | Values pre-filled from entity |
| 3 | `handleNavigateBack` navigates correctly | `mockReplace` called with `ROUTES.*` |
| 4 | `onSubmit` calls action with correct params | `expect.objectContaining` + `FormData` assertions |
| 5 | `onSubmit` shows success toast and navigates | `toast.success` called; `mockReplace` called |
| 6 | `onSubmit` shows error toast, no navigation | `toast.error` called; `mockReplace` NOT called |

### 7. Required test cases (delete hooks)

| # | Test | Expectation |
|---|---|---|
| 1 | Calls action with correct params | Correct `id`, `userId`, `roles` |
| 2 | Shows success toast on ok | `toast.success` called |
| 3 | Shows error toast on failure | `toast.error` called |
| 4 | Blocks non-admin | `toast.error` with roles message |

### 8. Dynamic toast import

Import `toast` dynamically inside tests (not at the top level):

```typescript
test('onSubmit should show success toast and navigate on success', async () => {
  const { toast } = await import('sonner');
  const { result } = renderHook(() => useMyHook(defaultProps));
  await act(async () => { await result.current.onSubmit(validData); });
  expect(toast.success).toHaveBeenCalledWith('...');
});
```

## Complete Example Reference

See existing tests:
- `src/tests/admin/torneos/create/use-create-tournament.test.ts`
- `src/tests/admin/torneos/edit/use-edit-tournament.test.ts`
- `src/tests/admin/categorias/create/use-create-category.test.ts`
- `src/tests/admin/categorias/edit/use-edit-category.test.ts`
