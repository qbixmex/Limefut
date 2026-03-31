import { render, screen } from '@testing-library/react';
import { CustomSponsorsContent } from '@/app/admin/patrocinadores/sponsors-content';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/admin',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('Test on <SponsorsPage /> component', () => {
  test('Should render correctly', async () => {
    const serverComponent = await CustomSponsorsContent({
      searchParams: Promise.resolve({
        query: undefined,
        page: undefined,
        error: undefined,
      }),
    });
    render(serverComponent);

    expect(screen.getByText(/patrocinadores/i)).toBeInTheDocument();
  });
});
