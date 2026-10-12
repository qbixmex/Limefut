import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { TooltipProvider } from '@/components/ui/tooltip';
import { InvertTeams } from '@/app/admin/encuentros/(components)/form-fields/invert-teams';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';

function TestWrapper({
  children,
  localTeamId = '',
  visitorTeamId = '',
}: Readonly<{ children: ReactNode; localTeamId?: string; visitorTeamId?: string }>) {
  const form = useForm({ defaultValues: { localTeamId, visitorTeamId } });

  return (
    <TooltipProvider>
      <FormProvider {...form}>{children}</FormProvider>
    </TooltipProvider>
  );
}

function FormValueDisplay() {
  const localTeamId = useWatch({ name: 'localTeamId' });
  const visitorTeamId = useWatch({ name: 'visitorTeamId' });
  return (
    <>
      <span data-testid="local-value">{localTeamId}</span>
      <span data-testid="visitor-value">{visitorTeamId}</span>
    </>
  );
}

describe('Test on <InvertTeams />', () => {
  const renderComponent = (localTeamId = '', visitorTeamId = '') => {
    render(
      <TestWrapper localTeamId={localTeamId} visitorTeamId={visitorTeamId}>
        <InvertTeams />
        <FormValueDisplay />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const button = () => screen.getByRole('button', { name: /invertir equipos/i });

    return { user, button };
  };

  test('Should render the invert button', () => {
    const { button } = renderComponent();

    expect(button()).toBeInTheDocument();
    expect(button().querySelector('svg')).toBeInTheDocument();
  });

  test('Should swap the local and visitor team ids when clicked', async () => {
    const { user, button } = renderComponent(AMERICA.id, CHIVAS.id);

    await user.click(button());

    expect(screen.getByTestId('local-value')).toHaveTextContent(CHIVAS.id);
    expect(screen.getByTestId('visitor-value')).toHaveTextContent(AMERICA.id);
  });
});
