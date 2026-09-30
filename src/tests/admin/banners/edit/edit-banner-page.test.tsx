import { render, screen } from '@testing-library/react';
import EditBannerPage from '@/app/admin/banners/editar/[id]/page';

vi.mock('@/app/admin/banners/editar/[id]/edit-banner-view', () => ({
  EditBannerPageView: () => <div data-testid="edit-banner-view" />,
}));

describe('Test on <EditBannerPage />', () => {
  const testId = '550e8400-e29b-41d4-a716-446655440001';

  test('Should render <EditBannerPageView /> component', () => {
    render(
      <EditBannerPage
        params={Promise.resolve({ id: testId })}
      />,
    );

    const editBannerView = screen.getByTestId('edit-banner-view');

    expect(editBannerView).toBeInTheDocument();
  });
});
