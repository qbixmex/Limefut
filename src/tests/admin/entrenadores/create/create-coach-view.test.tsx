import { render, screen } from '@testing-library/react';
import { CreateCoachView } from '@/app/admin/entrenadores/crear/create-coach-view';

vi.mock('@/app/admin/entrenadores/crear/create-coach-form', () => ({
  CreateCoachForm: () => <div data-testid="create-coach-form" />,
}));

describe('Test on <CreateCoachView />', () => {
  test('Should render <CreateCoachForm /> component', async () => {
    const ServerComponent = await CreateCoachView();
    render(ServerComponent);

    const createCoachForm = screen.getByTestId('create-coach-form');

    expect(createCoachForm).toBeInTheDocument();
  });
});
