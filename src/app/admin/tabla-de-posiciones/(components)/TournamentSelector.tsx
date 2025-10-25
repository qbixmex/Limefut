'use client';

import { type FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tournament = {
  id: string;
  name: string;
};

type Props = {
  tournaments: Tournament[];
  onSelect: (tournamentId: string) => void;
};

export const TournamentSelector: FC<Props> = ({ tournaments, onSelect }) => {
  return (
    <div className="w-full max-w-xs mb-6">
      <Select onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="¡ Selecciona un torneo !" />
        </SelectTrigger>
        <SelectContent>
          {tournaments.map((tournament) => (
            <SelectItem key={tournament.id} value={tournament.id}>
              {tournament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TournamentSelector;
