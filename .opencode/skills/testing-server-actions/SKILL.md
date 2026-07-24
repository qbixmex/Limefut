---
name: testing-server-actions
description: >
  Conventions for writing server action tests with Vitest.
  Activate when writing or modifying test files for server actions.
---

## General

- Place test files in `src/tests/` mirroring the source structure
- File naming: `<action-name>.test.ts` (no `.tsx`)
- Use Vitest (`vi` globals)
- Do NOT import `vi` — it is a global

## Test File Structure

### 1. Hoisted Mocks (top of file, before imports)

```typescript
const { mockTransaction, MockPrismaClientKnownRequestError } = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;
    constructor(
      message: string,
      options: { code: string; meta?: Record<string, unknown> },
    ) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = options.code;
      this.meta = options.meta;
    }
  }
  return {
    MockPrismaClientKnownRequestError,
    mockTransaction: vi.fn(),
  };
});
```

### 2. Module Mocks (after hoisted, before imports)

```typescript
vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: mockTransaction,
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));
```

Mock other modules as needed (e.g., `@/shared/actions` for uploadImage).

### 3. Import the action under test

```typescript
import { myAction } from '@/app/admin/.../(actions)/my-action.action';
```

### 4. Helpers (before describe)

- `validFormData()`: factory function returning a filled `FormData`
- `mockCreatedRecord`: object matching the expected return shape
- `mockTx`: object with `vi.fn()` methods for each Prisma model used in the transaction

### 5. Describe block

```typescript
describe('Tests on <action name> server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    // reset mockTx methods here
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
```

## Auth Test Cases (every action)

Always test these auth scenarios (in this order):

| Test | `authenticatedUserId` | `authenticatedUserRoles` |
|---|---|---|
| undefined user | `undefined` | `['admin']` |
| null user | `null` | `['admin']` |
| no admin role | `'user-id'` | `['user']` |
| empty roles | `'user-id'` | `[]` or `null` |

**Auth error message**: "Debes estar autentificado" (with **f**, not "autenticado")

**Roles error message**: "No tienes permisos administrativos"

Do NOT use `toContain()` for these — use exact strings like:
```typescript
expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
```

## Validation Test Cases

When the action uses zod validation:

- Test missing required fields
- Test invalid field formats

## Business Logic Test Cases

- Test duplicate entry (Prisma P2002) → check error message
- Test success case → check `ok: true`, returned data shape
- Test "not found" cases (delete, update, fetch single)

## Error Handling Test Cases

| Error type | How to simulate | Expected behavior |
|---|---|---|
| Prisma P2002 | `new MockPrismaClientKnownRequestError('msg', { code: 'P2002' })` | Return `ok: false` with duplicate message |
| Other Prisma error | `new MockPrismaClientKnownRequestError('msg', { code: 'P2025' })` | Return `ok: false`, log `error.message` |
| Generic Error | `new Error('something went wrong')` | Return `ok: false` |
| Unknown error | `'string error'` or `null` | Return `ok: false` |

## Spies

```typescript
vi.spyOn(console, 'log').mockImplementation(() => {});
```
Comment out the `.mockImplementation(...)` temporarily to see console output while debugging.

## Example Reference

See existing test files for complete examples:
- `src/tests/admin/torneos/actions`
- `src/tests/admin/categorias/actions`
