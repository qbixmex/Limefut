import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { FieldSelect } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/field-select';
import { fieldsMock } from '../mocks/fields.mock';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsMatchSchema) as any,
    defaultValues: {
      round: '',
      group: '',
      localTeamScore: 0,
      visitorTeamScore: 0,
      status: undefined,
      referee: '',
      remarks: '',
      localTeamId: '',
      visitorTeamId: '',
      fieldId: '',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const fieldId = useWatch({ name: 'fieldId' });
  return <span data-testid="field-value">{fieldId}</span>;
}

describe('Test on <FieldSelect />', () => {
  const renderComponent = (fields = fieldsMock, extra?: ReactNode) => {
    render(
      <TestWrapper>
        <FieldSelect fields={fields} />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox');
    const getOption = (name: string) => screen.findByRole('option', { name });

    return { user, combobox, getOption };
  };

  test('Should render the label and placeholder', () => {
    const { combobox } = renderComponent();

    expect(screen.getByText('Cancha')).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seleccione la cancha/i)).toBeInTheDocument();
  });

  test('Should render the field options', async () => {
    const { user, combobox, getOption } = renderComponent();

    await user.click(combobox());

    expect(await getOption(fieldsMock[0].name)).toBeInTheDocument();
    expect(await getOption(fieldsMock[1].name)).toBeInTheDocument();
  });

  test('Should update the form value when selecting a field', async () => {
    const { user, combobox, getOption } = renderComponent(fieldsMock, <FormValueDisplay />);

    await user.click(combobox());
    await user.click(await getOption(fieldsMock[0].name));

    expect(screen.getByTestId('field-value')).toHaveTextContent(fieldsMock[0].id);
  });

  test('Should render the empty state when there are no fields', async () => {
    const { user, combobox } = renderComponent([]);

    await user.click(combobox());

    expect(await screen.findByText(/canchas no disponibles/i)).toBeInTheDocument();
  });
});
