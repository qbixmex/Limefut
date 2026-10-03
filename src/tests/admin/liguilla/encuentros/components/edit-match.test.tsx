import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { EditMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/edit-match';
import { ROUTES } from '@/shared/constants/routes';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Test on <EditMatch /> component', () => {
  const renderComponent = () => {
    render(
      <EditMatch
        playoffId={playoffId}
        matchId={matchId}
      />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = () => screen.getByRole('link', {
      name: /ir a editar encuentro/i,
    });

    return { user, link };
  };

  test('Should render a link to the edit route with its icon', () => {
    const { link } = renderComponent();

    expect(link()).toBeInTheDocument();
    expect(link().querySelector('svg')).toBeInTheDocument();
    expect(link()).toHaveAttribute(
      'href',
      ROUTES.ADMIN_PLAYOFFS_MATCHES_EDIT(playoffId, matchId),
    );
  });

  test('Should show the tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link());

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/editar/i);
  });
});
