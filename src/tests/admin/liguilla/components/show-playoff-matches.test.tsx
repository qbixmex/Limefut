import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowPlayoffMatches } from '@/app/admin/liguilla/(components)/show-playoff-matches';
import { ROUTES } from '@/shared/constants/routes';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

const renderComponent = () => {
  render(
    <ShowPlayoffMatches playoffId={playoffId} />,
    { wrapper: TooltipProvider },
  );
};

describe('Test on <ShowPlayoffMatches /> component', () => {
  test('Should render a link to the playoff matches', () => {
    renderComponent();

    const link = screen.getByRole('link', { name: /mostrar encuentros/i });
    const icon = link.querySelector('svg');

    expect(link).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));
  });

  test('Should show tooltip on mouse over', async () => {
    renderComponent();

    const trigger = screen.getByRole('button');
    const user = userEvent.setup();

    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(/mostrar encuentros/i);
  });
});
