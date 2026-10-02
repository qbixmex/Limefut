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
          className={
            buttonVariants({
              variant: 'outline-info',
              size: 'icon',
            })
          }
          aria-label="Detalles de la cancha"
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
