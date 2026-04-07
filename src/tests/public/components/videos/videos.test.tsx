import { render, screen } from '@testing-library/react';
import { fetchPublicVideosAction } from '@/app/(public)/(actions)/home/fetchPublicVideosAction';
import { Videos } from '@/app/(public)/components/videos';
import { videos } from '@/tests/mocks/videos';
import { ROUTES } from '@/shared/constants/routes';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

vi.mock('@/app/(public)/(actions)/home/fetchPublicVideosAction');
vi.mock('@/app/(public)/components/embedded-video', () => ({
  EmbeddedVideo: () => null,
}));

describe('Test on <Videos /> component', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchPublicVideosAction).mockResolvedValue({
      ok: true,
      message: 'Videos fetched successfully',
      videos: [],
    });
    const ServerComponent = await Videos();
    render(ServerComponent);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /videos/i,
    });

    expect(heading).toBeInTheDocument();
  });

  test('Should render empty message if there are no videos', async () => {
    vi.mocked(fetchPublicVideosAction).mockResolvedValue({
      ok: true,
      message: 'Videos fetched successfully',
      videos: [],
    });
    const ServerComponent = await Videos();
    render(ServerComponent);

    const emptyMessage = screen.getByRole('region');
    const articles = screen.queryAllByRole('articles', {
      name: /video/i,
    });

    expect(emptyMessage).toHaveTextContent(/no hay videos/i);
    expect(articles).toHaveLength(0);
  });

  test('Should render videos', async () => {
    vi.mocked(fetchPublicVideosAction).mockResolvedValue({
      ok: true,
      message: 'Videos fetched successfully',
      videos,
    });
    const ServerComponent = await Videos();
    render(ServerComponent);

    const articles = screen.getAllByRole('article', {
      name: /video/i,
    });

    expect(articles).toHaveLength(2);
  });

  test('Should show video title', async () => {
    vi.mocked(fetchPublicVideosAction).mockResolvedValue({
      ok: true,
      message: 'Videos fetched successfully',
      videos,
    });
    const ServerComponent = await Videos();
    render(ServerComponent);

    videos.forEach((video) => {
      const heading = screen.getByRole('heading', {
        level: 3,
        name: video.title,
      });

      expect(heading).toBeInTheDocument();
    });
  });

  test('Should show video link', async () => {
    vi.mocked(fetchPublicVideosAction).mockResolvedValue({
      ok: true,
      message: 'Videos fetched successfully',
      videos,
    });
    const ServerComponent = await Videos();
    render(ServerComponent);

    const links = screen.getAllByTitle(/ver video/i);

    links.forEach((link, index) => {
      expect(link).toHaveAttribute(
        'href',
        ROUTES.PUBLIC_VIDEOS_SHOW(videos[index].permalink),
      );
    });
  });

  test('Should show published date', async () => {
    vi.mocked(fetchPublicVideosAction).mockResolvedValue({
      ok: true,
      message: 'Videos fetched successfully',
      videos,
    });
    const ServerComponent = await Videos();
    render(ServerComponent);

    const dates = screen.getAllByRole('contentinfo');

    dates.forEach((date, index) => {
      expect(date).toHaveTextContent(
        formatInTimeZone(
          videos[index].publishedDate,
          'America/Mexico_City',
          "d 'de' MMMM 'del' yyyy",
          { locale: es },
        ),
      );
    });
  });
});
