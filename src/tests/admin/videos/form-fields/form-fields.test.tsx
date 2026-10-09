vi.mock('@/app/admin/videos/(components)/form-fields/title-field', () => ({
  TitleField: () => <div data-testid="title-field" />,
}));

vi.mock('@/app/admin/videos/(components)/form-fields/permalink-field', () => ({
  PermalinkField: () => <div data-testid="permalink-field" />,
}));

vi.mock('@/app/admin/videos/(components)/form-fields/url-field', () => ({
  UrlField: () => <div data-testid="url-field" />,
}));

vi.mock('@/app/admin/videos/(components)/form-fields/description-text-area', () => ({
  DescriptionTextArea: () => <div data-testid="description-text-area" />,
}));

vi.mock('@/app/admin/videos/(components)/form-fields/platform-select-field', () => ({
  PlatformSelectField: () => <div data-testid="platform-select-field" />,
}));

vi.mock('@/app/admin/videos/(components)/form-fields/published-date-field', () => ({
  PublishedDateField: () => <div data-testid="published-date-field" />,
}));

vi.mock('@/app/admin/videos/(components)/form-fields/active-video-switch', () => ({
  ActiveVideoSwitch: () => <div data-testid="active-video-switch" />,
}));

import { render, screen } from '@testing-library/react';
import { FormFields } from '@/app/admin/videos/(components)/form-fields';

describe('Test on <FormFields />', () => {
  test('Should render the title field', () => {
    render(<FormFields />);
    const titleField = screen.getByTestId('title-field');
    expect(titleField).toBeInTheDocument();
  });

  test('Should render the permalink field', () => {
    render(<FormFields />);
    const permalinkField = screen.getByTestId('permalink-field');
    expect(permalinkField).toBeInTheDocument();
  });

  test('Should render the url field', () => {
    render(<FormFields />);
    const urlField = screen.getByTestId('url-field');
    expect(urlField).toBeInTheDocument();
  });

  test('Should render the description text area', () => {
    render(<FormFields />);
    const descriptionTextArea = screen.getByTestId('description-text-area');
    expect(descriptionTextArea).toBeInTheDocument();
  });

  test('Should render the platform select field', () => {
    render(<FormFields />);
    const platformSelectField = screen.getByTestId('platform-select-field');
    expect(platformSelectField).toBeInTheDocument();
  });

  test('Should render the published date field', () => {
    render(<FormFields />);
    const publishedDateField = screen.getByTestId('published-date-field');
    expect(publishedDateField).toBeInTheDocument();
  });

  test('Should render the active video switch', () => {
    render(<FormFields />);
    const activeVideoSwitch = screen.getByTestId('active-video-switch');
    expect(activeVideoSwitch).toBeInTheDocument();
  });
});
