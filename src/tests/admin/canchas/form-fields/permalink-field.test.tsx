import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermalinkField } from '@/app/admin/canchas/(components)/form-fields/permalink-field';
import { createFieldSchema } from '@/shared/schemas';

const setPermalinkEdited = vi.fn();

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ permalink: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFieldSchema) as any,
    defaultValues: { permalink: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('permalink', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <PermalinkField />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should call setPermalinkEdited when typing', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'soccer-stars');

    expect(setPermalinkEdited).toHaveBeenCalledWith(true);
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/el enlace permanente debe ser una cadena de texto/i);
  });

  test('Should show error when permalink is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when permalink has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'soccer-stars');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when permalink exceeds 250 characters', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'x'.repeat(251));

    expect(screen.getByRole('alert')).toHaveTextContent(/menor a 250 caracteres/i);
  });

  test('Should show error when permalink contains spaces', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'soccer stars');

    expect(screen.getByRole('alert')).toHaveTextContent(/no debe contener espacios/i);
  });

  test('Should show error when permalink contains accents', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'canción');

    expect(screen.getByRole('alert')).toHaveTextContent(/no debe contener acentos/i);
  });

  test('Should show error when permalink contains the letter ñ', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'cancha-niña');

    expect(screen.getByRole('alert')).toHaveTextContent(/no debe contener la letra ñ/i);
  });

  test('Should show error when permalink contains invalid characters', async () => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'field@one');

    expect(screen.getByRole('alert')).toHaveTextContent(/solo puede contener letras/i);
  });
});
