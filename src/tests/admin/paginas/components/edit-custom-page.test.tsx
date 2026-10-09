import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { EditCustomPage } from '@/app/admin/paginas/(components)/edit-custom-page';
import { ROUTES } from '@/shared/constants/routes';

describe('Test on <EditCustomPage /> component', () => {
  const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';

  const renderComponent = () => {
    render(<EditCustomPage pageId={pageId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /editar página personalizada/i });

    return { user, link };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', ROUTES.ADMIN_CUSTOM_PAGES_EDIT(pageId));
  });
});
