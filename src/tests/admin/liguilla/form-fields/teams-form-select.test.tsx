import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamsFormSelect } from '@/app/admin/liguilla/(components)/form-fields/teams-select-field/teams-form-select';
import { CreatePlayoffsSchema } from '@/shared/schemas';
import { teamsMock } from '../mocks/teams.mock';

type FormValues = {
  tournament: string;
  category: string;
  teamsIds: string[];
  startingRound: string;
};

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePlayoffsSchema) as any,
    defaultValues: {
      tournament: 'torneo-de-apertura-2026',
      category: 'varonil',
      teamsIds: [],
      startingRound: 'quarterfinal',
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function SetSelectedTeams() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('teamsIds', [teamsMock[0].id, teamsMock[1].id], { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetOneTeam() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('teamsIds', [teamsMock[0].id], { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <TeamsFormSelect />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <TeamsFormSelect teams={teamsMock} />
      </TestWrapper>,
    );

    const label = screen.getByText(/equipos \(0\)/i);

    expect(label).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar equipo/i)).toBeInTheDocument();
  });

  test('Should render the selected teams and positions', async () => {
    render(
      <TestWrapper>
        <TeamsFormSelect teams={teamsMock} />
        <SetSelectedTeams />
      </TestWrapper>,
    );

    await screen.findByText(/equipos \(2\)/i);

    const positionsHeading = screen.getByText(/posiciones en liguilla/i);
    const firstTeam = screen.getAllByText(teamsMock[0].name);
    const secondTeam = screen.getAllByText(teamsMock[1].name);

    expect(positionsHeading).toBeInTheDocument();
    expect(firstTeam.length).toBeGreaterThan(0);
    expect(secondTeam.length).toBeGreaterThan(0);
  });

  test('Should show error when less than two teams are selected', async () => {
    render(
      <TestWrapper>
        <TeamsFormSelect teams={teamsMock} />
        <SetOneTeam />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/al menos 2 equipos/i);
  });

  test('Should not show error when at least two teams are selected', async () => {
    render(
      <TestWrapper>
        <TeamsFormSelect teams={teamsMock} />
        <SetSelectedTeams />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/equipos \(2\)/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
