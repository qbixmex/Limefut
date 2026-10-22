import { render, screen } from '@testing-library/react';
import { FieldsMap } from '@/shared/components/fields-map';
import type { ResolvedFieldMap } from '@/lib/maps';

const buildMap = (overrides: Partial<ResolvedFieldMap> = {}): ResolvedFieldMap => ({
  id: 'field-1',
  name: 'Cancha Norte',
  link: 'https://maps.app.goo.gl/link-a',
  embedUrl: 'https://www.google.com/maps?q=20.11,-103.11&z=16&output=embed',
  ...overrides,
});

describe('Tests on <FieldsMap />', () => {
  test('Should show the empty message when there are no maps', () => {
    render(<FieldsMap maps={[]} />);

    expect(screen.getByText('Canchas')).toBeInTheDocument();
    expect(screen.getByText('No hay canchas asignadas')).toBeInTheDocument();
    expect(screen.queryByTitle('Cancha Norte')).not.toBeInTheDocument();
  });

  test('Should show a single map without the two column grid', () => {
    const { container } = render(<FieldsMap maps={[buildMap()]} />);

    expect(screen.getByText('Cancha')).toBeInTheDocument();
    expect(screen.getByTitle('Cancha Norte')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-2')).not.toBeInTheDocument();
  });

  test('Should show two maps in a two column grid', () => {
    const { container } = render(
      <FieldsMap
        maps={[buildMap(), buildMap({ id: 'field-2', name: 'Cancha Sur' })]}
      />,
    );

    expect(screen.getByText('Canchas')).toBeInTheDocument();
    expect(screen.getByTitle('Cancha Norte')).toBeInTheDocument();
    expect(screen.getByTitle('Cancha Sur')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
  });

  test('Should render the admin variant with its own spacing', () => {
    const { container } = render(
      <FieldsMap maps={[buildMap()]} variant="admin" className="mt-10 mb-10" />,
    );

    const section = container.firstElementChild;

    expect(section).toHaveClass('mt-10', 'mb-10');
    expect(screen.getByText('Cancha')).toHaveClass('text-xl', 'text-sky-600');
  });

  test('Should render a link when there is no embed URL', () => {
    render(<FieldsMap maps={[buildMap({ embedUrl: null })]} />);

    const link = screen.getByRole('link', {
      name: 'Ver ubicación en Google Maps',
    });

    expect(link).toHaveAttribute('href', 'https://maps.app.goo.gl/link-a');
  });

  test('Should show the empty message in the admin variant too', () => {
    render(<FieldsMap maps={[]} variant="admin" />);

    expect(screen.getByText('No hay canchas asignadas')).toBeInTheDocument();
  });
});
