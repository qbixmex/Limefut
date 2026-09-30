import { render, screen } from '@testing-library/react';
import CreateBannerPage from '@/app/admin/banners/crear/page';

vi.mock('@/app/admin/banners/crear/create-banner-form', () => ({
  CreateBannerForm: () => <div data-testid="create-banner-form" />,
}));

describe('Test on <CreateBannerPage />', () => {
  test('Should render title', () => {
    render(<CreateBannerPage />);
    const title = screen.getByRole('heading', { name: /título/i });
    expect(title).toHaveTextContent(/crear banner/i);
  });

  test('Should render <CreateBannerForm /> component', () => {
    render(<CreateBannerPage />);

    const createBannerForm = screen.getByTestId('create-banner-form');

    expect(createBannerForm).toBeInTheDocument();
  });
});
