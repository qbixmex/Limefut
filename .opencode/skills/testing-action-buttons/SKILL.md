---
name: testing-action-buttons
description: >
  Conventions for testing admin action button components with tooltips,
  links, and confirmation dialogs. Activate when writing tests for
  button-level components.
---

## General

- Test file mirrors source under `src/tests/`
- Naming: `<action>-button.test.tsx` or `<entity>-button.test.tsx`
- Use `render` and `screen` from `@testing-library/react`
- Use `userEvent` from `@testing-library/user-event`
- **Always** wrap with `TooltipProvider`:
  ```typescript
  render(<Component />, { wrapper: TooltipProvider });
  ```

## Imports

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
```

Include `waitFor` when testing async confirmation dialogs.

## Button Types

### Type 1: Simple Link Button (Create, Details)

Client component, synchronous render.

```typescript
describe('Test on <CreateEntity /> component', () => {
  test('Should render correctly', () => {
    render(<CreateEntity />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /crear/i });
    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<CreateEntity />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    render(<CreateEntity />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear/i });
    expect(link).toHaveAttribute('href', '/admin/entidad/crear');
  });
});
```

### Type 2: Edit Button — Client Variant

```typescript
describe('Test on <EditEntity /> component', () => {
  test('Should render correctly', () => {
    render(<EditEntity entityId="uuid" />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /lápiz/i });
    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<EditEntity entityId="uuid" />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', () => {
    render(<EditEntity entityId="uuid" />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar/i });
    expect(link).toHaveAttribute('href', `/admin/entidad/editar/${entityId}`);
  });
});
```

### Type 3: Edit Button — Server Variant

When the edit button is a server component that receives `paramsPromise`:

```typescript
describe('Test on <EditEntity /> component', () => {
  test('Should render correctly', async () => {
    const element = await EditEntity({ paramsPromise: Promise.resolve({ id: 'uuid' }) });
    render(element, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /lápiz/i });
    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const element = await EditEntity({ paramsPromise: Promise.resolve({ id: 'uuid' }) });
    render(element, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', async () => {
    const element = await EditEntity({ paramsPromise: Promise.resolve({ id: 'uuid' }) });
    render(element, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar/i });
    expect(link).toHaveAttribute('href', `/admin/entidad/editar/uuid`);
  });
});
```

### Type 4: Delete Button — Hook Mock Variant

When the delete component delegates to a custom hook:

```typescript
vi.mock('@/app/admin/.../delete-entity/use-delete-entity');

describe('Test on <DeleteEntity /> component', () => {
  test('Should render correctly', () => {
    vi.mocked(useDeleteEntity).mockReturnValue({ onDeleteEntity: vi.fn() });

    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={[]} />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /basurero/i });
    expect(icon).toBeInTheDocument();
  });

  test('Should call onDeleteEntity on confirm', async () => {
    const mockOnDelete = vi.fn();
    vi.mocked(useDeleteEntity).mockReturnValue({ onDeleteEntity: mockOnDelete });

    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /^eliminar$/ }));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  test('Should NOT call onDeleteEntity when cancel is clicked', async () => {
    const mockOnDelete = vi.fn();
    vi.mocked(useDeleteEntity).mockReturnValue({ onDeleteEntity: mockOnDelete });

    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
```

### Type 5: Delete Button — Action Mock Variant

When the delete component calls the action directly:

```typescript
const mockDeleteAction = vi.fn<
  (params: { ... }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/.../(actions)/delete-entity.action', () => ({
  deleteEntityAction: (params) => mockDeleteAction(params),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe('Test on <DeleteEntity /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteAction.mockResolvedValue({ ok: true, message: 'Eliminado' });
  });

  test('Should render correctly', () => {
    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /basurero/i });
    expect(icon).toBeInTheDocument();
  });

  test('Should call delete action on confirm', async () => {
    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /^eliminar$/ }));

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith({
        entityId: 'uuid',
        authenticatedUserId: 'user-1',
        authenticatedUserRoles: ['admin'],
      });
    });
  });

  test('Should NOT call delete action when cancel is clicked', async () => {
    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });

  test('Should show error toast when roles do not include admin', async () => {
    const { toast } = await import('sonner');

    render(
      <DeleteEntity entityId="uuid" userId="user-1" roles={['user']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /^eliminar$/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No tienes permisos administrativos'),
      );
    });
    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
```

Import `toast` dynamically: `const { toast } = await import('sonner');`

## Required Test Cases by Type

| Type | Tests |
|---|---|
| Create / Details | render icon, tooltip on hover, link href |
| Edit (client) | render icon, tooltip on hover, link href with id |
| Edit (server) | render icon (await), tooltip on hover (await), link href (await) |
| Delete (hook mock) | render icon, confirm calls hook, cancel does not |
| Delete (action mock) | render icon, confirm calls action, cancel does not, role check toast |

## Example References

Categorías:
- `src/tests/admin/categorias/components/create-category-button.test.tsx`
- `src/tests/admin/categorias/components/edit-category-button.test.tsx`
- `src/tests/admin/categorias/components/delete-category-button.test.tsx`

Torneos:
- `src/tests/admin/torneos/components/create-tournament-button.test.tsx`
- `src/tests/admin/torneos/components/edit-tournament-button.test.tsx`
- `src/tests/admin/torneos/components/delete-tournament-button.test.tsx`
- `src/tests/admin/torneos/components/tournament-details-button.test.tsx`
