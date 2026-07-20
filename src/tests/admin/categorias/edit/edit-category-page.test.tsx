import { render, screen } from '@testing-library/react';
import EditCategoryPage from '@/app/admin/categorias/editar/[id]/page';

vi.mock('@/app/admin/categorias/editar/[id]/edit-category-view', () => ({
  EditCategoryView: () => <div data-testid="edit-category-view" />,
}));

describe('Test on <EditCategoryPage />', () => {
  test('Should render correctly', () => {
    render(<EditCategoryPage params={Promise.resolve({ id: 'test-id' })} />);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/editar/i);
  });

  test('Should render <EditCategoryView /> component', () => {
    render(<EditCategoryPage params={Promise.resolve({ id: 'test-id' })} />);

    expect(screen.getByTestId('edit-category-view')).toBeInTheDocument();
  });
});
