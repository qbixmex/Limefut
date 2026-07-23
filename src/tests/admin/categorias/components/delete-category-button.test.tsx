import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteCategory } from '@/app/admin/categorias/(components)/delete-category';

const mockDeleteAction = vi.fn<
  (params: {
    categoryId: string;
    authenticatedUserId: string | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/categorias/(actions)/delete-category.action', () => ({
  deleteCategoryAction: (params: {
    categoryId: string;
    authenticatedUserId: string | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  }) => mockDeleteAction(params),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('Test on <DeleteCategory /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteAction.mockResolvedValue({
      ok: true,
      message: '¡ La categoría ha sido eliminada correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    const categoryId = '01aa10d4-aeab-4fe5-b5c3-dd46d1ac58fb';
    render(
      <DeleteCategory
        categoryId={categoryId}
        userId="user-123"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /icono de basurero/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should call deleteCategoryAction on confirm', async () => {
    const categoryId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    render(
      <DeleteCategory
        categoryId={categoryId}
        userId="user-123"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith({
        categoryId,
        authenticatedUserId: 'user-123',
        authenticatedUserRoles: ['admin'],
      });
    });
  });

  test('Should not call deleteCategoryAction when cancel is clicked', async () => {
    const categoryId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    render(
      <DeleteCategory
        categoryId={categoryId}
        userId="user-123"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });

  test('Should show error toast when roles do not include admin', async () => {
    const { toast } = await import('sonner');
    const categoryId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    render(
      <DeleteCategory
        categoryId={categoryId}
        userId="user-123"
        roles={['user']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        '¡ No tienes permisos administrativos para eliminar categorías !',
      );
    });
    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
