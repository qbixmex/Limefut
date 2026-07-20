import { render, screen } from '@testing-library/react';
import CreateCategoryPage from '@/app/admin/categorias/crear/page';

vi.mock('@/app/admin/categorias/crear/create-category-view', () => ({
  CreateCategoryView: () => <div data-testid="create-category-view" />,
}));

describe('Test on <CreateCategoryPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await CreateCategoryPage();
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/crear/i);
  });

  test('Should render <CreateCategoryView /> component', async () => {
    const ServerComponent = await CreateCategoryPage();
    render(ServerComponent);

    expect(screen.getByTestId('create-category-view')).toBeInTheDocument();
  });
});
