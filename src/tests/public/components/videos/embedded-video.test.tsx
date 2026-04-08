import { EmbeddedVideo } from '@/app/(public)/components/embedded-video';
import { PLATFORM } from '@/shared/constants/platforms';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { fetchThumbnail } from '@/app/(public)/components/embedded-video/(actions)/fetch-thumbnail';

vi.mock('@/app/(public)/components/embedded-video/(actions)/fetch-thumbnail');

describe('Test on <EmbeddedVideo /> component', () => {
  test('Should render youtube thumbnail', () => {
    const videoId = 'Zi6Ox5WDtGs';
    const url = `https://youtu.be/${videoId}?si=4LkveOuqC9jlH8iv`;
    const title = 'Resumen de la jornada';
    render(
      <EmbeddedVideo
        url={url}
        title={title}
        platform={PLATFORM.YOUTUBE}
        className=""
      />,
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    expect(image).toHaveAttribute('alt', title);
  });

  test('Should render a loader', async () => {
    const resolvedURL = 'https://scontent.fgdl5-2.fna.fbcdn.net/v/t15.5256-10/3365345368_n.jpg';
    vi.mocked(fetchThumbnail).mockResolvedValue({ thumbnailUrl: resolvedURL });
    const url = 'https://www.facebook.com/share/r/1Ce8pKqkj9/';
    const title = 'Festejando el título';
    render(
      <EmbeddedVideo
        url={url}
        title={title}
        platform={PLATFORM.FACEBOOK}
        className=""
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  test('Should render no thumbnail block', async () => {
    vi.mocked(fetchThumbnail).mockRejectedValue({
      message: 'Error trying loading the thumbnail',
    });
    const url = 'https://www.facebook.com/share/r/1Ce8pKqkj9/';
    const title = 'Festejando el título';
    render(
      <EmbeddedVideo
        url={url}
        title={title}
        platform={PLATFORM.FACEBOOK}
        className=""
      />,
    );

    const placeholderBlock = await screen.findByRole('status', {
      name: /no se pudo cargar la miniatura/i,
    });
    expect(placeholderBlock).toBeInTheDocument();
  });

  test('Should render facebook thumbnail', async () => {
    const resolvedURL = 'https://scontent.fgdl5-2.fna.fbcdn.net/v/t15.5256-10/3365345368_n.jpg';
    vi.mocked(fetchThumbnail).mockResolvedValue({ thumbnailUrl: resolvedURL });

    const url = 'https://www.facebook.com/share/r/1Ce8pKqkj9/';
    const title = 'Festejando el título';
    render(
      <EmbeddedVideo
        url={url}
        title={title}
        platform={PLATFORM.FACEBOOK}
        className=""
      />,
    );

    await waitForElementToBeRemoved(() => {
      return screen.getByRole('status');
    });

    const thumbnailImage = screen.getByRole('img');

    expect(fetchThumbnail).toHaveBeenCalledWith(url);
    expect(thumbnailImage).toBeInTheDocument();

    const sponsorImage = screen.getByAltText(/festejando/i);
    const src = sponsorImage.getAttribute('src') ?? '';
    const parsedUrl = new URL(src, 'http://localhost');
    const originalUrl = parsedUrl.searchParams.get('url');
    expect(originalUrl).toBe(resolvedURL);
  });

  test('Should not render content if no platform was found', () => {
    render(
      <EmbeddedVideo
        url="http://localhost"
        title="Lorem ipsum"
        platform=""
        className=""
      />,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
