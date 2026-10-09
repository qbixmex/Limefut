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
  return <FormProvider {...form}>{children}</FormProvider>;
}

function ResetWrapper() {
  const form = useForm<FormValues>({
    defaultValues: { matchDate: new Date(2026, 4, 16, 20, 30) },
  });

  return (
    <FormProvider {...form}>
      <MatchDateTimeFields />
      <button type="button" onClick={() => form.reset({ matchDate: undefined })}>
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

    await user.click(screen.getByRole('switch'));

    expect(screen.getByText(/seleccione fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Hora')).toBeInTheDocument();
  });

  test('Should render the date when the form has a matchDate', () => {
    renderComponent(new Date(2026, 4, 16, 20, 30));

    expect(screen.getByText(/16 de mayo del 2026/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Hora')).toHaveValue('20:30:00');
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  test('Should update the hours when the time changes', () => {
    renderComponent(new Date(2026, 4, 16, 20, 30));

    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '10:15:00' } });

    expect(screen.getByLabelText('Hora')).toHaveValue('10:15:00');
  });

  test('Should clear the date, hour and switch when the form is reset', async () => {
    const user = userEvent.setup();
    render(<ResetWrapper />);

    expect(screen.getByText(/16 de mayo del 2026/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Hora')).toHaveValue('20:30:00');

    await user.click(screen.getByRole('button', { name: /reset/i }));

    await waitFor(() => {
      expect(screen.getByText(/programar fecha y hora/i)).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('Hora')).not.toBeInTheDocument();
    expect(screen.queryByText(/16 de mayo del 2026/i)).not.toBeInTheDocument();
  });
});
