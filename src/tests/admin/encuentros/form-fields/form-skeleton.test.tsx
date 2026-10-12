import { render, screen } from '@testing-library/react';
import { FormSkeleton } from '@/app/admin/encuentros/(components)/form-skeleton';

describe('Test on <FormSkeleton /> component', () => {
  test('Should render the loading status', () => {
    render(<FormSkeleton />);

    const skeleton = screen.getByRole('status', { name: /cargando formulario/i });

    expect(skeleton).toBeInTheDocument();
  });
});
