import { render, screen } from '@testing-library/react';
import EditCategoryPage from '@/app/admin/categorias/editar/[id]/page';
import { EditCategoryView } from '@/app/admin/categorias/editar/[id]/edit-category-view';

vi.mock('@/app/admin/categorias/editar/[id]/edit-category-view', () => ({
  EditCategoryView: () => <div data-testid="edit-category-view" />,
}));

describe('Test on <EditCategoryPage />', () => {
  const testId = '27d54ff2-9770-487f-9f9c-f920a8e3c4f0';

  test('Should render correctly', () => {
    render(<EditCategoryPage params={Promise.resolve({ id: testId })} />);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/editar/i);
  });

  test('Should render <EditCategoryView /> component', async () => {
    const ServerComponent = await EditCategoryView({
      params: Promise.resolve({ id: testId }),
    });

    render(ServerComponent);

    expect(screen.getByTestId('edit-category-view')).toBeInTheDocument();
  });
});
