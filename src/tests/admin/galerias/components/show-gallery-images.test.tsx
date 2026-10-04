import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { ShowGalleryImages } from '@/app/admin/galerias/(components)/show-gallery-images';
import { ROUTES } from '@/shared/constants/routes';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Test on <ShowGalleryImages /> component', () => {
  const renderComponent = () => {
    render(<ShowGalleryImages galleryId={galleryId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /ver imágenes de la galería/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render a link to the gallery details route', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_GALLERIES_SHOW(galleryId));
  });

  test('Should show a tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/imágenes/i);
  });
});
