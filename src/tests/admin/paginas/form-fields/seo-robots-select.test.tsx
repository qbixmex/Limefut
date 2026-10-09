import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SeoRobotsSelect } from '@/app/admin/paginas/(components)/form-fields/seo-robots-select';
import { editPageSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ seoRobots: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: { seoRobots: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const seoRobots = useWatch({ name: 'seoRobots' });
  return <span data-testid="seo-robots-value">{seoRobots}</span>;
}

function SetInvalidRobots() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('seoRobots', 'invalid-value' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <SeoRobotsSelect />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <SeoRobotsSelect />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = screen.getByRole('combobox');
    const getOption = (name: string) => screen.findByRole('option', { name });

    return { user, combobox, getOption };
  };

  test('Should render correctly', () => {
    const { combobox } = renderComponent();

    expect(combobox).toBeInTheDocument();
    expect(screen.getByText(/robots seo/i)).toBeInTheDocument();
    expect(screen.getByText(/seleccione una opción/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting an option', async () => {
    const { user, combobox, getOption } = renderComponent();

    await user.click(combobox);
    await user.click(await getOption('Indexar y Seguir'));

    expect(screen.getByTestId('seo-robots-value')).toHaveTextContent('index, follow');
  });

  test('Should show an error when an invalid value is set', async () => {
    renderComponent(<SetInvalidRobots />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/seleccione una opción de robots seo/i);
  });
});
