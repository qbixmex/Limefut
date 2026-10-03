import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { InvertTeams } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/invert-teams';

const localTeamId = '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d';
const visitorTeamId = '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e';

function FormValues() {
  const local = useWatch({ name: 'localTeamId' });
  const visitor = useWatch({ name: 'visitorTeamId' });
  return (
    <>
      <span data-testid="local-value">{local}</span>
      <span data-testid="visitor-value">{visitor}</span>
    </>
  );
}

function TestForm() {
  const form = useForm({
    defaultValues: { localTeamId, visitorTeamId },
  });

  return (
    <FormProvider {...form}>
      <InvertTeams />
      <FormValues />
    </FormProvider>
  );
}

describe('Test on <InvertTeams /> component', () => {
  const renderComponent = () => {
    render(<TestForm />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const button = () => screen.getByRole('button', { name: /invertir equipos/i });

    return { user, button };
  };

  test('Should render the button with its icon', () => {
    const { button } = renderComponent();

    expect(button()).toBeInTheDocument();
    expect(button().querySelector('svg')).toBeInTheDocument();
  });

  test('Should swap the local and visitor teams on click', async () => {
    const { user, button } = renderComponent();

    await user.click(button());

    expect(screen.getByTestId('local-value')).toHaveTextContent(visitorTeamId);
    expect(screen.getByTestId('visitor-value')).toHaveTextContent(localTeamId);
  });

  test('Should show the tooltip on mouse over', async () => {
    const { user, button } = renderComponent();

    await user.hover(button());

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/invertir equipos/i);
  });
});
