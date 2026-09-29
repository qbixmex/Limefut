import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { HeroBanner } from '@/shared/interfaces';
import type { ALIGNMENT_TYPE } from '@/shared/enums';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { fetchHeroBannerAction, updateHeroBannerStateAction } from '../(actions)';
import { BannerImage } from '@/shared/components/banner-image';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { ROUTES } from '@/shared/constants/routes';
import { BannerAlignment } from '../(components)/banner-alignment';
import { ShowDataSwitch } from '../(components)/show-data-switch';
import { EditBanner } from '../(components)/edit-banner';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const BannerView: FC<Props> = async ({ params }) => {
  const pageId = (await params).id;

  const response = await fetchHeroBannerAction(pageId);

  if (!response.ok || !response.heroBanner) {
    redirect(`${ROUTES.ADMIN_BANNERS}?error=${encodeURIComponent(response.message)}`);
  }

  const heroBanner = response.heroBanner as HeroBanner;

  return (
    <>
      <BannerImage
        title={heroBanner.title}
        description={heroBanner.description}
        imageUrl={heroBanner.imageUrl}
        dataAlignment={heroBanner.dataAlignment}
        showData={heroBanner.showData}
        className="rounded-lg"
        position={heroBanner.position}
      />
      <section className="flex flex-col lg:flex-row gap-5 mt-10">
        <div className="w-full xl:w-1/2">
          <Table aria-label="Ajustes del banner">
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
                    alignment={heroBanner.dataAlignment as ALIGNMENT_TYPE}
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
                          role="img"
                          aria-label="Ayuda sobre visibilidad de información"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Solo se mostrará la imagen</TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableCell className="text-gray-400 italic">
                  <ShowDataSwitch
                    bannerId={heroBanner.id}
                    showData={heroBanner.showData}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-full xl:w-1/2">
          <Table aria-label="Información del banner">
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
        <EditBanner bannerId={heroBanner.id} />
      </div>
    </>
  );
};
