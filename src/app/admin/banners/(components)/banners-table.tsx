import type { FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, InfoIcon } from "lucide-react";
import { fetchHeroBannersAction, updateHeroBannerStateAction } from "../(actions)";
import { auth } from '@/auth';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { Badge } from '@/components/ui/badge';
import { PiFlagBannerFoldBold as BannerFlag } from "react-icons/pi";
import { DeleteHeroBanner } from './delete-hero-banner';

type Props = Readonly<{
  query: string;
  currentPage: number;
}>;

export const HeroBannersTable: FC<Props> = async ({ query, currentPage }) => {
  const session = await auth();
  const {
    heroBanners = [],
    pagination = {
      currentPage: 1,
      totalPages: 1,
    },
  } = await fetchHeroBannersAction({
    page: currentPage,
    take: 12,
    searchTerm: query,
  });

  return (
    <>
      {heroBanners && heroBanners.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] hidden lg:table-cell">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-25 text-center">Posición</TableHead>
                  <TableHead className="w-25 hidden lg:table-cell text-center">Activo</TableHead>
                  <TableHead className="w-40">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heroBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="hidden lg:table-cell">
                      <Link href={`/admin/banners/${banner.id}`}>
                        {
                          !banner.imageUrl ? (
                            <figure className="w-50 h-25 border border-gray-400 dark:border-0 dark:bg-gray-800 size-[60px] rounded-lg flex items-center justify-center">
                              <BannerFlag size={50} className="text-gray-400" />
                            </figure>
                          ) : (
                            <Image
                              src={banner.imageUrl}
                              alt={banner.title}
                              width={200}
                              height={200}
                              className="w-50 h-25 rounded-xl object-cover"
                            />
                          )
                        }
                      </Link>
                    </TableCell>
                    <TableCell className="text-xl font-semibold italic text-gray-200">
                      {banner.title ?? 'No definido'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline-primary">{banner.position}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <ActiveSwitch
                        resource={{ id: banner.id, state: banner.active }}
                        updateResourceStateAction={updateHeroBannerStateAction}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/banners/${banner.id}`}>
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
                            <Link href={`/admin/banners/editar/${banner.id}`}>
                              <Button variant="outline-warning" size="icon">
                                <Pencil />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteHeroBanner
                          heroBannerId={banner.id}
                          roles={session?.user.roles as string[]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={cn("flex justify-center mt-10", {
            'hidden': pagination!.totalPages === 1,
          })}>
            <Pagination totalPages={pagination!.totalPages as number} />
          </div>
        </div>
      ) : (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay banners
          </p>
        </div>
      )}
    </>
  );
};

export default HeroBannersTable;
