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

type Props = Readonly<{
  tournaments: {
    id: string;
    name: string;
  }[];
}>;

export const TournamentsSelector: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentPermalink = searchParams.get('torneo');
  const pathname = usePathname();
  const router = useRouter();

  const setTournamentPermalinkParam = (permalink: string) => {
    const params = new URLSearchParams();
    params.set('torneo', permalink);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setTournamentPermalinkParam}
      value={tournamentPermalink ?? ""}
    >
      <SelectTrigger className="w-full max-w-[400px]">
        <SelectValue placeholder="¡ Seleccione una opción !" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sin torneo asignado</SelectItem>
        {tournaments.map((tournament) => (
          <SelectItem
            key={tournament.id}
            value={tournament.id}
          >
            {tournament.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TournamentsSelector;
