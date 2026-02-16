'use client';

import type { FC } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tournament } from "~/src/shared/interfaces";

type Props = Readonly<{
  tournaments: Partial<Tournament>[];
}>;

export const TournamentsSelector: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get('torneo');
  const pathname = usePathname();
  const router = useRouter();

  const setTournamentParam = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (!params.has('torneo') || value.length > 0) {
      params.set('torneo', value);
      router.push(`${pathname}?${params}`);
    }
  };

  return (
    <Select
      onValueChange={setTournamentParam}
      value={tournamentId ?? ""}
    >
      <SelectTrigger className="w-full max-w-[400px]">
        <SelectValue placeholder="¡ Seleccione una opción !" />
      </SelectTrigger>
      <SelectContent>
        {tournaments.map((tournament) => (
          <SelectItem
            key={tournament.id}
            value={tournament.id!}
          >
            {tournament.name}, {tournament.category}, {tournament.format} vs {tournament.format}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TournamentsSelector;
