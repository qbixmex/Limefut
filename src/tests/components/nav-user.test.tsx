import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NavUser } from '@/components/nav-user';
import { SidebarProvider } from '@/components/ui/sidebar';
import { signOutAction } from '@/app/(auth)/signOutAction';
import { ROUTES } from '@/shared/constants/routes';

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

describe('Tests on <NavUser />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signOutAction).mockResolvedValue({
      message: '¡ Has cerrado sesión correctamente 👍 !',
    });
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  test('Should render the avatar fallback from the email when the name is null', async () => {
    const user = userEvent.setup();

    render(
      <NavUser
        user={{
          id: 'user-1',
          name: null,
          email: 'juan@example.com',
          username: null,
          image: null,
        }}
      />,
      { wrapper: SidebarProvider },
    );

    expect(screen.getByText('j')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'j' }));

    expect(await screen.findByText('juan@example.com')).toBeInTheDocument();
  });

  test('Should render the avatar initial from the name', () => {
    render(
      <NavUser
        user={{
          id: 'user-1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          username: 'juan',
          image: null,
        }}
      />,
      { wrapper: SidebarProvider },
    );

    expect(screen.getByText('J')).toBeInTheDocument();
  });

  test('Should sign out and hard navigate to the login page', async () => {
    const { toast } = await import('sonner');
    const user = userEvent.setup();

    render(
      <NavUser
        user={{
          id: 'user-1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          username: 'juan',
          image: null,
        }}
      />,
      { wrapper: SidebarProvider },
    );

    await user.click(screen.getByRole('button', { name: /juan/i }));
    await user.click(screen.getByRole('menuitem', { name: /salir/i }));

    await waitFor(() => {
      expect(signOutAction).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith(
      '¡ Has cerrado sesión correctamente 👍 !',
    );
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.AUTH_LOGIN);
  });
});
