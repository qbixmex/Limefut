'use client';

import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createEmptyCustomPage } from '../../(actions)/createEmptyCustomPage';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';

export const CreatePage = () => {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { ok, message, pageId } = await createEmptyCustomPage();

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
    router.replace(ROUTES.ADMIN_CUSTOM_PAGES_EDIT(pageId as string));
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <form onSubmit={handleSubmit}>
          <Button
            variant="outline-primary"
            size="icon"
            aria-label="Crear borrador"
          >
            <Plus strokeWidth={3} aria-hidden="true" />
          </Button>
        </form>
      </TooltipTrigger>
      <TooltipContent side="top">crear borrador</TooltipContent>
    </Tooltip>
  );
};
