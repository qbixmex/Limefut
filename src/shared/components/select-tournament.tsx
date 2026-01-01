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
import type { TournamentType } from "~/src/shared/actions/fetchTournamentsAction";

type Props = Readonly<{
  tournaments: TournamentType[];
}>;

export const SelectTournament: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get('torneo');
  const pathname = usePathname();
  const router = useRouter();

  const setTournamentIdParam = (tournamentId: string) => {
    const params = new URLSearchParams();
    params.set('torneo', tournamentId);
    router.replace(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setTournamentIdParam}
      value={tournamentId ?? ""}
    >
      <SelectTrigger className="w-full max-w-lg">
        <SelectValue placeholder="¡ Selecciona un torneo !" />
      </SelectTrigger>
      <SelectContent>
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

export default SelectTournament;
