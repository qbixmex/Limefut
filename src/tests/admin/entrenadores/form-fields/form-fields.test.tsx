import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/entrenadores/(components)/form-fields';

vi.mock('@/app/admin/entrenadores/(components)/form-fields/name-field', () => ({
  NameField: () => <div data-testid="name-field" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/email-field', () => ({
  EmailField: () => <div data-testid="email-field" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/phone-field', () => ({
  PhoneField: () => <div data-testid="phone-field" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/image-field', () => ({
  ImageField: () => <div data-testid="image-field" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/nationality-field', () => ({
  NationalityField: () => <div data-testid="nationality-field" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/description-text-area', () => ({
  DescriptionTextArea: () => <div data-testid="description-text-area" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/age-field', () => ({
  AgeField: () => <div data-testid="age-field" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/form-fields/active-switch', () => ({
  ActiveSwitch: () => <div data-testid="active-switch" />,
}));

describe('Test on <FormFields />', () => {
  test('Should render all field components', () => {
    render(<FormFields />);

    expect(screen.getByTestId('name-field')).toBeInTheDocument();
    expect(screen.getByTestId('email-field')).toBeInTheDocument();
    expect(screen.getByTestId('phone-field')).toBeInTheDocument();
    expect(screen.getByTestId('image-field')).toBeInTheDocument();
    expect(screen.getByTestId('nationality-field')).toBeInTheDocument();
    expect(screen.getByTestId('description-text-area')).toBeInTheDocument();
    expect(screen.getByTestId('age-field')).toBeInTheDocument();
    expect(screen.getByTestId('active-switch')).toBeInTheDocument();
  });
});
