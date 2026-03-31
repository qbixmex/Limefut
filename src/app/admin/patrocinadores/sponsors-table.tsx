import { type FC } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Pencil } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
// TODO: import { DeleteSponsor } from './delete-sponsor';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/shared/constants/routes';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { es } from 'date-fns/locale';
import { format } from 'date-fns/format';
import { fetchSponsorsAction, updateSponsorStateAction } from './(actions)';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

export const SponsorsTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const {
    sponsors = [],
    pagination,
  } = await fetchSponsorsAction({
    userRoles: session?.user.roles ?? [],
    page: currentPage as number,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {sponsors.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-25">Posición</TableHead>
                  <TableHead className="w-25">URL</TableHead>
                  <TableHead className="w-25 text-center">Clicks</TableHead>
                  <TableHead className="w-25 text-center">Activo</TableHead>
                  <TableHead className="w-25">Fecha Inicial</TableHead>
                  <TableHead className="w-25">Fecha Final</TableHead>
                  <TableHead className="w-50">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <p className="text-pretty">{sponsor.name}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline-info">
                        {sponsor.position}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {sponsor.url ?? <Badge variant="outline-secondary" />}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline-info">
                        {sponsor.clicks}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: sponsor.id, state: sponsor.active }}
                        updateResourceStateAction={updateSponsorStateAction}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {
                        sponsor.startDate
                          ? format(sponsor.startDate, 'dd / MMM / y', { locale: es }).toUpperCase()
                          : <Badge variant="outline-secondary">No establecida</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      {
                        sponsor.endDate
                          ? format(sponsor.endDate, 'dd / MMM / y', { locale: es }).toUpperCase()
                          : <Badge variant="outline-secondary">No establecida</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              href={ROUTES.ADMIN_SPONSORS_SHOW(sponsor.id)}
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
                              href={ROUTES.ADMIN_SPONSORS_EDIT(sponsor.id)}
                              className={buttonVariants({ variant: 'outline-warning', size: 'icon' })}
                            >
                              <Pencil />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* <DeleteSponsor
                            pageId={page.id as string}
                            roles={session?.user.roles as string[]}
                          /> */}
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
            No hay patrocinadores disponibles
          </p>
        </div>
      )}
    </>
  );
};
