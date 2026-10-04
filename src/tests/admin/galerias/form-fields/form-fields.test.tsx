import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/galerias/(components)/form-fields';

vi.mock('@/app/admin/galerias/(components)/form-fields/title-field', () => ({
  TitleField: () => <div data-testid="title-field" />,
}));

vi.mock('@/app/admin/galerias/(components)/form-fields/permalink-field', () => ({
  PermalinkField: () => <div data-testid="permalink-field" />,
}));

vi.mock('@/app/admin/galerias/(components)/form-fields/gallery-date-field', () => ({
  GalleryDateField: () => <div data-testid="gallery-date-field" />,
}));

vi.mock('@/app/admin/galerias/(components)/form-fields/active-field', () => ({
  ActiveField: () => <div data-testid="active-field" />,
}));

describe('Test on <FormFields />', () => {
  test('Should render title field', () => {
    render(<FormFields />);
    expect(screen.getByTestId('title-field')).toBeInTheDocument();
  });

  test('Should render permalink field', () => {
    render(<FormFields />);
    expect(screen.getByTestId('permalink-field')).toBeInTheDocument();
  });

  test('Should render gallery date field', () => {
    render(<FormFields />);
    expect(screen.getByTestId('gallery-date-field')).toBeInTheDocument();
  });

  test('Should render active field', () => {
    render(<FormFields />);
    expect(screen.getByTestId('active-field')).toBeInTheDocument();
  });
});
