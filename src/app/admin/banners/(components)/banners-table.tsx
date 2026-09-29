'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/lib/utils';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { Badge } from '@/components/ui/badge';
import { PiFlagBannerFoldBold as BannerFlag } from 'react-icons/pi';
import { EmptyMessageResource } from '@/shared/components/empty-message-resource';
import { ROUTES } from '@/shared/constants/routes';
import { updateHeroBannerStateAction } from '../(actions)';
import type { HeroBannerListItem } from '../(actions)/fetch-hero-banners.action';
import { DeleteBanner } from './delete-banner';
import { EditBanner } from './edit-banner';
import { ShowBanner } from './show-banner';

type Props = Readonly<{
  banners: HeroBannerListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  roles: string[];
}>;

export const BannersTable: FC<Props> = ({ banners, pagination, roles }) => {
  return (
    <>
      {banners.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Table aria-label="Lista de banners">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] hidden lg:table-cell">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-25 text-center">Información</TableHead>
                  <TableHead className="w-25 text-center">Posición</TableHead>
                  <TableHead className="w-25 hidden lg:table-cell text-center">Activo</TableHead>
                  <TableHead className="w-40">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="hidden lg:table-cell">
                      <Link
                        href={ROUTES.ADMIN_BANNERS_SHOW(banner.id)}
                        aria-label={`Detalles del banner ${banner.title}`}
                      >
                        {
                          !banner.imageUrl ? (
                            <figure className="w-50 h-25 border border-gray-400 dark:border-0 dark:bg-gray-800 size-[60px] rounded-lg flex items-center justify-center">
                              <BannerFlag size={50} className="text-gray-400" role="img" aria-label="Icono de banner" />
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
                      {banner.title}
                    </TableCell>
                    <TableCell className="text-xl font-semibold italic text-gray-200 text-center">
                      <Badge variant="outline-info">
                        {banner.showData ? 'visible' : 'oculta'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
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
                        <ShowBanner bannerId={banner.id} />
                        <EditBanner bannerId={banner.id} />
                        <DeleteBanner bannerId={banner.id} roles={roles} />
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
          Aún no hay banners creados
        </EmptyMessageResource>
      )}
    </>
  );
};
