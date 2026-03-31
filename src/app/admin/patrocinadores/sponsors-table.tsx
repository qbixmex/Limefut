import { type FC } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import type { Sponsor } from '@/shared/interfaces';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
// TODO: import { DeleteSponsor } from './delete-sponsor';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/shared/constants/routes';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { es } from 'date-fns/locale';
import { format } from 'date-fns/format';

type Props = Readonly<{
  query?: string;
  currentPage?: string;
}>;

const sponsors: Sponsor[] = [
  {
    id: '91a8f2d9-0eb5-4843-9272-25479985bd81',
    name: 'Powerade',
    imageUrl: 'https://cloudinary.com/powerade.webp',
    imagePublicId: 'ac035db3-322a-4e27-8025-338854fdf7e9',
    position: 'home-sidebar',
    startDate: new Date('2024-05-22T00:00:00.00Z'),
    endDate: new Date('2024-06-22T00:00:00.00Z'),
    clicks: 15,
    active: true,
    createdAt: new Date('2024-03-05T14:22:18.475Z'),
    updatedAt: new Date('2024-03-05T14:25:35.122Z'),
  },
  {
    id: '37256634-2786-4390-bc23-0aa5a0a51364',
    name: 'Gatorade',
    imageUrl: 'https://cloudinary.com/gatorade.webp',
    imagePublicId: '3d12b601-5dfa-47cb-8bfc-131d95e3cb6c',
    position: 'home-sidebar',
    // startDate: new Date('2024-08-15T00:00:00.00Z'),
    // endDate: new Date('2024-09-15T00:00:00.00Z'),
    clicks: 0,
    active: false,
    createdAt: new Date('2024-05-05T10:12:45.722Z'),
    updatedAt: new Date('2024-05-05T12:45:00.125Z'),
  },
];

const updateSponsorStateAction = async (_id: string, state: boolean) => {
  'use server';
  return Promise.resolve({
    ok: true,
    message: `Patrocinador ${state ? 'activado' : 'desactivado'} 👍`,
  });
};

const pagination = {
  totalPages: 1,
  currentPage: 1,
};

export const SponsorsTable: FC<Props> = async ({
  query = '',
  currentPage = 1,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // const {
  //   sponsors = [],
  //   pagination,
  // } = await fetchSponsorsAction({
  //   userRole: session?.user.roles ?? [],
  //   page: currentPage as number,
  //   take: 12,
  //   searchTerm: query,
  // });

  return (
    <>
      {sponsors.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-25 text-center">Posición</TableHead>
                  <TableHead className="w-25 text-center">Clicks</TableHead>
                  <TableHead className="w-25 text-center">Activo</TableHead>
                  <TableHead className="w-25 text-center">Fecha Inicial</TableHead>
                  <TableHead className="w-25 text-center">Fecha Final</TableHead>
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
                      <Badge variant="outline-info">
                        {sponsor.clicks}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <ActiveSwitch
                        resource={{ id: sponsor.id, state: sponsor.active }}
                        // TODO: updateResourceStateAction={updateSponsorStateAction}
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
                          <TooltipTrigger asChild>
                            <Link href={ROUTES.ADMIN_SPONSORS_SHOW(sponsor.id)}>
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
                            <Link href={ROUTES.ADMIN_SPONSORS_EDIT(sponsor.id)}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
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
