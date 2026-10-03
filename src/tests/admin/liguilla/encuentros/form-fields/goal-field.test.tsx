import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { GoalField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-and-visitor-goals/goal-field';

type FormValues = { localTeamScore: number };

function TestWrapper({ children, score = 0 }: Readonly<{ children: ReactNode; score?: number }>) {
  const form = useForm<FormValues>({ defaultValues: { localTeamScore: score } });
  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const score = useWatch({ name: 'localTeamScore' });
  return <span data-testid="score-value">{score}</span>;
}

describe('Test on <GoalField />', () => {
  const renderComponent = (score = 0) => {
    render(
      <TestWrapper score={score}>
        <GoalField name="localTeamScore" label="Goles Local" />
        <FormValueDisplay />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const input = () => screen.getByRole('textbox');
    const decrement = () => screen.getAllByRole('button')[0];
    const increment = () => screen.getAllByRole('button')[1];

    return { user, input, decrement, increment };
  };

  test('Should render the label and the current value', () => {
    const { input } = renderComponent(2);

    expect(screen.getByText(/goles local/i)).toBeInTheDocument();
    expect(input()).toHaveValue('2');
  });

  test('Should increment the score', async () => {
    const { user, increment } = renderComponent(0);

    await user.click(increment());

    expect(screen.getByTestId('score-value')).toHaveTextContent('1');
  });

  test('Should decrement the score', async () => {
    const { user, decrement } = renderComponent(3);

    await user.click(decrement());

    expect(screen.getByTestId('score-value')).toHaveTextContent('2');
  });

  test('Should disable the decrement button when the score is zero', () => {
    const { decrement } = renderComponent(0);

    expect(decrement()).toBeDisabled();
  });

  test('Should update the score when typing digits', async () => {
    const { user, input } = renderComponent(0);

    await user.clear(input());
    await user.type(input(), '5');

    expect(screen.getByTestId('score-value')).toHaveTextContent('5');
  });

  test('Should ignore non numeric characters', async () => {
    const { user, input } = renderComponent(0);

    await user.clear(input());
    await user.type(input(), 'a1b2');

    expect(screen.getByTestId('score-value')).toHaveTextContent('12');
  });

  test('Should reset to zero when the input is empty on blur', async () => {
    const { user, input } = renderComponent(4);

    await user.clear(input());
    await user.tab();

    expect(screen.getByTestId('score-value')).toHaveTextContent('0');
  });
});
