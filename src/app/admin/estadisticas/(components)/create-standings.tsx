'use client';

import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '~/src/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { createStandingsAction } from '../(actions)/createStandingsAction';
import type { TournamentType } from '../(actions)/fetchStandingsAction';

type Props = Readonly<{
  tournament: TournamentType;
}>;

export const CreateStandings: FC<Props> = ({ tournament }) => {
  const [ creatingStandings, setCreatingStandings ] = useState(false);

  const handleOnCreateStandings = async () => {
    const data = tournament.teams.map((team) => ({
      tournamentId: tournament.id,
      teamId: team.id,
    }));

    try {
      setCreatingStandings(true);
      const { ok, message } = await createStandingsAction(data);
      if (ok) toast.success(message);
      if (!ok) toast.error(message);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setCreatingStandings(false);
    }
  };

  return (
    <>
      <Button
        variant={creatingStandings ? "outline-secondary" : "outline-primary"}
        onClick={handleOnCreateStandings}
        disabled={creatingStandings}
        className={cn({ 'cursor-not-allowed animate-pulse': creatingStandings })}
      >
        crear
        {creatingStandings && <LoaderCircle className="animate-spin" />}
      </Button>
    </>
  );
};

export default CreateStandings;
