import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteTournament } from '@/app/admin/torneos/(components)/delete-tournament';
import { useDeleteTournament } from '@/app/admin/torneos/(components)/delete-tournament/use-delete-tournament';
vi.mock('@/app/admin/torneos/(components)/delete-tournament/use-delete-tournament');

const tournamentId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';

describe('Test on <DeleteTournament /> component', () => {
  const renderComponent = () => {
    render(
      <DeleteTournament
        tournamentId={tournamentId}
      />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar torneo/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

    return { user, deleteButton, confirmButton, cancelButton };
  };

  test('Should render correctly', () => {
    vi.mocked(useDeleteTournament).mockReturnValue({ onDeleteTournament: vi.fn() });
    const { deleteButton } = renderComponent();

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call onDeleteTournament function', async () => {
    const mockOnDelete = vi.fn();
    vi.mocked(useDeleteTournament).mockReturnValue({ onDeleteTournament: mockOnDelete });

    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  test('Should not call onDeleteTournament when cancel is clicked', async () => {
    const mockOnDelete = vi.fn();
    vi.mocked(useDeleteTournament).mockReturnValue({ onDeleteTournament: mockOnDelete });

    const { user, deleteButton, cancelButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
