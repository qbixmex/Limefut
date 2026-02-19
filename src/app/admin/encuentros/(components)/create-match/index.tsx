'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const CreateMatch = () => {
  const params = useSearchParams();
  const tournamentId = params.get('torneo');
  const baseURL = '/admin/encuentros/crear';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={!tournamentId ? baseURL : `${baseURL}?torneo=${tournamentId}`}>
          <Button variant="outline-primary" size="icon">
            <Plus strokeWidth={3} />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
