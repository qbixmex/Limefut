const { mockDeleteStandingsAction } = vi.hoisted(() => ({
  mockDeleteStandingsAction: vi.fn(),
}));

vi.mock('@/app/admin/estadisticas/(actions)/delete-standings.action', () => ({
  deleteStandingsAction: (params: unknown) => mockDeleteStandingsAction(params),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DeleteStandings } from '@/app/admin/estadisticas/(components)/delete-standings';
import {
  CATEGORY_ID,
  TOURNAMENT_ID,
} from '../mocks/standings.mock';

const renderComponent = () => {
  render(
    <TooltipProvider>
      <DeleteStandings
        tournamentId={TOURNAMENT_ID}
        categoryId={CATEGORY_ID}
      />
    </TooltipProvider>,
  );

  const deleteButton = () => screen.getByRole('button');
  const cancelButton = () => {
    return screen.getByRole('button', { name: /cancelar/i });
  };
  const confirmButton = () => {
    return screen.getByRole('button', { name: /^eliminar$/ });
  };

  return {
    user: userEvent.setup(),
    deleteButton,
    cancelButton,
    confirmButton,
  };
};

describe('Tests on <DeleteStandings /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteStandingsAction.mockResolvedValue({
      ok: true,
      message: 'Las estadísticas han sido eliminadas correctamente',
    });
  });

  test('Should render the delete button', () => {
    renderComponent();

    const deleteButton = screen.getByRole('button');

    expect(deleteButton).toBeInTheDocument();
  });

  test('Should delete the standings of the tournament and category on confirm', async () => {
    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteStandingsAction).toHaveBeenCalledWith({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });
    });
  });

  test('Should not delete the standings when cancel is clicked', async () => {
    const { user, deleteButton, cancelButton } = renderComponent();

    await user.click(deleteButton());
    await user.click(cancelButton());

    expect(mockDeleteStandingsAction).not.toHaveBeenCalled();
  });

  test('Should show a success toast when the standings are deleted', async () => {
    const { toast } = await import('sonner');

    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Las estadísticas han sido eliminadas correctamente',
      );
    });
  });

  test('Should show an error toast when deletion fails', async () => {
    const { toast } = await import('sonner');
    mockDeleteStandingsAction.mockResolvedValue({
      ok: false,
      message: 'Error al eliminar las estadísticas, revise los logs del servidor',
    });

    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error al eliminar las estadísticas, revise los logs del servidor',
      );
    });
  });
});
