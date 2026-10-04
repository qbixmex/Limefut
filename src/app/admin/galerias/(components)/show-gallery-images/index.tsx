import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { ImagesIcon } from 'lucide-react';

type Props = Readonly<{ galleryId: string }>;

export const ShowGalleryImages: FC<Props> = ({ galleryId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_GALLERIES_SHOW(galleryId)}
          className={buttonVariants({
            variant: 'outline-info',
            size: 'icon',
          })}
          aria-label="Ver imágenes de la galería"
        >
          <ImagesIcon aria-hidden />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">imágenes</TooltipContent>
    </Tooltip>
  );
};
