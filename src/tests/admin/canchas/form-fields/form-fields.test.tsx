import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/canchas/(components)/form-fields';

vi.mock('@/app/admin/canchas/(components)/form-fields/name-permalink-fields', () => ({
  NamePermalinkFields: () => <div data-testid="name-permalink-fields" />,
}));

vi.mock('@/app/admin/canchas/(components)/form-fields/city-field', () => ({
  CityField: () => <div data-testid="city-field" />,
}));

vi.mock('@/app/admin/canchas/(components)/form-fields/state-field', () => ({
  StateField: () => <div data-testid="state-field" />,
}));

vi.mock('@/app/admin/canchas/(components)/form-fields/country-field', () => ({
  CountryField: () => <div data-testid="country-field" />,
}));

vi.mock('@/app/admin/canchas/(components)/form-fields/address-field', () => ({
  AddressField: () => <div data-testid="address-field" />,
}));

vi.mock('@/app/admin/canchas/(components)/form-fields/map-field', () => ({
  MapField: () => <div data-testid="map-field" />,
}));

describe('Test on <FormFields />', () => {
  test('Should render name-permalink component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('name-permalink-fields')).toBeInTheDocument();
  });

  test('Should render city field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('city-field')).toBeInTheDocument();
  });

  test('Should render state field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('state-field')).toBeInTheDocument();
  });

  test('Should render country field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('country-field')).toBeInTheDocument();
  });

  test('Should render address field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('address-field')).toBeInTheDocument();
  });

  test('Should render map field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('map-field')).toBeInTheDocument();
  });
});
