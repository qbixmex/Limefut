import { Header } from '@/app/(public)/components/header';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/(public)/components/logo/', () => ({
  Logo: () => null,
}));

vi.mock('@/app/(public)/components/header/navigation-menu/', () => ({
  NavigationMenu: () => null,
}));

vi.mock('@/app/(public)/components/header/mobile-menu/', () => ({
  MobileMenu: () => null,
}));

vi.mock('@/app/(public)/components/header/AuthSession', () => ({
  AuthSession: () => null,
}));

vi.mock('@/shared/theme/ThemeSwitcher', () => ({
  ThemeSwitcher: () => null,
}));

describe('Test on <Header /> component', () => {
  test('Should render component correctly', () => {
    render(<Header />);

    screen.debug();

    expect(
      screen.getByRole('banner', { name: /cabecera principal/i }),
    ).toBeInTheDocument();
  });
});
