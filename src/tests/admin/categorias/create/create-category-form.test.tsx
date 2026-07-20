import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateCategoryForm } from '@/app/admin/categorias/(components)/create-category-form';
import { useCreateCategory } from '@/app/admin/categorias/(components)/useCreateCategory';

vi.mock('@/app/admin/categorias/(components)/useCreateCategory');

vi.mock('@/app/admin/categorias/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const mockSession = {
  user: {
    id: '881bf0f0-b4d4-4de1-b19e-eb9927d04d99',
    name: 'John Doe',
    username: 'johnny',
    email: 'johnny@gmail.com',
    emailVerified: true,
    image: 'johnny.webp',
    roles: ['admin'],
  },
  session: {
    token: 'a41d9b460c1379bd205b1',
    createdAt: new Date('2025-01-02T00:00:00.000Z'),
    expiresAt: new Date('2025-01-02T01:00:00.000Z'),
  },
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <CreateCategoryForm />', () => {
  beforeEach(() => {
    vi.mocked(useCreateCategory).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    render(
      <CreateCategoryForm
        authenticatedUserId={mockSession.user.id}
        authenticatedUserRoles={mockSession.user.roles}
      />,
    );

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    const submitBtn = screen.getByRole('button', { name: /crear/i });

    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreateCategory).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(
      <CreateCategoryForm
        authenticatedUserId={mockSession.user.id}
        authenticatedUserRoles={mockSession.user.roles}
      />,
    );

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelBtn);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateCategory).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    } as never);

    render(
      <CreateCategoryForm
        authenticatedUserId={mockSession.user.id}
        authenticatedUserRoles={mockSession.user.roles}
      />,
    );

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreateCategory).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    } as never);

    const { rerender } = render(
      <CreateCategoryForm
        authenticatedUserId={mockSession.user.id}
        authenticatedUserRoles={mockSession.user.roles}
      />,
    );

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useCreateCategory).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: true },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    } as never);
    rerender(
      <CreateCategoryForm
        authenticatedUserId={mockSession.user.id}
        authenticatedUserRoles={mockSession.user.roles}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/espere/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear/i })).toBeDisabled();
    });
  });
});
