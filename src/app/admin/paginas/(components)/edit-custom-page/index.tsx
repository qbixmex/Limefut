import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  pageId: string;
}>;

export const EditCustomPage: FC<Props> = ({ pageId }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={ROUTES.ADMIN_CUSTOM_PAGES_EDIT(pageId)}
          aria-label="Editar página personalizada"
        >
          <Button variant="outline-warning" size="icon">
            <Pencil aria-hidden="true" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">editar</TooltipContent>
    </Tooltip>
  );
};
