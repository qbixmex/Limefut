import { render, screen } from '@testing-library/react';
import { MessagesTable } from '@/app/admin/mensajes/(components)/messages-table';
import { fetchMessagesAction } from '@/app/admin/mensajes/(actions)/fetchMessagesAction';
import { messagesMock } from '../mocks/messages.mock';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/mensajes/(actions)/fetchMessagesAction');
vi.mock('@/app/admin/mensajes/(actions)/updateMessageStatusAction');

vi.mock('@/app/admin/mensajes/(components)/delete-message', () => ({
  DeleteMessage: () => <span data-testid="delete-message" />,
}));

vi.mock('@/app/admin/mensajes/(components)/message-details', () => ({
  MessageDetails: () => <span data-testid="message-details" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
  default: () => <span data-testid="pagination" />,
}));

describe('Test on <MessagesTable /> component', () => {
  const defaultResponse = {
    ok: true,
    message: 'Los mensajes fueron obtenidos correctamente',
    messages: messagesMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async () => {
    const ServerComponent = await MessagesTable({ query: '', currentPage: '' });
    return render(ServerComponent);
  };

  beforeEach(() => {
    vi.mocked(fetchMessagesAction).mockResolvedValue(defaultResponse);
  });

  test('Should render correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /mensajes/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render empty state when there are no messages', async () => {
    vi.mocked(fetchMessagesAction).mockResolvedValue({
      ...defaultResponse,
      messages: [],
    });

    await renderComponent();

    const emptyMessageComponent = screen.getByText('No hay mensajes en la bandeja');
    const table = screen.queryByRole('table');

    expect(emptyMessageComponent).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render empty state when fetch fails', async () => {
    vi.mocked(fetchMessagesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los mensajes',
      messages: null,
      pagination: null,
    });

    await renderComponent();

    const emptyMessageComponent = screen.getByText('No hay mensajes en la bandeja');
    const table = screen.queryByRole('table');

    expect(emptyMessageComponent).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render message name', async () => {
    await renderComponent();

    messagesMock.forEach((message) => {
      const contactMessageName = screen.getByText(message.name);
      expect(contactMessageName).toBeInTheDocument();
    });
  });

  test('Should render message email', async () => {
    await renderComponent();

    messagesMock.forEach((message) => {
      const contactMessageEmail = screen.getByText(message.email);
      expect(contactMessageEmail).toBeInTheDocument();
    });
  });

  test('Should truncate long messages and keep short ones intact', async () => {
    await renderComponent();

    messagesMock.forEach((message) => {
      const expectedMessage = message.message.length >= 50
        ? message.message.substring(0, 50) + ' ...'
        : message.message;

      const contactMessageText = screen.getByText(expectedMessage);

      expect(contactMessageText).toBeInTheDocument();
    });
  });

  test('Should render formatted date', async () => {
    await renderComponent();

    messagesMock.forEach((message) => {
      const expectedDate = format(
        new Date(message.createdAt as Date),
        "EEEE dd 'de' MMMM, yyyy",
        { locale: es },
      );

      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });
  });

  test('Should render read status per message', async () => {
    await renderComponent();

    const readMessages = messagesMock.filter((message) => message.read);
    const unreadMessages = messagesMock.filter((message) => !message.read);

    expect(screen.getAllByText('Si')).toHaveLength(readMessages.length);
    expect(screen.getAllByText('No')).toHaveLength(unreadMessages.length);
  });

  test('Should render action buttons per row', async () => {
    await renderComponent();

    expect(screen.getAllByTestId('message-details')).toHaveLength(messagesMock.length);
    expect(screen.getAllByTestId('delete-message')).toHaveLength(messagesMock.length);
    expect(screen.getAllByTestId('active-switch')).toHaveLength(messagesMock.length);
  });

  test('Should hide pagination when totalPages is 1', async () => {
    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).toHaveClass('hidden');
  });

  test('Should render pagination when totalPages is greater than 1', async () => {
    vi.mocked(fetchMessagesAction).mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).not.toHaveClass('hidden');
  });
});
