import { render, screen } from '@testing-library/react';
import EditCoachPage from '@/app/admin/entrenadores/editar/[id]/page';

vi.mock('@/app/admin/entrenadores/editar/[id]/edit-coach-view', () => ({
  EditCoachPageView: () => <div data-testid="edit-coach-view" />,
}));

describe('Test on <EditCoachPage />', () => {
  const testId = '550e8400-e29b-41d4-a716-446655440001';

  test('Should render <EditCoachPageView /> component', () => {
    render(
      <EditCoachPage
        params={Promise.resolve({ id: testId })}
      />,
    );

    const editCoachView = screen.getByTestId('edit-coach-view');

    expect(editCoachView).toBeInTheDocument();
  });
});
