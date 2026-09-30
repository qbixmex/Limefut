import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/banners/(components)/form-fields';

vi.mock('@/app/admin/banners/(components)/form-fields/title-field', () => ({
  TitleField: () => <div data-testid="title-field" />,
}));

vi.mock('@/app/admin/banners/(components)/form-fields/image-field', () => ({
  ImageField: () => <div data-testid="image-field" />,
}));

vi.mock('@/app/admin/banners/(components)/form-fields/description-field', () => ({
  DescriptionField: () => <div data-testid="description-field" />,
}));

vi.mock('@/app/admin/banners/(components)/form-fields/alignment-field', () => ({
  AlignmentField: () => <div data-testid="alignment-field" />,
}));

vi.mock('@/app/admin/banners/(components)/form-fields/show-data-field', () => ({
  ShowDataField: () => <div data-testid="show-data-field" />,
}));

vi.mock('@/app/admin/banners/(components)/form-fields/position-field', () => ({
  PositionField: () => <div data-testid="position-field" />,
}));

vi.mock('@/app/admin/banners/(components)/form-fields/active-field', () => ({
  ActiveField: () => <div data-testid="active-field" />,
}));

describe('Test on <FormFields />', () => {
  test('Should render the default title field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('title-field')).toBeInTheDocument();
  });

  test('Should render the default image field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('image-field')).toBeInTheDocument();
  });

  test('Should render the default description field component', () => {
    render(<FormFields />);
    expect(screen.getByTestId('description-field')).toBeInTheDocument();
  });

  test('Should not render position field by default', () => {
    render(<FormFields />);
    expect(screen.queryByTestId('position-field')).not.toBeInTheDocument();
  });

  test('Should not render active field by default', () => {
    render(<FormFields />);
    expect(screen.queryByTestId('active-field')).not.toBeInTheDocument();
  });

  test('Should render position field when showMetaFields is true', () => {
    render(<FormFields showMetaFields />);
    expect(screen.getByTestId('position-field')).toBeInTheDocument();
  });

  test('Should render active fields when showMetaFields is true', () => {
    render(<FormFields showMetaFields />);
    expect(screen.getByTestId('active-field')).toBeInTheDocument();
  });
});
