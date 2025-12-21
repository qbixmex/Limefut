'use client';

import type { FC } from "react";
import type { TournamentType } from "../(actions)/fetchTournamentsAction";
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
  tournaments: TournamentType[];
}>;

export const SelectTournament: FC<Props> = ({ tournaments }) => {
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
      defaultValue={tournamentPermalink ?? ""}
    >
      <SelectTrigger className="w-full max-w-[400px]">
        <SelectValue placeholder="¡ Selecciona un torneo !" />
      </SelectTrigger>
      <SelectContent>
        {tournaments.map((tournament) => (
          <SelectItem
            key={tournament.id}
            value={tournament.permalink}
          >
            {tournament.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectTournament;
