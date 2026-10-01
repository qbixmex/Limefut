const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/mensajes/(actions)/fetchMessageAction', () => ({
  fetchMessageAction: vi.fn(),
}));

vi.mock('@/app/admin/mensajes/(actions)/updateMessageStatusAction', () => ({
  updateMessageStatusAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

import { ContactMessageView } from '@/app/admin/mensajes/[id]/contact-message-view';
import { render, screen } from '@testing-library/react';
import { messageMock } from '../mocks/message.mock';
import { fetchMessageAction } from '@/app/admin/mensajes/(actions)/fetchMessageAction';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ROUTES } from '@/shared/constants/routes';

describe('Tests on ContactMessageView', () => {
  const defaultResponse = {
    ok: true,
    message: '¡ Mensaje obtenido correctamente 👍 !',
    contactMessage: messageMock,
  };

  const renderComponent = async () => {
    vi.mocked(fetchMessageAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await ContactMessageView({
      params: Promise.resolve({ id: messageMock.id as string }),
    });
    return render(ServerComponent);
  };

  test('Should render table correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /detalles/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render message name', async () => {
    await renderComponent();

    const contactMessageName = screen.getByText(messageMock.name);

    expect(contactMessageName).toBeInTheDocument();
  });

  test('Should render message email', async () => {
    await renderComponent();

    const contactMessageEmail = screen.getByText(messageMock.email);

    expect(contactMessageEmail).toBeInTheDocument();
  });

  test('Should render message text', async () => {
    await renderComponent();

    const contactMessageText = screen.getByText(messageMock.message);

    expect(contactMessageText).toBeInTheDocument();
  });

  test('Should render formatted date', async () => {
    await renderComponent();

    const expectedDate = format(
      new Date(messageMock.createdAt as Date),
      "EEEE dd 'de' MMMM, yyyy",
      { locale: es },
    );

    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  test('Should render read status', async () => {
    await renderComponent();

    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('Should render active switch', async () => {
    await renderComponent();

    const activeSwitch = screen.getByTestId('active-switch');

    expect(activeSwitch).toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchMessageAction).mockResolvedValue({
      ok: false,
      message: 'Mensaje no encontrado',
      contactMessage: null,
    });

    await expect(async () => {
      await ContactMessageView({
        params: Promise.resolve({ id: messageMock.id as string }),
      });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MESSAGES}?error=${encodeURIComponent('Mensaje no encontrado')}`,
    );
  });
});
