import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { MatchDateTime } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/match-date-time';

type FormValues = { matchDate?: Date };

function TestWrapper({
  children,
  matchDate,
}: Readonly<{ children: ReactNode; matchDate?: Date }>) {
  const form = useForm<FormValues>({ defaultValues: { matchDate } });
  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const matchDate = useWatch({ name: 'matchDate' });
  return (
    <span data-testid="date-value">
      {matchDate ? `${matchDate.getHours()}:${matchDate.getMinutes()}` : 'none'}
    </span>
  );
}

describe('Test on <MatchDateTime />', () => {
  const renderComponent = (matchDate?: Date, isMatchDate = false) => {
    render(
      <TestWrapper matchDate={matchDate}>
        <MatchDateTime isMatchDate={isMatchDate} />
        <FormValueDisplay />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const switchField = () => screen.getByRole('switch');

    return { user, switchField };
  };

  test('Should render the schedule switch when no date is set', () => {
    const { switchField } = renderComponent();

    expect(switchField()).toBeInTheDocument();
    expect(screen.getByText(/programar fecha y hora/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /fecha/i })).not.toBeInTheDocument();
  });

  test('Should reveal the date and time fields when toggling the switch', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField());

    expect(screen.getByRole('button', { name: /fecha/i })).toBeInTheDocument();
    expect(screen.getByText(/selecciona fecha del encuentro/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Hora')).toBeInTheDocument();
  });

  test('Should render the date when isMatchDate is true', () => {
    renderComponent(new Date(2026, 4, 16, 20, 30), true);

    expect(screen.getByRole('button', { name: /fecha/i })).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  test('Should update the hours when the time changes', () => {
    renderComponent(new Date(2026, 4, 16, 20, 30), true);

    const hourInput = screen.getByLabelText('Hora');
    fireEvent.change(hourInput, { target: { value: '10:15:00' } });

    expect(screen.getByTestId('date-value')).toHaveTextContent('10:15');
  });
});
