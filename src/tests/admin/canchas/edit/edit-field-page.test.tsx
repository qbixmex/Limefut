import { render, screen } from '@testing-library/react';
import EditFieldPage from '@/app/admin/canchas/editar/[id]/page';

vi.mock('@/app/admin/canchas/editar/[id]/edit-field-view', () => ({
  EditFieldPageView: () => <div data-testid="edit-field-view" />,
}));

describe('Test on <EditFieldPage />', () => {
  const testId = '550e8400-e29b-41d4-a716-446655440001';

  test('Should render <EditFieldPageView /> component', () => {
    render(
      <EditFieldPage
        params={Promise.resolve({ id: testId })}
      />,
    );

    const editFieldView = screen.getByTestId('edit-field-view');

    expect(editFieldView).toBeInTheDocument();
  });
});
