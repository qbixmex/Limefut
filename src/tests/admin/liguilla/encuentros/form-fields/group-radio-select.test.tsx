import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePlayoffsMatchSchema } from '@/shared/schemas';
import { GroupRadioSelect } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/group-radio-select';

function TestWrapper({ children, group = '' }: Readonly<{ children: React.ReactNode; group?: string }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsMatchSchema) as any,
    defaultValues: {
      round: '',
      group,
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
  const group = useWatch({ name: 'group' });
  return <span data-testid="group-value">{group}</span>;
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger('group');
  }, [trigger]);
  return null;
}

describe('Test on <GroupRadioSelect />', () => {
  const renderComponent = (group = '', extra?: React.ReactNode) => {
    render(
      <TestWrapper group={group}>
        <GroupRadioSelect />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const gold = () => screen.getByRole('radio', { name: 'Oro' });
    const silver = () => screen.getByRole('radio', { name: 'Plata' });

    return { user, gold, silver };
  };

  test('Should render the group options', () => {
    const { gold, silver } = renderComponent();

    expect(screen.getByText('Grupo')).toBeInTheDocument();
    expect(gold()).toBeInTheDocument();
    expect(silver()).toBeInTheDocument();
  });

  test('Should update the form value when selecting a group', async () => {
    const { user, silver } = renderComponent('', <FormValueDisplay />);

    await user.click(silver());

    expect(screen.getByTestId('group-value')).toHaveTextContent('silver');
  });

  test('Should show an error when no group is selected', async () => {
    renderComponent('', <TriggerValidation />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/debes seleccionar un grupo/i);
  });

  test('Should not show an error when a group is selected', async () => {
    renderComponent('gold', <TriggerValidation />);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
