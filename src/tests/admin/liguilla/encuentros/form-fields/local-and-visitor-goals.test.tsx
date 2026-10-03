import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { LocalAndVisitorGoals } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-and-visitor-goals';

function TestWrapper() {
  const form = useForm({ defaultValues: { localTeamScore: 0, visitorTeamScore: 0 } });
  return (
    <FormProvider {...form}>
      <LocalAndVisitorGoals />
    </FormProvider>
  );
}

describe('Test on <LocalAndVisitorGoals />', () => {
  test('Should render both goal fields', () => {
    render(<TestWrapper />);

    expect(screen.getByText(/goles local/i)).toBeInTheDocument();
    expect(screen.getByText(/goles visitante/i)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });
});
