import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';

type Props = Readonly<{ fieldId: string }>;

export const EditField: FC<Props> = ({ fieldId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_FIELD_EDIT(fieldId)}
          aria-label="Editar cancha"
          className={
            buttonVariants({
              variant: 'outline-warning',
              size: 'icon',
            })
          }
        >
          <Pencil role="img" aria-label="Icono de lápiz" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        editar
      </TooltipContent>
    </Tooltip>
  );
};
