import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';

type Props = Readonly<{ fieldId: string }>;

export const ShowField: FC<Props> = ({ fieldId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_FIELDS_SHOW(fieldId)}
          aria-label="Detalles de la cancha"
          className={
            buttonVariants({
              variant: 'outline-info',
              size: 'icon',
            })
          }
        >
          <InfoIcon
            role="img"
            aria-label="Icono de detalles"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
