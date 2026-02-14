'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from "~/src/shared/enums";

export const StatusSelector = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const pathname = usePathname();
  const router = useRouter();

  const setStatus = (filter: MATCH_STATUS_TYPE) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', filter);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setStatus}
      value={status ?? ''}
    >
      <SelectTrigger>
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
        <SelectItem value={MATCH_STATUS.IN_PROGRESS}>En Progreso</SelectItem>
        <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
        <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
        <SelectItem value={MATCH_STATUS.COMPLETED}>Finalizado</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelector;
