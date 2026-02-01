import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { HeroBanner } from '@/shared/interfaces';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { fetchHeroBannerAction } from '../(actions)';
import Image from "next/image";
import { getAlignmentTranslation } from '@/lib/utils';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const HeroBannerPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const pageId = (await params).id;

  const response = await fetchHeroBannerAction(session?.user?.roles ?? [], pageId);

  if (!response.ok) {
    redirect(`/admin/banners?error=${encodeURIComponent(response.message)}`);
  }

  const heroBanner = response.heroBanner as HeroBanner;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Detalles del Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col lg:flex-row gap-5 mb-10">
              <div className="w-full xl:w-1/2">
                <Image
                  src={heroBanner.imageUrl}
                  width={1024}
                  height={1024}
                  alt={heroBanner.title ?? 'Imagen del Banner'}
                  className="rounded w-full lg:max-w-[768px] m-auto"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Título</TableHead>
                      <TableCell className="text-gray-400 italic">
                        {heroBanner.title}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Descripción</TableHead>
                      <TableCell className="text-gray-400 italic">
                        <p className="text-pretty">{heroBanner.description}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Alineación</TableHead>
                      <TableCell className="text-gray-400 italic">
                        <p className="text-pretty">
                          {getAlignmentTranslation(heroBanner.dataAlignment)}
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Visibilidad de Información</TableHead>
                      <TableCell className="text-gray-400 italic">
                        <Badge variant={heroBanner.showData ? "outline-success" : 'outline-secondary'}>
                          {heroBanner.showData ? 'Visible' : 'Oculta'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Posición</TableHead>
                      <TableCell className="text-gray-300 italic">
                        {heroBanner.position}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Última actualización</TableHead>
                      <TableCell className="text-gray-300 italic">
                        {format(new Date(heroBanner.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-medium w-[180px]">Estado</TableHead>
                      <TableCell>
                        {
                          heroBanner.active
                            ? <Badge variant="outline-info">activo</Badge>
                            : <Badge variant="outline-secondary">desactivado</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/banners/editar/${heroBanner.id}`}>
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
