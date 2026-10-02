import { render, screen, waitFor } from '@testing-library/react';
import { ShowTournamentDetails } from '@/app/admin/torneos/(components)/show-tournament-details';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

const tournamentId = '105756f4-2c81-4a43-88c4-f804358cfa9a';

describe('Test on <ShowTournamentDetails /> component', () => {
  const renderComponent = () => {
    render(
      <ShowTournamentDetails tournamentId={tournamentId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /detalles/i });

    return { user, link };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent(/detalles/i);
    });
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', `/admin/torneos/${tournamentId}`);
  });
});
