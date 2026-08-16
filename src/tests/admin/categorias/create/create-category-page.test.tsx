import { render, screen } from '@testing-library/react';
import CreateCategoryPage from '@/app/admin/categorias/crear/page';

vi.mock('@/app/admin/categorias/(components)/create-category-form', () => ({
  CreateCategoryForm: () => <div data-testid="create-category-form" />,
}));

describe('Test on <CreateCategoryPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await CreateCategoryPage();
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/crear/i);
  });

  test('Should render <CreateCategoryForm /> component', async () => {
    const ServerComponent = await CreateCategoryPage();
    render(ServerComponent);

    expect(screen.getByTestId('create-category-form')).toBeInTheDocument();
  });
});
