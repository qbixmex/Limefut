import { render, screen } from '@testing-library/react';
import { EditCategory } from '@/app/admin/categorias/(components)/edit-category';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

const categoryId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <EditCategory /> component', () => {
  const renderComponent = () => {
    render(
      <EditCategory categoryId={categoryId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /editar categoría/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', `/admin/categorias/editar/${categoryId}`);
  });
});
