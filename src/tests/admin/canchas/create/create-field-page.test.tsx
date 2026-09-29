import { render, screen } from '@testing-library/react';
import CreateFieldPage from '@/app/admin/canchas/crear/page';

vi.mock('@/app/admin/canchas/crear/create-field-form', () => ({
  CreateFieldForm: () => <div data-testid="create-field-form" />,
}));

describe('Test on <CreateFieldPage />', () => {
  test('Should render title', () => {
    render(<CreateFieldPage />);

    const title = screen.getByRole('heading', { name: /título/i });

    expect(title).toHaveTextContent(/crear cancha/i);
  });

  test('Should render <CreateFieldForm /> component', () => {
    render(<CreateFieldPage />);

    const createFieldForm = screen.getByTestId('create-field-form');

    expect(createFieldForm).toBeInTheDocument();
  });
});
