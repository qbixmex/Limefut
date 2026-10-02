import { render, screen } from '@testing-library/react';
import { EditTournament } from '@/app/admin/torneos/(components)/edit-tournament';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

const tournamentId = '221c1229-5925-4419-8a9d-8ddd9d63b2c7';

describe('Test on <EditTournament /> component', () => {
  const renderComponent = async (id: string = tournamentId) => {
    const element = await EditTournament({ tournamentId: id });
    render(element, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /editar torneo/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render correctly', async () => {
    const { link } = await renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link, toolTip } = await renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', async () => {
    const { link } = await renderComponent();

    expect(link).toHaveAttribute('href', `/admin/torneos/editar/${tournamentId}`);
  });
});
