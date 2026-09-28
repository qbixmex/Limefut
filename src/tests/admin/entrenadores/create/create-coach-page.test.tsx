import { render, screen } from '@testing-library/react';
import CreateCoachPage from '@/app/admin/entrenadores/crear/page';

vi.mock('@/app/admin/entrenadores/crear/create-coach-view', () => ({
  CreateCoachView: () => <div data-testid="create-coach-view" />,
}));

describe('Test on <CreateCoachPage />', () => {
  test('Should render title', () => {
    render(<CreateCoachPage />);

    const title = screen.getByText(/crear entrenador/i);

    expect(title).toBeInTheDocument();
  });

  test('Should render <CreateCoachView /> component', () => {
    render(<CreateCoachPage />);

    const createCoachView = screen.getByTestId('create-coach-view');

    expect(createCoachView).toBeInTheDocument();
  });
});
