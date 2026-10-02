import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowBanner } from '@/app/admin/banners/(components)/show-banner';

const bannerId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <ShowBanner /> component', () => {
  const renderComponent = () => {
    render(<ShowBanner bannerId={bannerId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /detalles del banner/i });
    const user = userEvent.setup();

    return { link, user };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', `/admin/banners/${bannerId}`);
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/detalles/i);
  });
});
