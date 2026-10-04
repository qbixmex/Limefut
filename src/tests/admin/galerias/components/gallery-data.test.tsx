import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { GalleryData } from '@/app/admin/galerias/(components)/gallery-data';
import { galleryMock, galleryInactiveMock } from '../mocks/gallery.mock';

const formatDate = (date: Date) =>
  format(date, "d 'de' MMMM 'del' yyyy", { locale: es });

describe('Test on <GalleryData /> component', () => {
  const renderComponent = (gallery = galleryMock) => {
    return render(<GalleryData gallery={gallery} />);
  };

  test('Should render information tables', () => {
    renderComponent();

    expect(screen.getAllByRole('table')).toHaveLength(2);
  });

  test('Should render all the row labels', () => {
    renderComponent();

    const title = screen.getByRole('columnheader', { name: /^título$/i });
    const date = screen.getByRole('columnheader', { name: /^fecha$/i });
    const permalink = screen.getByRole('columnheader', { name: /^enlace permanente$/i });
    const createdAt = screen.getByRole('columnheader', { name: /^fecha de creación$/i });
    const updatedAt = screen.getByRole('columnheader', { name: /^última actualización$/i });
    const status = screen.getByRole('columnheader', { name: /^estado$/i });

    expect(title).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(permalink).toBeInTheDocument();
    expect(createdAt).toBeInTheDocument();
    expect(updatedAt).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  });

  test('Should render the title and permalink', () => {
    renderComponent();

    const title = screen.getByRole('cell', { name: galleryMock.title });
    const permalink = screen.getByRole('cell', { name: galleryMock.permalink });

    expect(title).toBeInTheDocument();
    expect(permalink).toBeInTheDocument();
  });

  test('Should render the gallery date, creation date and last update date', () => {
    renderComponent();

    const galleryDate = screen.getByRole('cell', { name: formatDate(galleryMock.galleryDate) });
    const createdAt = screen.getByRole('cell', { name: formatDate(galleryMock.createdAt as Date) });
    const updatedAt = screen.getByRole('cell', { name: formatDate(galleryMock.updatedAt as Date) });

    expect(galleryDate).toBeInTheDocument();
    expect(createdAt).toBeInTheDocument();
    expect(updatedAt).toBeInTheDocument();
  });

  test('Should render the active badge when the gallery is active', () => {
    renderComponent(galleryMock);

    const activeStatus = screen.queryByRole('cell', { name: /^activa$/i });
    const unActiveStatus = screen.queryByRole('cell', { name: /^no activa$/i });

    expect(activeStatus).toBeInTheDocument();
    expect(unActiveStatus).not.toBeInTheDocument();
  });

  test('Should render the inactive badge when the gallery is not active', () => {
    renderComponent(galleryInactiveMock);

    const activeStatus = screen.queryByRole('cell', { name: /^activa$/i });
    const unActiveStatus = screen.queryByRole('cell', { name: /^no activa$/i });

    expect(activeStatus).not.toBeInTheDocument();
    expect(unActiveStatus).toBeInTheDocument();
  });
});
