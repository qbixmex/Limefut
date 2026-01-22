import type { FC } from 'react';
import { auth } from '@/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActiveSwitch } from '~/src/shared/components/active-switch';

import { Robots, type Page } from '~/src/shared/interfaces';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/src/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '~/src/components/ui/button';
import { InfoIcon, Pencil } from 'lucide-react';
import { updatePageStateAction } from '../(actions)/updatePageStateAction';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

const pages: Page[] = [
  {
    id: 'cf48cec6-d5ca-4e6d-a579-8783a4a547a0',
    title: '¿ Quienes Somos ?',
    permalink: 'quienes-somos',
    content: 'Somos una liga de fútbol infantil dedicada a fomentar el desarrollo integral de niños y jóvenes a través del deporte, la sana competencia y los valores que el fútbol transmite. Creemos firmemente que el fútbol es más que un juego: es una herramienta de aprendizaje, disciplina y trabajo en equipo que forma carácter y fortalece la amistad.',
    active: true,
    seoTitle: '¿ Quienes Somos ?',
    seoDescription: 'Somos una liga de fútbol infantil dedicada a fomentar el desarrollo integral de niños y jóvenes a través del deporte.',
    seoRobots: Robots.INDEX_FOLLOW,
  },
  {
    id: '2e2b010f-c16a-4903-804e-64abaafe3aa6',
    title: 'Reglamento de Juego',
    permalink: 'reglamento-de-juego',
    content: 'El reglamento de juego será vigente de la federación mexicana de futbol, salvo las siguientes adecuaciones:',
    active: true,
    seoTitle: 'Reglamento de Juego',
    seoDescription: 'El reglamento está basado en las reglas de FIFA.',
    seoRobots: Robots.NO_INDEX_NO_FOLLOW,
  },
];

export const PagesTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await auth();

  // const {
  //   galleries = [],
  //   pagination,
  // } = await fetchPagesAction({
  //   userRole: session?.user.roles ?? [],
  //   page: currentPage as number,
  //   take: 8,
  //   searchTerm: query,
  // });

  return (
    <>
      {pages.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Robots</TableHead>
                  <TableHead className="text-center">Activo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>
                      {page.seoRobots}
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: page.id as string, state: page.active }}
                        updateResourceStateAction={updatePageStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/galerias/${page.id}`}>
                              <Button variant="outline-info" size="icon">
                                <InfoIcon />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            detalles
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/paginas/editar/${page.id}`}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* <DeletePage
                          galleryId={gallery.id}
                          roles={session?.user.roles as string[]}
                        /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div> */}
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay páginas disponibles
          </p>
        </div>
      )}
    </>
  );
};

export default PagesTable;
