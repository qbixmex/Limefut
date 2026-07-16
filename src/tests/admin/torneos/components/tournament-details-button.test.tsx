import { render, screen, waitFor } from '@testing-library/react';
import { ShowTournamentDetails } from '@/app/admin/torneos/(components)/show-tournament-details';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

describe('Test on <ShowTournamentDetails /> component', () => {
  test('Should render correctly', () => {
    render(
      <ShowTournamentDetails
        tournamentId="105756f4-2c81-4a43-88c4-f804358cfa9a"
      />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /detalles/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(
      <ShowTournamentDetails
        tournamentId="105756f4-2c81-4a43-88c4-f804358cfa9a"
      />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link', { name: /detalles/i });
    const user = userEvent.setup();
    await user.hover(link);

    await waitFor(() => {
      const toolTip = screen.getByRole('tooltip');
      expect(toolTip).toHaveTextContent(/detalles/i);
    });
  });

  test('Should have a link with provided url', () => {
    const tournamentId = '105756f4-2c81-4a43-88c4-f804358cfa9a';

    render(
      <ShowTournamentDetails
        tournamentId={tournamentId}
      />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link', { name: /detalles/i });
    expect(link).toHaveAttribute('href', `/admin/torneos/${tournamentId}`);
  });
});
