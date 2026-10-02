import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowDetails } from '@/app/admin/liguilla/(components)/show-details';
import { ROUTES } from '@/shared/constants/routes';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

const renderComponent = () => {
  return render(
    <ShowDetails playoffId={playoffId} />,
    { wrapper: TooltipProvider },
  );
};

describe('Test on <ShowDetails /> component', () => {
  test('Should render a link to the playoff details', () => {
    renderComponent();

    const link = screen.getByRole('link', { name: /información/ });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_PLAYOFFS_SHOW(playoffId));
  });

  test('Should show tooltip on mouse over', async () => {
    renderComponent();

    const triggerButton = screen.getByRole('button');
    const user = userEvent.setup();
    await user.hover(triggerButton);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(/detalles/i);
  });
});
