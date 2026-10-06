vi.mock('@/app/admin/noticias/(components)/form-fields/title-permalink-field', () => ({
  TitlePermalinkFields: () => <div data-testid="title-permalink-field" />,
}));

vi.mock('@/app/admin/noticias/(components)/form-fields/published-date-field', () => ({
  PublishedDateField: () => <div data-testid="published-date-field" />,
}));

vi.mock('@/app/admin/noticias/(components)/form-fields/description-field', () => ({
  DescriptionField: () => <div data-testid="description-field" />,
}));

vi.mock('@/app/admin/noticias/(components)/form-fields/content-field', () => ({
  ContentField: () => <div data-testid="content-field" />,
}));

vi.mock('@/app/admin/noticias/(components)/form-fields/image-field', () => ({
  ImageField: () => <div data-testid="image-field" />,
}));

vi.mock('@/app/admin/noticias/(components)/form-fields/active-field', () => ({
  ActiveField: () => <div data-testid="active-field" />,
}));

import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/noticias/(components)/form-fields';

describe('Test on <FormFields />', () => {
  test('Should render the title and permalink fields', () => {
    render(<FormFields />);
    const titleField = screen.getByTestId('title-permalink-field');
    expect(titleField).toBeInTheDocument();
  });

  test('Should render the published date field', () => {
    render(<FormFields />);
    const publishedDateField = screen.getByTestId('published-date-field');
    expect(publishedDateField).toBeInTheDocument();
  });

  test('Should render the description field', () => {
    render(<FormFields />);
    const descriptionField = screen.getByTestId('description-field');
    expect(descriptionField).toBeInTheDocument();
  });

  test('Should render the content field', () => {
    render(<FormFields />);
    const contentField = screen.getByTestId('content-field');
    expect(contentField).toBeInTheDocument();
  });

  test('Should render the image field', () => {
    render(<FormFields />);
    const imageField = screen.getByTestId('image-field');
    expect(imageField).toBeInTheDocument();
  });

  test('Should render the active field', () => {
    render(<FormFields />);
    const activeField = screen.getByTestId('active-field');
    expect(activeField).toBeInTheDocument();
  });
});
