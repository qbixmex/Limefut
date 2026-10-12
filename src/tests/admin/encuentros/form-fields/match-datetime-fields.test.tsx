import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { MatchDateTimeFields } from '@/app/admin/encuentros/(components)/form-fields/match-datetime-fields';

type FormValues = { matchDate?: Date };

function TestWrapper({
  children,
  matchDate,
}: Readonly<{ children: ReactNode; matchDate?: Date }>) {
  const form = useForm<FormValues>({ defaultValues: { matchDate } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function ResetWrapper() {
  const form = useForm<FormValues>({
    defaultValues: { matchDate: new Date(2026, 4, 16, 20, 30) },
  });

  return (
    <FormProvider {...form}>
      <MatchDateTimeFields />
      <button
        type="button"
        onClick={() => form.reset({ matchDate: undefined })}
      >
        reset
      </button>
    </FormProvider>
  );
}

describe('Test on <MatchDateTimeFields />', () => {
  const renderComponent = (matchDate?: Date) => {
    render(
      <TestWrapper matchDate={matchDate}>
        <MatchDateTimeFields />
      </TestWrapper>,
    );

    const user = userEvent.setup();

    return { user };
  };

  test('Should render the schedule switch when no date is set', () => {
    renderComponent();

    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.getByText(/programar fecha y hora/i)).toBeInTheDocument();
    expect(screen.queryByLabelText('Hora')).not.toBeInTheDocument();
  });

  test('Should reveal the date and time fields when toggling the switch', async () => {
    const { user } = renderComponent();

    const switchComponent = screen.getByRole('switch');
    await user.click(switchComponent);

    const dateLabel = screen.getByText(/seleccione fecha/i);
    const timeLabel = screen.getByLabelText('Hora');

    expect(dateLabel).toBeInTheDocument();
    expect(timeLabel).toBeInTheDocument();
  });

  test('Should render the date when the form has a matchDate', () => {
    renderComponent(new Date('2026-05-16T20:30:00'));

    const date = screen.getByText(/16 de mayo del 2026/i);
    expect(date).toBeInTheDocument();

    const time = screen.getByLabelText('Hora');
    expect(time).toHaveValue('20:30:00');

    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  test('Should update the hours when the time changes', () => {
    renderComponent(new Date('2026-05-16T12:00'));
    const newHour = '17:00:00';

    fireEvent.change(
      screen.getByLabelText('Hora'),
      { target: { value: newHour } },
    );

    const time = screen.getByLabelText('Hora');

    expect(time).toHaveValue(newHour);
  });

  test('Should clear the date, hour and switch when the form is reset', async () => {
    const user = userEvent.setup();
    render(<ResetWrapper />);

    const date = screen.getByText(/16 de mayo del 2026/i);
    const hour = screen.getByLabelText('Hora');

    expect(date).toBeInTheDocument();
    expect(hour).toHaveValue('20:30:00');

    const reset = screen.getByRole('button', { name: /reset/i });
    await user.click(reset);

    await waitFor(() => {
      const label = screen.getByText(/programar fecha y hora/i);
      expect(label).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('Hora')).not.toBeInTheDocument();
    expect(screen.queryByText(/16 de mayo del 2026/i)).not.toBeInTheDocument();
  });
});
