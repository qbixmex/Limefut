import { Header } from '@/app/(public)/components/header';
import { auth } from '@/lib/auth';
import { render, screen } from '@testing-library/react';

vi.mock('next/headers', () => ({
  headers: async () => new Headers(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(async () => null),
    },
  },
}));

describe('Test on <Header /> component', () => {
  test('Should render component correctly', async () => {
    const component = await Header();
    render(component);

    expect(
      screen.getByRole('banner', { name: /cabecera principal/i }),
    ).toBeInTheDocument();
  });

  test('Should render site logo component', async () => {
    const component = await Header();
    render(component);

    expect(screen.getByTestId('site-logo')).toBeInTheDocument();
  });

  test('Should render a navigation menu component', async () => {
    const component = await Header();
    render(component);

    const navigationMenu = screen.getByRole('menu', {
      name: /menu principal/i,
    });

    expect(navigationMenu).toBeInTheDocument();
  });

  test('Should show login button', async () => {
    const component = await Header();
    render(component);

    const accessLink = await screen.findByRole('link', {
      name: /acceder/i,
    });

    expect(accessLink).toBeInTheDocument();
  });

  test('Should show credentials', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: '123',
        name: 'Michael Jackson',
        username: 'michael-jackson',
        email: 'michael-jacskon@gmail.com',
        emailVerified: true,
        image: 'https://github.com/images/michael-jacskon.png',
        roles: ['user'],
      },
      session: {
        createdAt: new Date('2022-06-15T22:15:28.175'),
        expiresAt: new Date('2022-12-12T22:15:28.175'),
        token: 'abc123',
        userAgent: undefined,
      },
    });

    const component = await Header();
    render(component);

    expect(screen.getByText('michael-jackson')).toBeInTheDocument();
  });
});
