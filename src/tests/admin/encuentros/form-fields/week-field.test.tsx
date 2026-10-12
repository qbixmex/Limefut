import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatchSchema } from '@/shared/schemas';
import { WeekField } from '@/app/admin/encuentros/(components)/form-fields/week-field';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX } from '../mocks/tournaments.mock';
import { SUB_15 } from '../mocks/categories.mock';

function TestWrapper({
  children,
  week = 0,
}: Readonly<{ children: ReactNode; week?: number }>) {
  const form = useForm({ defaultValues: { week } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const week = useWatch({ name: 'week' });
  return (
    <span data-testid="week-value">{week}</span>
  );
}

/**
 * Uses the same schema resolver as the real create/edit match forms so that
 * `fieldState.invalid` can actually become true.
 */
function ValidationWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMatchSchema) as any,
    defaultValues: {
      localTeamId: AMERICA.id,
      localScore: 0,
      visitorTeamId: CHIVAS.id,
      visitorScore: 0,
      fieldId: '',
      status: 'scheduled',
      week: 0,
      tournament: LIGA_MX.permalink,
      category: SUB_15.permalink,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function SetInvalidWeek({ week }: Readonly<{ week: number }>) {
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue('week', week, { shouldValidate: true });
  }, [setValue, week]);

  return null;
}

describe('Test on <WeekField />', () => {
  const renderComponent = (week = 0, extra?: ReactNode) => {
    render(
      <TestWrapper week={week}>
        <WeekField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const input = () => screen.getByLabelText('Jornada');
    const increment = () => screen.getByRole('button', { name: /aumentar jornada/i });
    const decrement = () => screen.getByRole('button', { name: /disminuir jornada/i });

    return { user, input, increment, decrement };
  };

  test('Should render the label and the current week', () => {
    const { input } = renderComponent(5);

    const label = screen.getByText('Jornada');

    expect(label).toBeInTheDocument();
    expect(input()).toHaveValue('5');
  });

  test('Should increase the week when clicking the plus button', async () => {
    const { user, increment } = renderComponent(0, <FormValueDisplay />);

    await user.click(increment());

    expect(screen.getByTestId('week-value')).toHaveTextContent('1');
  });

  test('Should decrease the week when clicking the minus button', async () => {
    const { user, decrement } = renderComponent(3, <FormValueDisplay />);

    await user.click(decrement());

    expect(screen.getByTestId('week-value')).toHaveTextContent('2');
  });

  test('Should disable the minus button when the week is zero', () => {
    const { decrement } = renderComponent(0);

    expect(decrement()).toBeDisabled();
  });

  test('Should update the week when typing a number', async () => {
    const { user, input } = renderComponent(2, <FormValueDisplay />);
    const testWeek = '8';

    await user.clear(input());
    await user.type(input(), testWeek);

    const weekValue = screen.getByTestId('week-value');
    expect(weekValue).toHaveTextContent(testWeek);
  });

  test('Should show the error message when the week is invalid', async () => {
    render(
      <ValidationWrapper>
        <WeekField />
        <SetInvalidWeek week={-1} />
      </ValidationWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mínimo 1/i);

    const label = screen.getByLabelText('Jornada');
    expect(label).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should not show an error when the week is valid', async () => {
    render(
      <ValidationWrapper>
        <WeekField />
        <SetInvalidWeek week={5} />
      </ValidationWrapper>,
    );

    await waitFor(() => {
      const error = screen.queryByRole('alert');
      expect(error).not.toBeInTheDocument();
    });

    const input = screen.getByLabelText('Jornada');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});
