import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RolesSelectField } from '@/app/admin/usuarios/(components)/form-fields/roles-select-field';
import { createUserSchema } from '@/shared/schemas';

function TestWrapper({
  children,
  defaultRoles = [],
}: Readonly<{ children: ReactNode; defaultRoles?: string[] }>) {
  const form = useForm<{ roles: string[] }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createUserSchema) as any,
    defaultValues: { roles: defaultRoles },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const fieldValue = useWatch({ name: 'roles' });
  return (
    <span data-testid="field-value">
      {Array.isArray(fieldValue) ? fieldValue.join(',') : ''}
    </span>
  );
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger();
  }, [trigger]);
  return null;
}

describe('Test on <RolesSelectField />', () => {
  const renderComponent = (extra?: ReactNode, defaultRoles: string[] = []) => {
    render(
      <TestWrapper defaultRoles={defaultRoles}>
        <RolesSelectField />
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
    expect(screen.getByText(/seleccione un rol/i)).toBeInTheDocument();
  });

  test('Should keep the selected role when choosing one option', async () => {
    const { user, combobox, getOption } = renderComponent(<FormValueDisplay />);

    await user.click(combobox);
    await user.click(await getOption('Usuario'));

    expect(screen.getByTestId('field-value')).toHaveTextContent('user');
  });

  test('Should allow selecting both roles', async () => {
    const { user, combobox, getOption } = renderComponent(<FormValueDisplay />);

    await user.click(combobox);
    await user.click(await getOption('Usuario'));
    await user.click(await getOption('Administrador'));

    expect(screen.getByTestId('field-value')).toHaveTextContent('user,admin');
  });

  test('Should remove a role when toggling it off', async () => {
    const { user, combobox, getOption } = renderComponent(<FormValueDisplay />, ['user']);

    await user.click(combobox);
    await user.click(await getOption('Usuario'));

    expect(screen.getByTestId('field-value')).toHaveTextContent('');
  });

  test('Should show error when no role is selected', async () => {
    renderComponent(<TriggerValidation />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/al menos un rol/i);
  });

  test('Should not show error when at least one role is selected', async () => {
    const { combobox } = renderComponent(<TriggerValidation />, ['user']);

    await waitFor(() => {
      expect(combobox).toHaveTextContent('Usuario');
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
