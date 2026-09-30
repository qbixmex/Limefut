const { mockRecalculateStandingsAction } = vi.hoisted(() => ({
  mockRecalculateStandingsAction: vi.fn(),
}));

vi.mock('@/app/admin/estadisticas/(actions)/recalculate-standings.action', () => ({
  recalculateStandingsAction: (params: unknown) => mockRecalculateStandingsAction(params),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UpdateStandings } from '@/app/admin/estadisticas/(components)/update-standings';
import {
  CATEGORY_ID,
  TOURNAMENT_ID,
} from '../mocks/standings.mock';

describe('Tests on <UpdateStandings /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRecalculateStandingsAction.mockResolvedValue({
      ok: true,
      message: 'Las estadísticas se recalcularon correctamente',
    });
  });

  const renderComponent = () => {
    render(
      <TooltipProvider>
        <UpdateStandings
          tournamentId={TOURNAMENT_ID}
          categoryId={CATEGORY_ID}
        />,
      </TooltipProvider>,
    );

    const updateButton = () => screen.getByRole('button');
    const confirmButton = () => {
      return screen.getByRole('button', { name: /actualizar/i });
    };
    const cancelButton = () => {
      return screen.getByRole('button', { name: /cancelar/i });
    };

    return {
      user: userEvent.setup(),
      updateButton,
      confirmButton,
      cancelButton,
    };
  };

  test('Should render the update button', () => {
    const { updateButton } = renderComponent();

    expect(updateButton()).toBeInTheDocument();
  });

  test('Should recalculate the standings of the tournament and category on confirm', async () => {
    const { user, updateButton, confirmButton } = renderComponent();

    await user.click(updateButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockRecalculateStandingsAction).toHaveBeenCalledWith({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });
    });
  });

  test('Should not recalculate the standings when cancel is clicked', async () => {
    const { user, updateButton, cancelButton } = renderComponent();

    await user.click(updateButton());
    await user.click(cancelButton());

    expect(mockRecalculateStandingsAction).not.toHaveBeenCalled();
  });

  test('Should show a success toast when the standings are recalculated', async () => {
    const { toast } = await import('sonner');

    const { user, updateButton, confirmButton } = renderComponent();

    await user.click(updateButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Las estadísticas se recalcularon correctamente',
      );
    });
  });

  test('Should show an error toast when recalculation fails', async () => {
    const { toast } = await import('sonner');
    mockRecalculateStandingsAction.mockResolvedValue({
      ok: false,
      message: 'Error al recalcular las estadísticas',
    });

    const { user, updateButton, confirmButton } = renderComponent();

    await user.click(updateButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error al recalcular las estadísticas',
      );
    });
  });
});
