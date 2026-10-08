import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{ pageId: string }>;

export const ShowCustomPageDetails: FC<Props> = ({ pageId }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={ROUTES.ADMIN_CUSTOM_PAGES_SHOW(pageId)}
          aria-label="Ir a ver detalles de la página personalizada"
        >
          <Button variant="outline-info" size="icon">
            <InfoIcon aria-hidden="true" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
