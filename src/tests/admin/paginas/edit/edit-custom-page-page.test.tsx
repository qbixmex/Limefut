import EditCustomPagePage from '@/app/admin/paginas/editar/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/paginas/editar/[id]/edit-custom-page-view', () => ({
  EditCustomPageView: () => <div data-testid="edit-custom-page-view" />,
}));

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';

describe('Test on <EditCustomPagePage />', () => {
  test('Should render heading', () => {
    render(<EditCustomPagePage params={Promise.resolve({ id: pageId })} />);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/editar página/i);
  });

  test('Should render <EditCustomPageView /> component', () => {
    render(<EditCustomPagePage params={Promise.resolve({ id: pageId })} />);

    const componentView = screen.getByTestId('edit-custom-page-view');

    expect(componentView).toBeInTheDocument();
  });
});
