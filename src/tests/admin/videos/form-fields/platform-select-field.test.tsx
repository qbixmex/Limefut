import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlatformSelectField } from '@/app/admin/videos/(components)/form-fields/platform-select-field';
import { createVideoSchema } from '@/shared/schemas';
import { PLATFORM } from '@/shared/constants/platforms';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createVideoSchema) as any,
    defaultValues: {
      title: '',
      permalink: '',
      url: '',
      platform: undefined,
      publishedDate: undefined,
      description: '',
      active: false,
    },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const platform = useWatch({ name: 'platform' });
  return <span data-testid="platform-value">{platform}</span>;
}

function SetEmptyPlatform() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('platform', '' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidPlatform() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('platform', PLATFORM.YOUTUBE as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <PlatformSelectField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <PlatformSelectField />
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
    expect(screen.getByText(/^plataforma/i)).toBeInTheDocument();
    expect(screen.getByText(/seleccione plataforma/i)).toBeInTheDocument();
  });

  test('Should update the form value when selecting Youtube', async () => {
    const { user, combobox, getOption } = renderComponent();

    await user.click(combobox);
    await user.click(await getOption('Youtube'));

    const platformMock = screen.getByTestId('platform-value');

    expect(platformMock).toHaveTextContent(PLATFORM.YOUTUBE);
  });

  test('Should update the form value when selecting Facebook', async () => {
    const { user, combobox, getOption } = renderComponent();

    await user.click(combobox);
    await user.click(await getOption('Facebook'));

    const platformMock = screen.getByTestId('platform-value');

    expect(platformMock).toHaveTextContent(PLATFORM.FACEBOOK);
  });

  test('Should show an error when the platform is empty', async () => {
    renderComponent(<SetEmptyPlatform />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('La plataforma es obligatoria');
  });

  test('Should not show an error when the platform is valid', async () => {
    renderComponent(<SetValidPlatform />);

    await waitFor(() => {
      expect(screen.getByTestId('platform-value')).toHaveTextContent(PLATFORM.YOUTUBE);
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
