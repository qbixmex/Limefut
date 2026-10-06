import { render, screen } from '@testing-library/react';
import CreateAnnouncementPage from '@/app/admin/noticias/crear/page';

vi.mock('@/app/admin/noticias/crear/create-announcement.form', () => ({
  CreateAnnouncementForm: () => <div data-testid="create-announcement-form" />,
}));

describe('Test on <CreateAnnouncementPage />', () => {
  test('Should render the page title', () => {
    render(<CreateAnnouncementPage />);

    const title = screen.getByRole('heading', { name: /crear noticia/i });

    expect(title).toBeInTheDocument();
  });

  test('Should render <CreateAnnouncementForm /> component', () => {
    render(<CreateAnnouncementPage />);

    const form = screen.getByTestId('create-announcement-form');

    expect(form).toBeInTheDocument();
  });
});
