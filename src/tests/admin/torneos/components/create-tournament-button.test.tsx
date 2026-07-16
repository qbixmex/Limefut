import { render, screen } from '@testing-library/react';
import { CreateTournament } from '@/app/admin/torneos/(components)/create-tournament';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';

describe('Test on <CreateTournament /> component', () => {
  test('Should render correctly', () => {
    render(
      <CreateTournament />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /crear/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(
      <CreateTournament />,
      { wrapper: TooltipProvider },
    );
    const link = screen.getByRole('link', { name: /crear/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    render(
      <CreateTournament />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link', { name: /crear/i });
    expect(link).toHaveAttribute('href', '/admin/torneos/crear');
  });
});
