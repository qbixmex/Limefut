import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { CreateBanner } from '@/app/admin/banners/(components)/create-banner';

describe('Test on <CreateBanner /> component', () => {
  test('Should render correctly', () => {
    render(<CreateBanner />, { wrapper: TooltipProvider });
    const icon = screen.getByRole('img', { name: /icono de crear/i });
    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<CreateBanner />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear banner/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    render(<CreateBanner />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear banner/i });
    expect(link).toHaveAttribute('href', '/admin/banners/crear');
  });
});
