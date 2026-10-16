import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { PlayerDetails } from '@/app/admin/jugadores/(components)/player-details';
import { ROUTES } from '@/shared/constants/routes';

const playerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <PlayerDetails /> component', () => {
  const renderComponent = () => {
    render(
      <PlayerDetails playerId={playerId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = screen.getByRole('link', {
      name: /ir a ver detalles/i,
    });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', ROUTES.ADMIN_PLAYER(playerId));
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);
    expect(toolTip()).toHaveTextContent(/detalles/i);
  });
});
