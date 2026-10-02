import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { CreatePlayoff } from '@/app/admin/liguilla/(components)/create-playoff';
import { ROUTES } from '@/shared/constants/routes';

const renderComponent = () => {
  return render(<CreatePlayoff />, { wrapper: TooltipProvider });
};

describe('Test on <CreatePlayoff /> component', () => {
  test('Should render a link to the create route', () => {
    renderComponent();

    const link = screen.getByRole('link', { name: /crear encuentro/i });
    const createIcon = link.querySelector('svg');

    expect(link).toBeInTheDocument();
    expect(createIcon).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_PLAYOFFS_CREATE);
  });

  test('Should show tooltip on mouse over', async () => {
    renderComponent();

    const trigger = screen.getByRole('button', { name: /crear encuentro/i });
    const user = userEvent.setup();
    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(/crear/i);
  });
});
