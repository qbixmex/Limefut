import type { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSession } from '@/lib/get-session';
import { cn } from '@/lib/utils';
import { Pagination } from '@/shared/components/pagination';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';
import { fetchAnnouncementsAction, updateAnnouncementStateAction } from '../(actions)';
import { DeleteAnnouncement } from '../(components)/delete-announcement';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import { ShowAnnouncementDetails } from './show-announcement-details';
import { EditAnnouncement } from './edit-announcement';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const AnnouncementsTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await getSession();

  const {
    announcements = [],
    pagination,
  } = await fetchAnnouncementsAction({
    page: currentPage as number,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {announcements.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table aria-label="Lista de noticias">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Título</TableHead>
                  <TableHead className="hidden lg:table-cell w-[120px]">Fecha de publicación</TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px] text-center">Activo</TableHead>
                  <TableHead className="w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <p className="text-pretty">{announcement.title}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="text-pretty">
                        {format(announcement.publishedDate, "d 'de' MMMM 'del' y", { locale: es })}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <ActiveSwitch
                        resource={{ id: announcement.id, state: announcement.active }}
                        updateResourceStateAction={updateAnnouncementStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <ShowAnnouncementDetails announcementId={announcement.id} />
                        <EditAnnouncement announcementId={announcement.id} />
                        <DeleteAnnouncement
                          announcementId={announcement.id as string}
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
          No hay noticias disponibles
        </EmptyMessageResource>
      )}
    </>
  );
};
