import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/paginas/(components)/form-fields';

vi.mock('@/app/admin/noticias/(components)/form-fields/title-permalink-field', () => ({
  TitlePermalinkFields: () => <div data-testid="title-permalink-fields" />,
}));

vi.mock('@/app/admin/paginas/(components)/form-fields/content-text-area', () => ({
  ContentTextArea: () => <div data-testid="content-text-area" />,
}));

vi.mock('@/app/admin/paginas/(components)/form-fields/seo-title-field', () => ({
  SeoTitleField: () => <div data-testid="seo-title-field" />,
}));

vi.mock('@/app/admin/paginas/(components)/form-fields/seo-robots-select', () => ({
  SeoRobotsSelect: () => <div data-testid="seo-robots-select" />,
}));

vi.mock('@/app/admin/paginas/(components)/form-fields/seo-description-text-area', () => ({
  SeoDescriptionTextArea: () => <div data-testid="seo-description-text-area" />,
}));

vi.mock('@/app/admin/paginas/(components)/form-fields/status-select', () => ({
  StatusSelect: () => <div data-testid="status-select" />,
}));

vi.mock('@/app/admin/paginas/(components)/form-fields/position-field', () => ({
  PositionField: () => <div data-testid="position-field" />,
}));

const defaultProps = {
  pageId: '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21',
  updateContentImage: vi.fn(),
};

describe('Test on <FormFields />', () => {
  test('Should render the title and permalink fields', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('title-permalink-fields')).toBeInTheDocument();
  });

  test('Should render the content text area', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('content-text-area')).toBeInTheDocument();
  });

  test('Should render the SEO title field', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('seo-title-field')).toBeInTheDocument();
  });

  test('Should render the SEO robots select', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('seo-robots-select')).toBeInTheDocument();
  });

  test('Should render the SEO text-area field', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('seo-description-text-area')).toBeInTheDocument();
  });

  test('Should render status field', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('status-select')).toBeInTheDocument();
  });

  test('Should render the position field', () => {
    render(<FormFields {...defaultProps} />);

    expect(screen.getByTestId('position-field')).toBeInTheDocument();
  });
});
