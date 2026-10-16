import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamSelectField } from '@/app/admin/jugadores/(components)/form-fields/team-select-field';
import { createPlayerSchema } from '@/shared/schemas';

const mockTeams = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Eagles' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Sharks' },
];

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ teamId: string | null | undefined }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { teamId: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetValidTeamId() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('teamId', mockTeams[0].id, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetInvalidTeamId() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('teamId', 'not-a-uuid', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function FormErrorIndicator() {
  const { formState } = useFormContext();
  const error = formState.errors.teamId;
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message) : '';
  return <span data-testid="form-error">{message}</span>;
}

function FormValueDisplay() {
  const teamId = useWatch<{ teamId: string | null }>({ name: 'teamId' });
  return <span data-testid="field-value">{teamId ?? ''}</span>;
}

function SetUnknownTeamId() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('teamId', 'ffffffff-ffff-ffff-ffff-ffffffffffff', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <TeamSelectField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
      </TestWrapper>,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/sin equipo asignado/i)).toBeInTheDocument();
  });

  test('Should not show error when teamId is empty', () => {
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should not show error when teamId is a valid UUID', async () => {
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
        <SetValidTeamId />
      </TestWrapper>,
    );

    await screen.findByText(mockTeams[0].name);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when teamId is not a valid UUID', async () => {
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
        <FormErrorIndicator />
        <SetInvalidTeamId />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toHaveTextContent(/uuid válido/i);
    });
  });

  test('Should show the select placeholder when teamId matches no team', async () => {
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
        <SetUnknownTeamId />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent(/selecciona un equipo/i);
    });
  });

  test('Should render every team as an option when the popover is open', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
      </TestWrapper>,
    );

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByText(mockTeams[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockTeams[1].name)).toBeInTheDocument();
  });

  test('Should set the team id in the form when a team is selected', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
        <FormValueDisplay />
      </TestWrapper>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(mockTeams[1].name));

    await waitFor(() => {
      expect(screen.getByTestId('field-value')).toHaveTextContent(mockTeams[1].id);
    });
    expect(screen.getByRole('combobox')).toHaveTextContent(mockTeams[1].name);
  });

  test('Should clear the team id when the unassigned option is selected', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TeamSelectField teams={mockTeams} />
        <FormValueDisplay />
        <SetValidTeamId />
      </TestWrapper>,
    );

    await screen.findByText(mockTeams[0].name);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getAllByText(/sin equipo asignado/i)[0]);

    await waitFor(() => {
      expect(screen.getByTestId('field-value').textContent).toBe('');
    });
    expect(screen.getByRole('combobox')).toHaveTextContent(/sin equipo asignado/i);
  });
});
