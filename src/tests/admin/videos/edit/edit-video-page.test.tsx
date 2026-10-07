import { render, screen } from '@testing-library/react';
import EditVideoPage from '@/app/admin/videos/editar/[id]/page';

vi.mock('@/app/admin/videos/editar/[id]/edit-video-view', () => ({
  EditVideoView: () => <div data-testid="edit-video-view" />,
}));

describe('Test on <EditVideoPage />', () => {
  const testId = '199a1f07-6ed9-4171-b8f4-6bc30298fbb9';

  test('Should render <EditVideoPage /> correctly', () => {
    render(<EditVideoPage params={Promise.resolve({ id: testId })} />);

    const title = screen.getByText(/editar video/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <EditVideoView /> component', () => {
    render(<EditVideoPage params={Promise.resolve({ id: testId })} />);

    const editVideoView = screen.getByTestId('edit-video-view');

    expect(editVideoView).toBeInTheDocument();
  });
});
