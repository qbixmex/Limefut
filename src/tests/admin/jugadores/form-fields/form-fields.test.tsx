import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/jugadores/(components)/form-fields';

const mockTeams = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Atlas' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Chivas' },
];

vi.mock('@/app/admin/jugadores/(components)/form-fields/name-field', () => ({
  NameField: () => <div data-testid="name-field" />,
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/email-field', () => ({
  EmailField: () => <div data-testid="email-field" />,
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/phone-field', () => ({
  PhoneField: () => <div data-testid="phone-field" />,
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/nationality-field', () => ({
  NationalityField: () => <div data-testid="nationality-field" />,
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/birthday-field', () => ({
  BirthdayField: () => <div data-testid="birthday-field" />,
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/image-field', () => ({
  ImageField: () => <div data-testid="image-field" />,
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/team-select-field', () => ({
  TeamSelectField: ({ teams }: { teams: { id: string; name: string }[] }) => (
    <div
      data-testid="team-select-field"
      data-teams={teams.map((t) => t.name).join(',')}
    />
  ),
}));

vi.mock('@/app/admin/jugadores/(components)/form-fields/active-switch', () => ({
  ActiveSwitch: () => <div data-testid="active-switch" />,
}));

describe('Test on <FormFields />', () => {
  test('Should render all field components', () => {
    render(<FormFields teams={mockTeams} />);

    expect(screen.getByTestId('name-field')).toBeInTheDocument();
    expect(screen.getByTestId('email-field')).toBeInTheDocument();
    expect(screen.getByTestId('phone-field')).toBeInTheDocument();
    expect(screen.getByTestId('nationality-field')).toBeInTheDocument();
    expect(screen.getByTestId('birthday-field')).toBeInTheDocument();
    expect(screen.getByTestId('image-field')).toBeInTheDocument();
    expect(screen.getByTestId('team-select-field')).toBeInTheDocument();
    expect(screen.getByTestId('active-switch')).toBeInTheDocument();
  });

  test('Should pass the teams down to the team select field', () => {
    render(<FormFields teams={mockTeams} />);

    const teamsSelect = screen.getByTestId('team-select-field');

    expect(teamsSelect).toHaveAttribute(
      'data-teams',
      'Atlas,Chivas',
    );
  });

  test('Should render an empty list on the team select field when there are no teams', () => {
    render(<FormFields teams={[]} />);

    const teamsSelect = screen.getByTestId('team-select-field');

    expect(teamsSelect).toHaveAttribute('data-teams', '');
  });
});
