import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';

type Props = Readonly<{ bannerId: string }>;

export const ShowBanner: FC<Props> = ({ bannerId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_BANNERS_SHOW(bannerId)}
          aria-label="Detalles del banner"
          className={
            buttonVariants({
              variant: 'outline-info',
              size: 'icon',
            })
          }
        >
          <InfoIcon role="img" aria-label="Icono de detalles" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
