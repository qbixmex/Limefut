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

export const SelectTournament: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentPermalink = searchParams.get('torneo');
  const pathname = usePathname();
  const router = useRouter();

  const setTournamentIdParam = (tournamentId: string) => {
    const params = new URLSearchParams();
    params.set('torneo', tournamentId);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setTournamentIdParam}
      value={tournamentPermalink ?? ""}
    >
      <SelectTrigger className="w-full max-w-[400px]">
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
