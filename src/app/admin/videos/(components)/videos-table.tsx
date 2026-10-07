import type { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSession } from '@/lib/get-session';
import { cn } from '@/lib/utils';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';
import { fetchVideosAction, updateVideoStateAction } from '../(actions)';
import { Pagination } from '@/shared/components/pagination';
import { DeleteVideo } from '../(components)/delete-video';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { ShowVideoDetails } from './show-video-details';
import { EditVideo } from './edit-video';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const VideosTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await getSession();

  const {
    videos = [],
    pagination,
  } = await fetchVideosAction({
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
                  <TableHead className="hidden lg:table-cell w-[150px]">Fecha de publicación</TableHead>
                  <TableHead className="hidden lg:table-cell w-[100px]">Plataforma</TableHead>
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
                      {video.platform}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <ActiveSwitch
                        resource={{ id: video.id as string, state: video.active }}
                        updateResourceStateAction={updateVideoStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <ShowVideoDetails videoId={video.id} />
                        <EditVideo videoId={video.id} />
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
          <div
            className={cn('flex justify-center mt-10', {
              hidden: pagination!.totalPages === 1,
            })}
          >
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <EmptyMessageResource>
          No hay videos disponibles
        </EmptyMessageResource>
      )}
    </>
  );
};
