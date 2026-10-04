import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { EditGallery } from '@/app/admin/galerias/(components)/edit-gallery';
import { ROUTES } from '@/shared/constants/routes';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Test on <EditGallery /> component', () => {
  const renderComponent = () => {
    render(<EditGallery galleryId={galleryId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /editar galería/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render a link to the edit route', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_GALLERIES_EDIT(galleryId));
  });

  test('Should show a tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/editar/i);
  });
});
