import BannerPage from '@/app/admin/banners/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/banners/[id]/banner-view', () => ({
  BannerView: () => <span>Banner Details</span>,
}));

describe('Test on <BannerPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await BannerPage({
      params: Promise.resolve({
        id: '2af6d545-34d5-4232-aef6-b19baa24dd8e',
      }),
    });
    render(ServerComponent);

    const cardHeading = screen.getByRole('heading', { name: /título/i });

    expect(cardHeading).toHaveTextContent(/ajustes del banner/i);
  });

  test('Should render <BannerView /> component', async () => {
    const ServerComponent = await BannerPage({
      params: Promise.resolve({
        id: '550e8400-e29b-41d4-a716-446655440001',
      }),
    });
    render(ServerComponent);

    const details = screen.getByText('Banner Details');

    expect(details).toBeInTheDocument();
  });
});
