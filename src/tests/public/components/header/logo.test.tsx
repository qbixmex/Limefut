import { Logo } from '@/app/(public)/components/logo';
import { render, screen } from '@testing-library/react';

describe('Test on <ComponentName /> component', () => {
  test('Should render correctly', () => {
    render(
      <Logo
        siteName="Site Name"
        siteLogo="https://cloudinary.com/logo.png"
      />,
    );

    const image = screen.getByRole('img', { name: /logo/i });

    expect(image).toBeInTheDocument();
  });

  test('Should link to homepage', () => {
    render(
      <Logo
        siteName="Site Name"
        siteLogo="https://cloudinary.com/logo.png"
      />,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/');
  });
});
