import { type FC } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ALIGNMENT, HeroBanner } from '@/shared/interfaces';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { fetchHeroBannerAction, updateHeroBannerStateAction } from '../(actions)';
import { BannerImage } from '@/shared/components/banner-image';
import { ActiveSwitch } from '~/src/shared/components/active-switch';
import { updateHeroBannerShowDataAction } from '../(actions)/updateHeroBannerShowDataAction';
import { BannerAlignment } from '../(components)/banner-alignment';
import { CircleQuestionMarkIcon } from "lucide-react";

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
            <BannerImage
              title={heroBanner.title}
              description={heroBanner.description}
              imageUrl={heroBanner.imageUrl}
              dataAlignment={heroBanner.dataAlignment}
              showData={heroBanner.showData}
              className="rounded-lg"
            />
            <section className="flex flex-col lg:flex-row gap-5 mt-10">
              <div className="w-full xl:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Título</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        {heroBanner.title}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Descripción</TableHead>
                      <TableCell className="dark:text-gray-400 italic">
                        <p className="text-wrap">{heroBanner.description}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">Alineación</TableHead>
                      <TableCell>
                        <BannerAlignment
                          bannerId={heroBanner.id}
                          alignment={heroBanner.dataAlignment as ALIGNMENT}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="font-semibold w-[180px]">
                        <div className="inline-flex justify-around gap-1 text-wrap py-5">
                          <span>Visibilidad de Información</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <CircleQuestionMarkIcon
                                className="stroke-gray-600 -mt-5"
                                size={18}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Solo se mostrará la imagen</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableHead>
                      <TableCell className="text-gray-400 italic">
                        <ActiveSwitch
                          resource={{ id: heroBanner.id, state: heroBanner.showData }}
                          updateResourceStateAction={updateHeroBannerShowDataAction}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="w-full xl:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="font-medium w-[180px]">
                        Visibilidad del banner
                      </TableHead>
                      <TableCell>
                        <div className="inline-flex items-center gap-2">
                          <ActiveSwitch
                            resource={{ id: heroBanner.id, state: heroBanner.active }}
                            updateResourceStateAction={updateHeroBannerStateAction}
                          />
                          <span className="dark:text-gray-300 italic">
                            {heroBanner.active ? 'visible' : 'oculto'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">Posición</TableHead>
                      <TableCell className="text-gray-300 italic">
                        <Badge variant="outline-info">
                          {heroBanner.position}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[180px] font-semibold">
                        <p className="text-wrap">Última actualización</p>
                      </TableHead>
                      <TableCell className="dark:text-gray-300 italic">
                        {format(new Date(heroBanner.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
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
