import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlignmentField } from '@/app/admin/banners/(components)/form-fields/alignment-field';
import { createHeroBannerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{
    dataAlignment: string;
    title: string;
    description: string;
  }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHeroBannerSchema) as any,
    defaultValues: {
      dataAlignment: 'left',
      title: 'Banner de bienvenida',
      description: 'Descripción válida del banner',
    },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const alignment = useWatch({ name: 'dataAlignment' });
  return <span data-testid="field-value">{alignment}</span>;
}

function SetValidAlignment() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('dataAlignment', 'right', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetInvalidAlignment() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('dataAlignment', 'justify', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <AlignmentField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <AlignmentField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const select = screen.getByRole('combobox', { name: /alineación/i });
    const selectOption = (name: RegExp) => screen.findByRole('option', { name });

    return { user, select, selectOption };
  };

  test('Should render correctly', () => {
    const { select } = renderComponent();

    expect(select).toBeInTheDocument();
  });

  test('Should update the alignment value to left when selecting an option', async () => {
    const { user, select, selectOption } = renderComponent(<FormValueDisplay />);

    await user.click(select);
    const selectItem = await selectOption(/alineada a la izquierda/i);
    await user.click(selectItem);

    const fieldValue = screen.getByTestId('field-value');
    expect(fieldValue).toHaveTextContent('left');
  });

  test('Should update the alignment value to center when selecting an option', async () => {
    const { user, select, selectOption } = renderComponent(<FormValueDisplay />);

    await user.click(select);
    const selectItem = await selectOption(/alineada al centro/i);
    await user.click(selectItem);

    const fieldValue = screen.getByTestId('field-value');
    expect(fieldValue).toHaveTextContent('center');
  });

  test('Should update the alignment value to right when selecting an option', async () => {
    const { user, select, selectOption } = renderComponent(<FormValueDisplay />);

    await user.click(select);
    const selectItem = await selectOption(/alineada a la derecha/i);
    await user.click(selectItem);

    const fieldValue = screen.getByTestId('field-value');
    expect(fieldValue).toHaveTextContent('right');
  });

  test('Should show error when alignment value is invalid', async () => {
    renderComponent(<SetInvalidAlignment />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/seleccione una opción/i);
  });

  test('Should not show error when alignment value is valid', async () => {
    renderComponent(<SetValidAlignment />);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
