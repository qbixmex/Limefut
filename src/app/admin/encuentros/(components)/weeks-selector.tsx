import type { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp } from "lucide-react";

type Props = Readonly<{ weeks: number[] }>;

export const WeeksSelector: FC<Props> = ({ weeks }) => {
  const searchParams = useSearchParams();
  const sortWeek = searchParams.get('sortWeek');
  const pathname = usePathname();
  const router = useRouter();

  const setWeek = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortWeek', sort);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setWeek}
      value={sortWeek ?? undefined}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Semana" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Semana <ArrowUp /></SelectItem>
        <SelectItem value="desc">Semana <ArrowDown /></SelectItem>
        {
          (weeks.length > 0) && weeks.map((week) => (
              <SelectItem key={week} value={`${week}`}>
                Semana {week}
              </SelectItem>
            ))
        }
      </SelectContent>
    </Select>
  );
};
