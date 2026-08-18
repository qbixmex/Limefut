import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LoginForm } from '@/app/auth/login/components/login-form';
import { signInAction } from '@/app/(auth)/signInAction';
import { ROUTES } from '@/shared/constants/routes';

vi.mock('@/app/(auth)/signInAction', () => ({
  signInAction: vi.fn(),
}));

const mockReplace = vi.fn();

Object.defineProperty(window, 'location', {
  value: { replace: mockReplace },
  writable: true,
});

describe('Tests on <LoginForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signInAction).mockResolvedValue({
      ok: true,
      message: '¡ Has accedido correctamente 👍 !',
    });
  });

  test('Should show validation errors when submitting without email and password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /acceder/i }));

    expect(screen.getByText(/correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/8 caracteres/i)).toBeInTheDocument();
    expect(signInAction).not.toHaveBeenCalled();
  });

  test('Should show the password error when only email is provided', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailLabel = screen.getByRole('textbox', { name: /correo electrónico/i });
    const submitButton = screen.getByRole('button', { name: /acceder/i });

    await user.type(emailLabel, 'juan@example.com');
    await user.click(submitButton);

    expect(screen.queryByText(/correo electrónico es obligatorio/i)).not.toBeInTheDocument();
    expect(screen.getByText(/contraseña debe ser por lo menos de 8 caracteres/i)).toBeInTheDocument();
    expect(signInAction).not.toHaveBeenCalled();
  });

  test('Should show the email error when only password is provided', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /acceder/i });

    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.queryByText(/8 caracteres/i)).not.toBeInTheDocument();
    expect(signInAction).not.toHaveBeenCalled();
  });

  test('Should call signInAction only when email and password are provided', async () => {
    render(<LoginForm />);

    const user = userEvent.setup();
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /acceder/i });

    await user.type(emailInput, 'juan@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signInAction).toHaveBeenCalledTimes(1);
    });

    const formData = vi.mocked(signInAction).mock.calls[0][0] as FormData;
    expect(formData.get('email')).toBe('juan@example.com');
    expect(formData.get('password')).toBe('password123');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD);
  });
});
