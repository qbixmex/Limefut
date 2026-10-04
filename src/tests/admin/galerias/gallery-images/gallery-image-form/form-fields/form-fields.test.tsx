import { render, screen } from '@testing-library/react';
import { GalleryImageFormFields } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields';

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/title-field', () => ({
  TitleField: () => <div data-testid="title-field" />,
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/image-field', () => ({
  ImageField: () => <div data-testid="image-field" />,
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/position-field', () => ({
  PositionField: () => <div data-testid="position-field" />,
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/active-field', () => ({
  ActiveField: () => <div data-testid="active-field" />,
}));

describe('Test on <GalleryImageFormFields />', () => {
  test('Should render the title field', () => {
    render(<GalleryImageFormFields />);

    const titleField = screen.getByTestId('title-field');

    expect(titleField).toBeInTheDocument();
  });

  test('Should render the image field', () => {
    render(<GalleryImageFormFields />);

    const imageField = screen.getByTestId('image-field');

    expect(imageField).toBeInTheDocument();
  });

  test('Should render the position field', () => {
    render(<GalleryImageFormFields />);

    const positionField = screen.getByTestId('position-field');

    expect(positionField).toBeInTheDocument();
  });

  test('Should render the active field', () => {
    render(<GalleryImageFormFields />);

    const activeField = screen.getByTestId('active-field');

    expect(activeField).toBeInTheDocument();
  });
});
