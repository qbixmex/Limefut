'use client';

import type { FC } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type Props = Readonly<{ matchId: string; }>;

export const EditMatch: FC<Props> = ({ matchId }) => {
  const searchParams = useSearchParams();

  const getURL = () => {
    const params = new URLSearchParams(searchParams);
    const baseURL = `/admin/encuentros/editar/${matchId}`;
    
    if (params.has('torneo')) params.delete('torneo');

    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={getURL()}>
          <Button variant="outline-warning" size="icon">
            <Pencil />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        editar
      </TooltipContent>
    </Tooltip>
  );
};
