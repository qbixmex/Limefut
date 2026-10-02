import { render, screen } from '@testing-library/react';
import { CreateTournament } from '@/app/admin/torneos/(components)/create-tournament';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';

describe('Test on <CreateTournament /> component', () => {
  const renderComponent = () => {
    render(
      <CreateTournament />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /crear torneo/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', '/admin/torneos/crear');
  });
});
