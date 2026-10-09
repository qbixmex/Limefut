import PageDetailsPage from '@/app/admin/paginas/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/paginas/[id]/custom-page-details-view', () => ({
  CustomPageDetailsView: () => <div data-testid="custom-page-details-view" />,
}));

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';

describe('Test on <PageDetailsPage />', () => {
  test('Should render heading', async () => {
    const ServerComponent = await PageDetailsPage({
      params: Promise.resolve({ id: pageId }),
    });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/detalles de la página/i);
  });

  test('Should render <CustomPageDetailsView /> component', async () => {
    const ServerComponent = await PageDetailsPage({
      params: Promise.resolve({ id: pageId }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('custom-page-details-view')).toBeInTheDocument();
  });
});
