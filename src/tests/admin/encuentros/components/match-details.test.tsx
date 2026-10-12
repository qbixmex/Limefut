import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { MatchDetails } from '@/app/admin/encuentros/(components)/match-details';
import { ROUTES } from '@/shared/constants/routes';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

describe('Test on <MatchDetails /> component', () => {
  const renderComponent = () => {
    render(
      <MatchDetails matchId={matchId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = () => screen.getByRole('link', { name: /ir a detalles del encuentro/i });

    return { user, link };
  };

  test('Should render a link to the match details with its icon', () => {
    const { link } = renderComponent();

    expect(link()).toBeInTheDocument();
    expect(link().querySelector('svg')).toBeInTheDocument();
    expect(link()).toHaveAttribute('href', ROUTES.ADMIN_MATCHES_SHOW(matchId));
  });

  test('Should show the tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link());

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/detalles/i);
  });
});
