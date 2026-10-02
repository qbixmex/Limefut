import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteCategory } from '@/app/admin/categorias/(components)/delete-category';

const mockDeleteAction = vi.fn<
  (params: {
    categoryId: string;
  }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/categorias/(actions)/delete-category.action', () => ({
  deleteCategoryAction: (params: {
    categoryId: string;
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
      message: 'La categoría ha sido eliminada correctamente',
    });
  });

  const renderComponent = (categoryId: string) => {
    render(
      <DeleteCategory categoryId={categoryId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar categoría/i });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });

    return {
      user,
      deleteButton,
      cancelButton,
      confirmButton,
    };
  };

  test('Should render correctly', () => {
    const categoryId = '01aa10d4-aeab-4fe5-b5c3-dd46d1ac58fb';
    const { deleteButton } = renderComponent(categoryId);

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deleteCategoryAction on confirm', async () => {
    const categoryId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    const { user, deleteButton, confirmButton } = renderComponent(categoryId);

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith({
        categoryId,
      });
    });
  });

  test('Should not call deleteCategoryAction when cancel is clicked', async () => {
    const categoryId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    const { user, deleteButton, cancelButton } = renderComponent(categoryId);

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
