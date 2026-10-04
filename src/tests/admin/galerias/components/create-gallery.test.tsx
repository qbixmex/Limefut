import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { CreateGallery } from '@/app/admin/galerias/(components)/create-gallery';
import { ROUTES } from '@/shared/constants/routes';

describe('Test on <CreateGallery /> component', () => {
  const renderComponent = () => {
    render(<CreateGallery />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /crear galería/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render a link to the create route', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_GALLERIES_CREATE);
  });

  test('Should show a tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    await waitFor(() => {
      expect(toolTip()).toHaveTextContent(/crear/i);
    });
  });
});
