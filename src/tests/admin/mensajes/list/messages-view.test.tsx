import { MessagesView } from '@/app/admin/mensajes/messages-view';
import { render, screen } from '@testing-library/react';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/mensajes/(components)/messages-table-skeleton', () => ({
  MessagesTableSkeleton: () => <div data-testid="messages-table-skeleton" />,
}));

vi.mock('@/app/admin/mensajes/(components)/messages-table', () => ({
  MessagesTable: () => <div data-testid="messages-table" />,
}));

type SearchParams = { query?: string; page?: string };

const renderComponent = async (searchParams: SearchParams = {}) => {
  const ServerComponent = await MessagesView({
    searchParams: Promise.resolve<SearchParams>(searchParams),
  });
  return render(ServerComponent);
};

describe('Tests on MessagesView', () => {
  test('Should render heading', async () => {
    await renderComponent();

    const title = screen.getByText('Mensajes');

    expect(title).toBeInTheDocument();
  });

  test('Should render <Search /> component', async () => {
    await renderComponent();

    const searchComponent = screen.getByTestId('search-component');

    expect(searchComponent).toBeInTheDocument();
  });

  test('Should render <MessagesTable /> component', async () => {
    await renderComponent();

    const messagesTableComponent = screen.getByTestId('messages-table');

    expect(messagesTableComponent).toBeInTheDocument();
  });

  test('Should render <MessagesTable /> with provided search params', async () => {
    await renderComponent({ query: 'juan', page: '2' });

    const messagesTableComponent = screen.getByTestId('messages-table');

    expect(messagesTableComponent).toBeInTheDocument();
  });
});
