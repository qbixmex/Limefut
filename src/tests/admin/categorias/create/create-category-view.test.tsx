import { render, screen } from '@testing-library/react';
import { CreateCategoryView } from '@/app/admin/categorias/crear/create-category-view';

vi.mock('@/app/admin/categorias/(components)/create-category-form', () => ({
  CreateCategoryForm: () => <span data-testid="create-category-form" />,
}));

describe('Test on <CreateCategoryView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render correctly', async () => {
    const ServerComponent = await CreateCategoryView();
    render(ServerComponent);
  });

  test('Should render <CreateCategoryForm /> component', async () => {
    const ServerComponent = await CreateCategoryView();
    render(ServerComponent);

    expect(screen.getByTestId('create-category-form')).toBeInTheDocument();
  });
});
