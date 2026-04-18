import { render, screen } from '@testing-library/react';
import type { Social } from '@/app/(public)/components/footer/data/social-media';
import SocialMedia from '@/app/(public)/components/footer/social-media';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';

const data: Social[] = [
  {
    platform: 'facebook',
    url: 'https://www.facebook.com/michael-jackson',
    icon: FaFacebookF,
    css: 'inline',
  },
  {
    platform: 'twitterX',
    url: 'https://x.com/michael-jackson',
    icon: FaXTwitter,
    css: 'inline',
  },
];

describe('Test on <SocialMedia /> component', () => {
  test('Should render correctly', () => {
    render(<SocialMedia socialMedia={[]} />);

    const mainWrapper = screen.getByLabelText(/redes sociales/i);
    expect(mainWrapper).toBeInTheDocument();
  });

  test('Should show message if social media is empty', () => {
    render(<SocialMedia socialMedia={[]} />);

    const message = screen.getByRole('alert');

    expect(message).toHaveTextContent(/no hay redes sociales/);
  });

  test('Should render social media links', async () => {
    const component = await SocialMedia({ socialMedia: data });
    render(component);

    const links = screen.getAllByRole('link');
    const icons = screen.getAllByRole('icon', { name: /social media/i });

    expect(links).toHaveLength(2);
    expect(icons).toHaveLength(2);
    data.forEach((item, index) => {
      expect(links[index]).toHaveAttribute('href', item.url);
      expect(icons[index]).toBeInTheDocument();
    });
  });

  test('Should show only with valid urls social media', async () => {
    data[1].url = '#'; // Disable second social media
    const component = await SocialMedia({ socialMedia: data });
    render(component);

    const links = screen.getAllByRole('link');
    const icons = screen.getAllByRole('icon', { name: /social media/i });

    expect(links).toHaveLength(1);
    expect(icons).toHaveLength(1);
  });
});
