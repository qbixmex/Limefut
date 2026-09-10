import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{ userId: string }>;

export const ShowProfile: FC<Props> = ({ userId }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={ROUTES.ADMIN_USERS_SHOW(userId)}>
          <Button variant="outline-info" size="icon">
            <User />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>perfil</p>
      </TooltipContent>
    </Tooltip>
  );
};
