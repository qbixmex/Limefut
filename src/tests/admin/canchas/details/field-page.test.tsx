import FieldPage from '@/app/admin/canchas/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/canchas/[id]/field-view', () => ({
  FieldView: () => <span>Field Details</span>,
}));

describe('Test on <FieldPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await FieldPage({
      params: Promise.resolve({
        id: '550e8400-e29b-41d4-a716-446655440001',
      }),
    });
    render(ServerComponent);

    const cardHeading = screen.getByRole('heading', { name: /título/i });

    expect(cardHeading).toHaveTextContent(/cancha/i);
  });

  test('Should render <FieldView /> component', async () => {
    const ServerComponent = await FieldPage({
      params: Promise.resolve({
        id: '550e8400-e29b-41d4-a716-446655440001',
      }),
    });
    render(ServerComponent);

    const details = screen.getByText('Field Details');

    expect(details).toBeInTheDocument();
  });
});
