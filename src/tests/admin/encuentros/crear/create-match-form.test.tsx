import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateMatchForm } from '@/app/admin/encuentros/(components)/create-match-form';

const { mockOnSubmit, mockHandleNavigateBack, mockHandleSubmit, mockUseCreateMatch, mockIsSubmitting } =
  vi.hoisted(() => ({
    mockOnSubmit: vi.fn(),
    mockHandleNavigateBack: vi.fn(),
    mockHandleSubmit: vi.fn(),
    mockUseCreateMatch: vi.fn(),
    mockIsSubmitting: { value: false },
  }));

vi.mock('@/app/admin/encuentros/crear/use-create-match', () => ({
  useCreateMatch: () => mockUseCreateMatch(),
}));

vi.mock('@/app/admin/encuentros/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const props = {
  tournaments: [],
  categories: [],
  teams: [],
  fields: [],
};

describe('Test on <CreateMatchForm /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsSubmitting.value = false;
    mockHandleSubmit.mockImplementation(
      (callback: () => void) => () => callback(),
    );
    mockUseCreateMatch.mockReturnValue({
      form: {
        handleSubmit: mockHandleSubmit,
        formState: { isSubmitting: mockIsSubmitting.value },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: mockHandleNavigateBack,
    });
  });

  test('Should render the form fields', () => {
    render(<CreateMatchForm {...props} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
  });

  test('Should render the form action buttons', () => {
    render(<CreateMatchForm {...props} />);

    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    render(<CreateMatchForm {...props} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when the form is submitted', async () => {
    render(<CreateMatchForm {...props} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /crear/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should disable the submit button while submitting', () => {
    mockIsSubmitting.value = true;
    mockUseCreateMatch.mockReturnValue({
      form: {
        handleSubmit: mockHandleSubmit,
        formState: { isSubmitting: true },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: mockHandleNavigateBack,
    });

    render(<CreateMatchForm {...props} />);

    const submitButton = screen.getByRole('button', { name: /espere/i });
    const icon = screen.getByRole('img', { name: /icono de carga/i });

    expect(submitButton).toBeDisabled();
    expect(icon).toBeInTheDocument();
  });
});
