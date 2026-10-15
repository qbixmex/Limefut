import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { MatchModeSelectField } from '@/app/admin/encuentros/(components)/form-fields/match-mode-select-field';
import { MATCH_MODE } from '@/shared/enums';
import { getMatchMode } from '@/lib/utils';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({ defaultValues: { mode: undefined } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const mode = useWatch({ name: 'mode' });

  return <span data-testid="mode-value">{mode}</span>;
}

describe('Test on <MatchModeSelectField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <MatchModeSelectField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox');

    return { user, combobox };
  };

  test('Should render the label and the select', () => {
    const { combobox } = renderComponent();

    const label = screen.getByText('Modo');
    const placeholder = screen.getByText(/seleccione tipo de partido/i);

    expect(label).toBeInTheDocument();
    expect(combobox()).toBeInTheDocument();
    expect(placeholder).toBeInTheDocument();
  });

  test('Should render both match mode options', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    expect(await screen.findByRole('option', { name: getMatchMode(MATCH_MODE.LEAGUE) })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: getMatchMode(MATCH_MODE.FRIENDLY) })).toBeInTheDocument();
  });

  test('Should update the form value when selecting league option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getMatchMode(MATCH_MODE.LEAGUE),
    });
    await user.click(option);

    await waitFor(() => {
      expect(screen.getByTestId('mode-value')).toHaveTextContent(MATCH_MODE.LEAGUE);
    });
  });

  test('Should update the form value when selecting friendly option', async () => {
    const { user, combobox } = renderComponent(<FormValueDisplay />);

    await user.click(combobox());
    const option = await screen.findByRole('option', {
      name: getMatchMode(MATCH_MODE.FRIENDLY),
    });
    await user.click(option);

    await waitFor(() => {
      expect(screen.getByTestId('mode-value')).toHaveTextContent(MATCH_MODE.FRIENDLY);
    });
  });
});
