import type { FC } from 'react';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { fetchVideoAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { Badge } from '@/components/ui/badge';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const VideoPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <AnnouncementContent params={params} />
    </Suspense>
  );
};

const AnnouncementContent: FC<Props> = async ({ params }) => {
  const sponsorId = (await params).id;
  const session = await auth.api.getSession({ headers: await headers() });

  const { ok, message, video } = await fetchVideoAction(session?.user?.roles ?? [], sponsorId);

  if (!ok) {
    redirect(`${ROUTES.ADMIN_VIDEOS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Detalles del Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap:5 lg:gap-10 mb-5">
              <div className="flex-1">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Título</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {video?.title}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Enlace Permanente</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {video?.permalink}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Descripción</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <p className="text-balance">{video?.description}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de publicación</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {
                          video?.publishedDate?.toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) ?? 'No definido'
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className='flex-1'>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Plataforma</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {video?.platform}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Estado</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <Badge variant={video?.active ? 'outline-info' : 'outline-secondary'}>
                          {video?.active ? 'activo' : 'desactivado'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de creación</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {video?.updatedAt?.toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de actualización</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {video?.updatedAt?.toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={ROUTES.ADMIN_VIDEOS_EDIT(video?.id as string)}
                    className={buttonVariants({
                      variant: 'outline-warning',
                      size: 'icon',
                    })}
                  >
                    <Pencil />
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

export default VideoPage;
