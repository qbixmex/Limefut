import CanchasPage from '@/app/admin/canchas/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/canchas/(components)/create-field', () => ({
  CreateField: () => <div data-testid="create-field" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/canchas/(components)/fields-view', () => ({
  FieldsView: () => <div data-testid="fields-view" />,
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on canchas page', () => {
  test('Should render heading', async () => {
    const ServerComponent = await CanchasPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/canchas/i);
  });

  test('Should render <Search /> and <CreateField /> components', async () => {
    const ServerComponent = await CanchasPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('create-field')).toBeInTheDocument();
  });

  test('Should render <FieldsView /> component', async () => {
    const ServerComponent = await CanchasPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const fieldsView = screen.getByTestId('fields-view');

    expect(fieldsView).toBeInTheDocument();
  });
});
