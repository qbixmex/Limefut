import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { CreateBanner } from '@/app/admin/banners/(components)/create-banner';

describe('Test on <CreateBanner /> component', () => {
  const renderComponent = () => {
    render(<CreateBanner />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear banner/i });
    const user = userEvent.setup();

    return { user, link };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();
    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', '/admin/banners/crear');
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link } = renderComponent();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });
});
