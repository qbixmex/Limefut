import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';

type Props = Readonly<{ userId: string }>;

export const EditUser: FC<Props> = ({ userId }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={ROUTES.ADMIN_USERS_EDIT(userId)}>
          <Button variant="outline-warning" size="icon">
            <Pencil />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>editar</p>
      </TooltipContent>
    </Tooltip>
  );
};
