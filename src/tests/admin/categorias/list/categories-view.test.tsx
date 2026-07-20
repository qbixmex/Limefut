import { use, act } from 'react';
import { CategoriesView } from '@/app/admin/categorias/categories-view';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/categorias/(components)/categories-table', () => {
  return {
    CategoriesTable: () => {
      if (shouldSuspend.value) {
        use(new Promise(() => {}));
      }
      return <div data-testid="categories-table" />;
    },
  };
});

type SearchParams = { query?: string; page?: string; };

describe('Tests on categories page', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render correctly', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await CategoriesView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('categories-table')).toBeInTheDocument();
  });

  test('Should render categories skeleton while fetching categories', async () => {
    const ServerComponent = await CategoriesView({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    expect(screen.getByTestId('categories-table-skeleton')).toBeInTheDocument();
  });
});
