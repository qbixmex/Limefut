import { render, screen } from '@testing-library/react';
import CreateVideoPage from '@/app/admin/videos/crear/page';

vi.mock('@/app/admin/videos/crear/create-video-form', () => ({
  CreateVideoForm: () => <div data-testid="create-video-form" />,
}));

describe('Test on <CreateVideoPage />', () => {
  test('Should render the page title', () => {
    render(<CreateVideoPage />);

    const title = screen.getByText(/crear video/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <CreateVideoForm /> component', () => {
    render(<CreateVideoPage />);

    const form = screen.getByTestId('create-video-form');

    expect(form).toBeInTheDocument();
  });
});
