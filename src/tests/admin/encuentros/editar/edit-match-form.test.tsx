import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditMatchForm } from '@/app/admin/encuentros/editar/[id]/edit-match-form';
import { useEditMatch } from '@/app/admin/encuentros/editar/[id]/use-edit-match';
import { matchForEditMock } from '../mocks/match-for-edit.mock';
import { tournamentsMock } from '../mocks/tournaments.mock';
import { categoriesMock } from '../mocks/categories.mock';
import { fieldsMock } from '../mocks/fields.mock';
import { MATCH_STATUS } from '@/shared/enums';

const formFieldsProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/app/admin/encuentros/editar/[id]/use-edit-match');

vi.mock('@/app/admin/encuentros/(components)/form-fields', () => ({
  FormFields: (props: unknown) => {
    formFieldsProps.current = props;
    return <div data-testid="form-fields" />;
  },
}));

vi.mock('@/app/admin/encuentros/(components)/form-fields/update-match-score', () => ({
  UpdateMatchScore: () => <div data-testid="update-match-score" />,
}));

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
  hiddenScores: false,
  setHiddenScores: vi.fn(),
  isModifyingScores: false,
  setIsModifyingScores: vi.fn(),
};

const props = {
  tournaments: tournamentsMock,
  categories: categoriesMock,
  teams: [],
  fields: fieldsMock,
  match: matchForEditMock,
};

describe('Test on <EditMatchForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formFieldsProps.current = undefined;
    vi.mocked(useEditMatch).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render the form fields and action buttons', () => {
    render(<EditMatchForm {...props} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test('Should pass the match to the hook', () => {
    render(<EditMatchForm {...props} />);

    expect(vi.mocked(useEditMatch)).toHaveBeenCalledWith({ match: matchForEditMock });
  });

  test('Should pass the match and hidden scores to the form fields', () => {
    render(<EditMatchForm {...props} />);

    expect(formFieldsProps.current).toEqual(
      expect.objectContaining({ match: matchForEditMock, hiddenScores: false }),
    );
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    render(<EditMatchForm {...props} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(defaultMockReturn.handleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when the form is submitted', async () => {
    render(<EditMatchForm {...props} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(defaultMockReturn.onSubmit).toHaveBeenCalled();
  });

  test('Should offer to modify the scores on a completed match with hidden scores', async () => {
    vi.mocked(useEditMatch).mockReturnValue({
      ...defaultMockReturn,
      hiddenScores: true,
    } as never);

    render(
      <EditMatchForm
        {...props}
        match={{ ...matchForEditMock, status: MATCH_STATUS.COMPLETED }}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /modificar marcadores/i }));

    expect(defaultMockReturn.setIsModifyingScores).toHaveBeenCalledWith(true);
    expect(defaultMockReturn.setHiddenScores).toHaveBeenCalledWith(false);
  });

  test('Should render <UpdateMatchScore /> on a completed match with visible scores', () => {
    render(
      <EditMatchForm
        {...props}
        match={{ ...matchForEditMock, status: MATCH_STATUS.COMPLETED }}
      />,
    );

    expect(screen.getByTestId('update-match-score')).toBeInTheDocument();
  });

  test('Should show the loading state while submitting', async () => {
    vi.mocked(useEditMatch).mockReturnValue({
      ...defaultMockReturn,
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
        formState: { isSubmitting: true },
      },
    } as never);

    render(<EditMatchForm {...props} />);

    await waitFor(() => {
      const statusMessage = screen.getByRole('status');
      const icon = screen.getByRole('img', { name: /icono de carga/i });

      expect(statusMessage).toHaveTextContent(/espere/i);
      expect(icon).toBeInTheDocument();
    });
  });
});
