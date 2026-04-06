import { Announcements } from '@/app/(public)/components/announcements';
import { render, screen } from '@testing-library/react';
import { fetchPublicAnnouncementsAction } from '@/app/(public)/(actions)/home/fetchPublicAnnouncements';
import { announcements } from '@/tests/mocks/announcements';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';

vi.mock('@/app/(public)/(actions)/home/fetchPublicAnnouncements');

describe('Test on <Announcements /> component', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements: [],
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /noticias/i,
    });

    expect(heading).toBeInTheDocument();
  });

  test('Should render announcements', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements,
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const articles = screen.getAllByRole('article');

    expect(articles).toHaveLength(2);
  });

  test('Should render announcements titles', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements,
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const headings = screen.getAllByRole('heading', { level: 3 });

    expect(headings).toHaveLength(2);

    headings.forEach((heading, index) => {
      expect(heading).toHaveTextContent(announcements[index].title);
    });
  });

  test('Should render an announcements date', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements,
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const dates = screen.getAllByRole('contentinfo');

    expect(dates).toHaveLength(2);

    dates.forEach((date, index) => {
      const formattedDate = formatInTimeZone(announcements[index].publishedDate, 'America/Mexico_City', "d 'de' MMMM 'del' yyyy", { locale: es });
      expect(date).toHaveTextContent(formattedDate);
    });
  });

  test('Should render an announcement description', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements,
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const descriptions = screen.getAllByRole('region');

    expect(descriptions).toHaveLength(2);

    descriptions.forEach((description, index) => {
      expect(description).toHaveTextContent(announcements[index].description);
    });
  });

  test('Should render show more links', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements,
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const links = screen.getAllByLabelText(/ver más/i);

    expect(links).toHaveLength(2);

    links.forEach((link, index) => {
      expect(link).toHaveTextContent(/ver más/i);
      expect(link).toHaveAttribute(
        'href',
        ROUTES.PUBLIC_ANNOUNCEMENTS_SHOW(announcements[index].permalink),
      );
    });
  });

  test('Should render empty message', async () => {
    vi.mocked(fetchPublicAnnouncementsAction).mockResolvedValue({
      ok: true,
      message: 'Announcements fetched successfully',
      announcements: [],
    });
    const ServerComponent = await Announcements();
    render(ServerComponent);

    const emptyMessage = screen.getByText(/no hay noticias/i);
    const articles = screen.queryAllByLabelText(/anuncio/i);

    expect(emptyMessage).toBeInTheDocument();
    expect(articles).toHaveLength(0);
  });
});
