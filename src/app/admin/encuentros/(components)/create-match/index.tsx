'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const CreateMatch = () => {
  const searchParams = useSearchParams();
  
  const getURL = () => {
    const params = new URLSearchParams(searchParams);
    const baseURL = '/admin/encuentros/crear';

    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={getURL()}>
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
