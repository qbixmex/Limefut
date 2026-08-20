import type { FC } from 'react';
import { EditTournament } from './edit-tournament';

type EditTournamentProps = {
  params: Promise<{ id: string; }>;
};

export const EditTournamentWrapper: FC<EditTournamentProps> = async ({ params }) => {
  const tournamentId = (await params).id;

  return (
    <EditTournament
      tournamentId={tournamentId}
      side="left"
    />
  );
};
