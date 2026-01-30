'use client';

import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createEmptyCustomPage } from "../(actions)/createEmptyCustomPage";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
    router.replace(`/admin/paginas/editar/${pageId}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <form onSubmit={handleSubmit}>
          <Button variant="outline-primary" size="icon">
            <Plus strokeWidth={3} />
          </Button>
        </form>
      </TooltipTrigger>
      <TooltipContent side="top">crear borrador</TooltipContent>
    </Tooltip>
  );
};
