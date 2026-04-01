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
import { fetchSponsorAction } from '../(actions)';
import { ROUTES } from '@/shared/constants/routes';
import { getAlignment } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const HeroBannerPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <HeroBannerContent params={params} />
    </Suspense>
  );
};

const HeroBannerContent: FC<Props> = async ({ params }) => {
  const sponsorId = (await params).id;
  const session = await auth.api.getSession({ headers: await headers() });

  const { ok, message, sponsor } = await fetchSponsorAction(session?.user?.roles ?? [], sponsorId);

  if (!ok) {
    redirect(`/admin/banners?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Detalles del Patrocinador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="w-full md:w-[400px] flex justify-center lg:justify-start mb-5">
                <Image
                  src={sponsor?.imageUrl as string}
                  alt={`${sponsor?.name} Patrocinador`}
                  width={300}
                  height={500}
                  className="rounded"
                />
              </div>
              <div className="w-full">
                <Table className="md:lg:3/4 lg:w-1/2">
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Nombre</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {sponsor?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">URL</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {sponsor?.url}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha Inicial</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {
                          sponsor?.startDate?.toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) ?? 'No definido'
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha Final</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {
                          sponsor?.endDate?.toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) ?? 'No definido'
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Alineación</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <Badge variant="outline-info">
                          {getAlignment(sponsor?.alignment as string)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Posición</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <Badge variant="outline-info">
                          {sponsor?.position}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Clicks</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <Badge variant="outline-info">
                          {sponsor?.clicks}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Estado</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <Badge variant={sponsor?.active ? 'outline-info' : 'outline-secondary'}>
                          {sponsor?.active ? 'activo' : 'desactivado'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de creación</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {sponsor?.updatedAt?.toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Fecha de actualización</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {sponsor?.updatedAt?.toLocaleDateString('es-MX', {
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
                <TooltipTrigger asChild>
                  <Link href={ROUTES.ADMIN_SPONSORS_EDIT(sponsor?.id as string)}>
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

export default HeroBannerPage;
