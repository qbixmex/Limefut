import { render, screen } from '@testing-library/react';
import EditAnnouncementPage from '@/app/admin/noticias/editar/[id]/page';

vi.mock('@/app/admin/noticias/editar/[id]/edit-announcement-view', () => ({
  EditAnnouncementView: () => <div data-testid="edit-announcement-view" />,
}));

describe('Test on <EditAnnouncementPage />', () => {
  const testId = '199a1f07-6ed9-4171-b8f4-6bc30298fbb9';

  test('Should render <EditAnnouncementPage /> correctly', () => {
    render(
      <EditAnnouncementPage
        params={Promise.resolve({ id: testId })}
      />,
    );

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent(/editar noticia/i);
  });

  test('Should render <EditAnnouncementView /> component', () => {
    render(
      <EditAnnouncementPage
        params={Promise.resolve({ id: testId })}
      />,
    );

    const editAnnouncementView = screen.getByTestId('edit-announcement-view');

    expect(editAnnouncementView).toBeInTheDocument();
  });
});
