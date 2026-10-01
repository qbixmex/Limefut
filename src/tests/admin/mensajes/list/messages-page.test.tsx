import MessagesPage from '@/app/admin/mensajes/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/mensajes/messages-view', () => ({
  MessagesView: () => <div data-testid="messages-view" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on mensajes page', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await MessagesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);
  });

  test('Should render <MessagesView /> component', async () => {
    const ServerComponent = await MessagesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const messagesView = screen.getByTestId('messages-view');

    expect(messagesView).toBeInTheDocument();
  });
});
