import MessagePage from '@/app/admin/mensajes/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/mensajes/[id]/contact-message-view', () => ({
  ContactMessageView: () => <span>Contact Message Details</span>,
}));

describe('Test on <MessagePage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await MessagePage({
      params: Promise.resolve({
        id: '63f33c81-ad1a-47ef-b29b-9da4d2b97030',
      }),
    });
    render(ServerComponent);

    const cardTitle = screen.getByText('Detalles del Mensaje');

    expect(cardTitle).toBeInTheDocument();
  });

  test('Should render <ContactMessageView /> component', async () => {
    const ServerComponent = await MessagePage({
      params: Promise.resolve({
        id: 'd8fc2d6f-08ff-4140-b7a7-234cff70b094',
      }),
    });
    render(ServerComponent);

    const contactMessageDetails = screen.getByText('Contact Message Details');

    expect(contactMessageDetails).toBeInTheDocument();
  });
});
