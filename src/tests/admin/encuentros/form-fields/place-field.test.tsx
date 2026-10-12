import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { PlaceField } from '@/app/admin/encuentros/(components)/form-fields/place-field';
import { teamsForMatchMock } from '../mocks/teams-for-match.mock';
import { fieldsMock, ESTADIO_AZTECA } from '../mocks/fields.mock';
import { AMERICA } from '../mocks/teams.mock';

function TestWrapper({
  children,
  localTeamId = '',
  fieldId = '',
}: {
  children: ReactNode;
  localTeamId?: string;
  fieldId?: string;
}) {
  const form = useForm({ defaultValues: { localTeamId, fieldId } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const fieldId = useWatch({ name: 'fieldId' });
  return <span data-testid="field-value">{fieldId}</span>;
}

describe('Test on <PlaceField />', () => {
  const renderComponent = ({
    teams = teamsForMatchMock,
    fields = fieldsMock,
    localTeamId = '',
    fieldId = '',
    match,
    extra,
  }: {
    teams?: typeof teamsForMatchMock;
    fields?: typeof fieldsMock;
    localTeamId?: string;
    fieldId?: string;
    match?: never;
    extra?: ReactNode;
  } = {}) => {
    render(
      <TestWrapper localTeamId={localTeamId} fieldId={fieldId}>
        <PlaceField teams={teams} match={match} fields={fields} />
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

    const label = screen.getByText(/sede/i, { selector: 'label' });
    expect(label).toBeInTheDocument();

    expect(combobox()).toBeInTheDocument();

    const placeholder = screen.getByText(/seleccione una sede/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('Should update the form value when selecting a field', async () => {
    const { user, combobox, getOption } = renderComponent({
      extra: <FormValueDisplay />,
    });

    await user.click(combobox());

    const option = await getOption(ESTADIO_AZTECA.name);
    await user.click(option);

    expect(screen.getByTestId('field-value')).toHaveTextContent(ESTADIO_AZTECA.id);
  });

  test('Should clear the field when selecting "Ninguna"', async () => {
    const { user, combobox, getOption } = renderComponent({
      fieldId: ESTADIO_AZTECA.id,
      extra: <FormValueDisplay />,
    });

    await user.click(combobox());

    const option = await getOption('Ninguna');

    await user.click(option);

    const fieldValue = screen.getByTestId('field-value');
    expect(fieldValue).toHaveTextContent('');
  });

  test('Should fall back to the local team fields when no fields are provided', async () => {
    const { user, combobox } = renderComponent({
      fields: [],
      localTeamId: AMERICA.id,
    });

    await user.click(combobox());

    const option = await screen.findByRole('option', {
      name: ESTADIO_AZTECA.name,
    });

    expect(option).toBeInTheDocument();
  });
});
