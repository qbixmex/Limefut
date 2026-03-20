import { render, screen } from '@testing-library/react';
import { FooterLinks } from '@/app/(public)/components/footer/footer-links';
import { fetchPagesAction } from '@/app/(public)/(actions)/footer/fetchPagesAction';

vi.mock('@/app/(public)/(actions)/footer/fetchPagesAction');

describe('Test on <FooterLinks /> component', () => {
  const pages = [
    { id: '1', title: 'About Us', permalink: 'about-us' },
    { id: '2', title: 'Regulation', permalink: 'regulation' },
  ];

  test('Should render correctly', async () => {
    vi.mocked(fetchPagesAction).mockResolvedValue({
      ok: true,
      message: 'Links fetched successfully',
      pageLinks: pages,
    });
    render(await FooterLinks({}));

    const list = await screen.findByRole('list');

    expect(list).toBeInTheDocument();
  });

  test('Should render pages links', async () => {
    vi.mocked(fetchPagesAction).mockResolvedValue({
      ok: true,
      message: 'Links fetched successfully',
      pageLinks: pages,
    });
    render(await FooterLinks({}));
    const links = screen.getAllByRole('link').length;

    expect(links).toBeGreaterThan(0);
    pages.forEach((page, index) => {
      const link = screen.getByRole('link', { name: page.title });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/${pages[index].permalink}`);
    });
  });

  test('Should show a message if pages array is empty', async () => {
    vi.mocked(fetchPagesAction).mockResolvedValue({
      ok: true,
      message: 'Links fetched successfully',
      pageLinks: [],
    });
    render(await FooterLinks({}));
    const message = screen.getByRole('alert');
    const links = screen.queryAllByRole('link');

    expect(message).toHaveTextContent(/no hay páginas/i);
    expect(links).toHaveLength(0);
  });
});
