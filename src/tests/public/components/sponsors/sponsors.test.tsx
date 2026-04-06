import { render, screen } from '@testing-library/react';
import { Sponsors } from '@/app/(public)/components/sponsors';
import { fetchPublicSponsorsAction } from '@/app/(public)/(actions)/home/fetchPublicSponsorsAction';
import { sponsors } from '@/tests/mocks/sponsors';

vi.mock('@/app/(public)/(actions)/home/fetchPublicSponsorsAction');

describe('Test on <Sponsor /> component', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchPublicSponsorsAction).mockResolvedValue({
      ok: true,
      message: 'Sponsors fetched correctly',
      sponsors,
    });

    const ServerComponent = await Sponsors();

    render(ServerComponent);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: /patrocinadores/i,
    });

    expect(heading).toBeInTheDocument();
  });

  test('Should not render content if return empty sponsors array', async () => {
    vi.mocked(fetchPublicSponsorsAction).mockResolvedValue({
      ok: true,
      message: 'Sponsors fetched correctly',
      sponsors: [],
    });

    const ServerComponent = await Sponsors();

    render(ServerComponent);

    const heading = screen.queryByRole('heading', {
      level: 2,
      name: /patrocinadores/i,
    });

    expect(heading).not.toBeInTheDocument();
  });

  test('Should not render content if return an error', async () => {
    vi.mocked(fetchPublicSponsorsAction).mockResolvedValue({
      ok: false,
      message: 'Unknown server error',
      sponsors: [],
    });

    const ServerComponent = await Sponsors();

    render(ServerComponent);

    const heading = screen.queryByRole('heading', {
      level: 2,
      name: /patrocinadores/i,
    });

    expect(heading).not.toBeInTheDocument();
  });
});
