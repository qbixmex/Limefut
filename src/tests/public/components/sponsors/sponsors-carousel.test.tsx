import { SponsorCarousel } from '@/app/(public)/components/sponsors/sponsor-carousel';
import { act, render, screen } from '@testing-library/react';
import { sponsors } from '@/tests/mocks/sponsors';
import userEvent from '@testing-library/user-event';
import { incrementClickAction } from '@/app/(public)/(actions)/videos/incrementClickAction';

vi.mock('@/app/(public)/(actions)/videos/incrementClickAction');

describe('Test on <SponsorCarousel /> component', () => {
  test('Should render an image', () => {
    render(<SponsorCarousel sponsors={sponsors} time={1} />);

    const sponsorImage = screen.getByAltText(/patrocinador/i);
    const src = sponsorImage.getAttribute('src') ?? '';
    const parsedUrl = new URL(src, 'http://localhost');
    const originalUrl = parsedUrl.searchParams.get('url');

    expect(sponsorImage).toBeInTheDocument();
    expect(originalUrl).toBe(sponsors[0].imageUrl);
  });

  test('Should render render a figure tag', () => {
    render(<SponsorCarousel sponsors={sponsors} time={1} />);

    const figcaption = screen.getByRole('figure', {
      name: sponsors[0].name,
    });

    expect(figcaption).toBeInTheDocument();
  });

  test('Should render the second image', () => {
    vi.useFakeTimers();
    render(<SponsorCarousel sponsors={sponsors} time={1} />);

    act(() => vi.advanceTimersByTime(1000));

    expect(
      screen.getByRole('figure', { name: sponsors[1].name }),
    ).toBeInTheDocument();

    const sponsorImage = screen.getByAltText(/patrocinador/i);
    const src = sponsorImage.getAttribute('src') ?? '';
    const parsedUrl = new URL(src, 'http://localhost');
    const originalUrl = parsedUrl.searchParams.get('url');

    expect(sponsorImage).toBeInTheDocument();
    expect(originalUrl).toBe(sponsors[1].imageUrl);

    vi.clearAllTimers();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  test('Should not render the component if sponsors array is empty', () => {
    render(<SponsorCarousel sponsors={[]} time={1} />);

    const figcaption = screen.queryByRole('figure', {
      name: sponsors[0].name,
    });

    expect(figcaption).not.toBeInTheDocument();
  });

  test('Should send click to server action', async () => {
    const { container } = render(
      <SponsorCarousel
        sponsors={sponsors}
        time={1}
      />,
    );
    const button = container.querySelector('#sponsor-button') as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(button);

    expect(incrementClickAction).toHaveBeenCalledWith(sponsors[0].id);
  });
});
