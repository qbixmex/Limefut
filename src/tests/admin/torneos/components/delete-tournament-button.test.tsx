import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteTournament } from '@/app/admin/torneos/(components)/delete-tournament';
import { useDeleteTournament } from '@/app/admin/torneos/(components)/delete-tournament/use-delete-tournament';
vi.mock('@/app/admin/torneos/(components)/delete-tournament/use-delete-tournament');

describe('Test on <DeleteTournament /> component', () => {
  test('Should render correctly', () => {
    vi.mocked(useDeleteTournament).mockReturnValue({ onDeleteTournament: vi.fn() });
    const tournamentId = '01aa10d4-aeab-4fe5-b5c3-dd46d1ac58fb';
    render(
      <DeleteTournament
        tournamentId={tournamentId}
        userId="user-1"
        roles={[]}
      />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /basurero/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should call onDeleteTournament function', async () => {
    const mockOnDelete = vi.fn();
    vi.mocked(useDeleteTournament).mockReturnValue({ onDeleteTournament: mockOnDelete });
    const tournamentId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    const roles = ['user', 'admin'];

    render(
      <DeleteTournament
        tournamentId={tournamentId}
        userId="user-1"
        roles={roles}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  test('Should not call onDeleteTournament when cancel is clicked', async () => {
    const mockOnDelete = vi.fn();
    vi.mocked(useDeleteTournament).mockReturnValue({ onDeleteTournament: mockOnDelete });
    const tournamentId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    const roles = ['user', 'admin'];

    render(
      <DeleteTournament
        tournamentId={tournamentId}
        userId="user-1"
        roles={roles}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
