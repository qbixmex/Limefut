import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatchSchema } from '@/shared/schemas';
import { ScoreField } from '@/app/admin/encuentros/(components)/form-fields/score-field';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX } from '../mocks/tournaments.mock';
import { SUB_15 } from '../mocks/categories.mock';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMatchSchema) as any,
    defaultValues: {
      localTeamId: AMERICA.id,
      localScore: 0,
      visitorTeamId: CHIVAS.id,
      visitorScore: 0,
      fieldId: '',
      status: 'scheduled',
      week: 0,
      tournament: LIGA_MX.permalink,
      category: SUB_15.permalink,
    },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function FormValueDisplay() {
  const localScore = useWatch({ name: 'localScore' });
  return (
    <span data-testid="score-value">
      {localScore}
    </span>
  );
}

function SetNegativeScore() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('localScore', -2, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ScoreField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <ScoreField name="localScore" label="Marcador Local" />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const input = () => screen.getByRole('spinbutton', { name: /marcador local/i });

    return { user, input };
  };

  test('Should render the label and numeric input', () => {
    const { input } = renderComponent();
    const label = screen.getByText('Marcador Local');

    expect(input()).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test('Should update the form value when typing a number', async () => {
    const { user, input } = renderComponent(<FormValueDisplay />);

    await user.clear(input());
    await user.type(input(), '2');

    await waitFor(() => {
      expect(screen.getByTestId('score-value')).toHaveTextContent('2');
    });
  });

  test('Should show an error for a negative score', async () => {
    renderComponent(<SetNegativeScore />);

    const errorMessage = await screen.findByRole('alert');

    expect(errorMessage).toHaveTextContent(/positivo/i);
  });
});
