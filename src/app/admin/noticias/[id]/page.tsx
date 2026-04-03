import type { FC } from 'react';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { fetchAnnouncementAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { Badge } from '@/components/ui/badge';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const AnnouncementPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <AnnouncementContent params={params} />
    </Suspense>
  );
};

const AnnouncementContent: FC<Props> = async ({ params }) => {
  const sponsorId = (await params).id;
  const session = await auth.api.getSession({ headers: await headers() });

  const { ok, message, announcement } = await fetchAnnouncementAction(session?.user?.roles ?? [], sponsorId);

  if (!ok) {
    redirect(`${ROUTES.ADMIN_ANNOUNCEMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Detalles de la Noticia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap:5 lg:gap-10">
              <div className="flex-1">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Título</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {announcement?.title}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Enlace Permanente</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {announcement?.permalink}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Descripción</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <p className="text-balance">{announcement?.description}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de publicación</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {
                          announcement?.publishedDate?.toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) ?? 'No definido'
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Estado</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <Badge variant={announcement?.active ? 'outline-info' : 'outline-secondary'}>
                          {announcement?.active ? 'activo' : 'desactivado'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de creación</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {announcement?.updatedAt?.toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de actualización</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {announcement?.updatedAt?.toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className='flex-1'>
                <h2 className="text-xl text-blue-600 font-semibold">Contenido</h2>
                <p className="text-pretty">{announcement?.content}</p>
              </div>
            </div>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={ROUTES.ADMIN_ANNOUNCEMENTS_EDIT(announcement?.id as string)}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <span>editar</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementPage;
