import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AuthNav } from '@/app/(public)/components/header/sign-in-out/AuthNav';
import { signOutAction } from '@/app/(auth)/signOutAction';
import { ROUTES } from '@/shared/constants/routes';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/app/(auth)/signOutAction', () => ({
  signOutAction: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockReplace = vi.fn();

Object.defineProperty(window, 'location', {
  value: { replace: mockReplace },
  writable: true,
});

describe('Tests on <AuthNav />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signOutAction).mockResolvedValue({
      message: '¡ Has cerrado sesión correctamente 👍 !',
    });
  });

  test('Should render the avatar fallback from the email when the name is null', () => {
    render(
      <AuthNav
        user={{
          id: 'user-1',
          name: null,
          username: null,
          email: 'juan@example.com',
          emailVerified: true,
          roles: ['admin'],
          image: null,
        }}
      />,
    );

    expect(screen.getByText('j')).toBeInTheDocument();
  });

  test('Should sign out and hard navigate to the login page', async () => {
    const { toast } = await import('sonner');
    const user = userEvent.setup();

    render(
      <AuthNav
        user={{
          id: 'user-1',
          name: 'Juan Pérez',
          username: 'juan',
          email: 'juan@example.com',
          emailVerified: true,
          roles: ['admin'],
          image: null,
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /juan/i }));
    await user.click(screen.getByRole('button', { name: /salir/i }));

    await waitFor(() => {
      expect(signOutAction).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith(
      '¡ Has cerrado sesión correctamente 👍 !',
    );
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.AUTH_LOGIN);
  });
});
