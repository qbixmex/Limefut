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
          className={
            buttonVariants({
              variant: 'outline-info',
              size: 'icon',
            })
          }
          aria-label="Detalles del banner"
        >
          <InfoIcon aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
