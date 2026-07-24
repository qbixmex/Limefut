import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
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

    await screen.findByTestId('form-error');
    expect(screen.getByTestId('form-error')).toHaveTextContent(/uuid válido/i);
  });
});
