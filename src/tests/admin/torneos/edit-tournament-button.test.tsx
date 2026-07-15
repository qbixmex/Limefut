import { render, screen, waitFor } from '@testing-library/react';
import { EditTournament } from '@/app/admin/torneos/(components)/edit-tournament';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

describe('Test on <EditTournament /> component', () => {
  test('Should render correctly', async () => {
    const tournamentId = '221c1229-5925-4419-8a9d-8ddd9d63b2c7';
    const element = await EditTournament({ paramsPromise: Promise.resolve({ id: tournamentId }) });
    render(element, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /lápiz/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const tournamentId = '347967f4-94a2-4f72-a180-96fd4b6ff09b';
    const element = await EditTournament({ paramsPromise: Promise.resolve({ id: tournamentId }) });
    render(element, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar/i });
    const user = userEvent.setup();
    await user.hover(link);

    await waitFor(() => {
      const toolTip = screen.getByRole('tooltip');
      expect(toolTip).toHaveTextContent(/editar/i);
    });
  });

  test('Should have a link with provided url', async () => {
    const tournamentId = '2792cf38-fa85-4c0c-b533-76a5e29bd046';

    const element = await EditTournament({ paramsPromise: Promise.resolve({ id: tournamentId }) });
    render(element, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar/i });
    expect(link).toHaveAttribute('href', `/admin/torneos/editar/${tournamentId}`);
  });
});
