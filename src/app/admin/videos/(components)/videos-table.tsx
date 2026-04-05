import { type FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Pagination } from '@/shared/components/pagination';
import { ROUTES } from '@/shared/constants/routes';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';
import { InfoIcon, Pencil } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { fetchVideosAction, updateVideoStateAction } from '../(actions)';
import { DeleteVideo } from '../(components)/delete-video';
import { ActiveSwitch } from '@/shared/components/active-switch';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const VideosTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    videos = [],
    pagination,
  } = await fetchVideosAction({
    userRoles: session?.user.roles ?? [],
    page: currentPage as number,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {videos.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Título</TableHead>
                  <TableHead className="hidden lg:table-cell">Fecha de publicación</TableHead>
                  <TableHead className="hidden lg:table-cell w-[160px]">url</TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px] text-center">Activo</TableHead>
                  <TableHead className="w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <p className="text-pretty">{video.title}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="text-pretty">
                        {format(video.publishedDate, "d 'de' MMMM 'del' y", { locale: es })}
                      </p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {video.url}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <ActiveSwitch
                        resource={{ id: video.id as string, state: video.active }}
                        updateResourceStateAction={updateVideoStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              href={ROUTES.ADMIN_VIDEOS_SHOW(video.id as string)}
                              className={buttonVariants({ variant: 'outline-info', size: 'icon' })}
                            >
                              <InfoIcon />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            detalles
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              href={ROUTES.ADMIN_VIDEOS_EDIT(video.id as string)}
                              className={buttonVariants({ variant: 'outline-warning', size: 'icon' })}
                            >
                              <Pencil />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteVideo
                          videoId={video.id as string}
                          roles={session?.user.roles as string[]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={cn('flex justify-center mt-10', {
            hidden: pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay videos disponibles
          </p>
        </div>
      )}
    </>
  );
};
