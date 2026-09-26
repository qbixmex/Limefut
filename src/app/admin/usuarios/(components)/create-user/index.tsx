import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/components/ui/button';
import { UserPlusIcon } from 'lucide-react';

export const CreateUser = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={ROUTES.ADMIN_USERS_CREATE}>
          <Button variant="outline-primary" size="icon">
            <UserPlusIcon />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
