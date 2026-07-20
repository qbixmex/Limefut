import { render, screen } from '@testing-library/react';
import { EditCategory } from '@/app/admin/categorias/(components)/edit-category';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

describe('Test on <EditCategory /> component', () => {
  test('Should render correctly', () => {
    const categoryId = '87554630-ca8c-4bab-826c-458ffbd02414';
    render(
      <EditCategory categoryId={categoryId} />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /icono de lápiz/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const categoryId = '87554630-ca8c-4bab-826c-458ffbd02414';
    render(
      <EditCategory categoryId={categoryId} />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link', { name: /editar categoría/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', () => {
    const categoryId = '87554630-ca8c-4bab-826c-458ffbd02414';
    render(
      <EditCategory categoryId={categoryId} />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link', { name: /editar categoría/i });
    expect(link).toHaveAttribute('href', `/admin/categorias/editar/${categoryId}`);
  });
});
