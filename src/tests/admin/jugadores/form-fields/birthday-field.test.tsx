import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BirthdayField } from '@/app/admin/jugadores/(components)/form-fields/birthday-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ birthday: Date | undefined }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { birthday: undefined },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetValidDate() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('birthday', new Date(2000, 5, 15), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <BirthdayField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText('Día')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Año')).toBeInTheDocument();
  });

  test('Should not show error when birthday is empty', () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show formatted date when birthday is valid', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    expect(await screen.findByText(/15 de junio del 2000/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should split the value across the day, month and year inputs', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    expect(screen.getByPlaceholderText('Día')).toHaveValue(15);
    expect(screen.getByPlaceholderText('Mes')).toHaveValue(6);
    expect(screen.getByPlaceholderText('Año')).toHaveValue(2000);
  });

  test('Should keep the inputs and the label empty when there is no value', () => {
    const { container } = render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText('Día')).toHaveValue(null);
    expect(screen.getByPlaceholderText('Mes')).toHaveValue(null);
    expect(screen.getByPlaceholderText('Año')).toHaveValue(null);
    expect(container.querySelector('span.text-sm')).toHaveTextContent('');
  });

  test('Should update the date when the day changes', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    fireEvent.change(screen.getByPlaceholderText('Día'), { target: { value: '20' } });

    expect(await screen.findByText(/20 de junio del 2000/i)).toBeInTheDocument();
  });

  test('Should update the date when the month changes', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    fireEvent.change(screen.getByPlaceholderText('Mes'), { target: { value: '7' } });

    expect(await screen.findByText(/15 de julio del 2000/i)).toBeInTheDocument();
  });

  test('Should update the date when the year changes', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    fireEvent.change(screen.getByPlaceholderText('Año'), {
      target: { value: '2001' },
    });

    expect(await screen.findByText(/15 de junio del 2001/i)).toBeInTheDocument();
  });

  test('Should fall back to day 1 when the day input is cleared', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    fireEvent.change(screen.getByPlaceholderText('Día'), { target: { value: '' } });

    expect(await screen.findByText(/1 de junio del 2000/i)).toBeInTheDocument();
  });

  test('Should fall back to january when the month input is cleared', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    fireEvent.change(screen.getByPlaceholderText('Mes'), { target: { value: '' } });

    expect(await screen.findByText(/15 de enero del 2000/i)).toBeInTheDocument();
  });

  test('Should fall back to the year 2000 when the year input is cleared', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
        <SetValidDate />
      </TestWrapper>,
    );

    await screen.findByText(/15 de junio del 2000/i);

    fireEvent.change(screen.getByPlaceholderText('Año'), { target: { value: '' } });

    expect(await screen.findByText(/15 de junio del 2000/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Año')).toHaveValue(2000);
  });

  test('Should build the date from today when the day input is typed first', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    fireEvent.change(screen.getByPlaceholderText('Día'), { target: { value: '10' } });

    const formatted = await screen.findByText(/\d{1,2} de \w+ del \d{4}/i);
    expect(formatted).toHaveTextContent(/^10 de /i);

    const now = new Date();
    expect(formatted.textContent).toContain(String(now.getFullYear()));
  });

  test('Should build the date from today when the month input is typed first', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    fireEvent.change(screen.getByPlaceholderText('Mes'), { target: { value: '3' } });

    await screen.findByText(/\d{1,2} de marzo del \d{4}/i);
    expect(screen.getByPlaceholderText('Mes')).toHaveValue(3);
  });

  test('Should build the date from today when the year input is typed first', async () => {
    render(
      <TestWrapper>
        <BirthdayField />
      </TestWrapper>,
    );

    fireEvent.change(screen.getByPlaceholderText('Año'), { target: { value: '1999' } });

    await screen.findByText(/\d{1,2} de \w+ del 1999/i);
    expect(screen.getByPlaceholderText('Año')).toHaveValue(1999);
  });
});
