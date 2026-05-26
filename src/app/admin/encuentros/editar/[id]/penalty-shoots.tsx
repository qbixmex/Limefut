'use client';

import { useState, type FC } from 'react';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { MATCH_STATUS, SHOOTOUT_STATUS } from '@/shared/enums';
import { PenaltyShootout } from '@/shared/components/penalty-shootouts';
import type { PENALTY_SHOOTOUT_TYPE } from '../../(actions)/fetch-match.action';
import { DeletePenaltyShootouts } from '../../(components)/delete-penalty-shootouts';
import { PenaltiesForm } from '../../(components)/penalties-form';
import { Switch } from '@/components/ui/switch';
import { SimplePenaltyShootoutForm } from './components/simple-penalty-shootout-form';

type Props = Readonly<{
  userRoles: string[] | null | undefined;
  match: {
    id: string;
    status: MATCH_STATUS_TYPE;
    localScore: number;
    visitorScore: number;
  };
  localTeam: TEAM_TYPE;
  visitorTeam: TEAM_TYPE;
  penaltyShootout: PENALTY_SHOOTOUT_TYPE | null;
  availablePlayers: {
    localPlayers: AVAILABLE_PLAYER_TYPE[];
    visitorPlayers: AVAILABLE_PLAYER_TYPE[];
  }
}>;

type TEAM_TYPE = {
  id: string;
  name: string;
};

type AVAILABLE_PLAYER_TYPE = {
  id: string;
  name: string;
};

export const PenaltyShoots: FC<Props> = ({
  userRoles,
  match,
  localTeam,
  visitorTeam,
  penaltyShootout,
  availablePlayers,
}) => {
  const [penaltyShootsWithDetails, setPenaltyShootsWithDetails] = useState(false);

  return (
    <>
      {/* SHOOTOUTS SWITCH */}
      {!penaltyShootout && (
        <div className="mb-8">
          <label className="flex items-center gap-2">
            <Switch
              checked={penaltyShootsWithDetails}
              onCheckedChange={() => {
                setPenaltyShootsWithDetails((prev) => !prev);
              }}
            />
            <span>{penaltyShootsWithDetails ? 'tanda detallada' : 'tanda simple'}</span>
          </label>
        </div>
      )}

      {penaltyShootout && (
        <div className="w-full md:w-1/2 lg:w-1/3 relative">
          <h2 className="text-xl font-semibold text-sky-500 mb-5">Tanda de Penales</h2>

          <PenaltyShootout shootout={penaltyShootout} />

          <div className="absolute top-0 right-0">
            {
              penaltyShootout?.status === MATCH_STATUS.COMPLETED &&
              (
                <DeletePenaltyShootouts
                  penaltyShootoutsId={penaltyShootout.id}
                  winnerTeamId={penaltyShootout.winnerTeamId}
                />
              )
            }
          </div>
        </div>
      )}

      {/* SIMPLE SHOOTOUTS FORM */}
      {(
        (!penaltyShootout && !penaltyShootsWithDetails) ||
        (
          penaltyShootout &&
          match.status !== SHOOTOUT_STATUS.COMPLETED &&
          penaltyShootout.kicks.length === 0
        )
      ) && (
          <>
            <h2 className="text-xl font-semibold text-sky-500 mb-5">
              Crear tanda de penales
            </h2>

            <SimplePenaltyShootoutForm
              userRoles={userRoles}
              matchId={match.id}
              localTeam={{
                id: localTeam.id,
                name: localTeam.name,
              }}
              visitorTeam={{
                id: visitorTeam.id,
                name: visitorTeam.name,
              }}
            />
          </>
        )}

      {/* DETAILED SHOOTOUT FORM */}
      {
        (
          penaltyShootsWithDetails &&
          penaltyShootout?.status !== SHOOTOUT_STATUS.COMPLETED &&
          penaltyShootout?.kicks.length !== 0
        ) && (
          <section>
            <h2 className="text-xl font-semibold text-sky-500 mb-5">
              Crear tanda de penales detallada
            </h2>

            <PenaltiesForm
              userRoles={userRoles}
              currentMatchId={match.id}
              localTeam={{
                id: localTeam.id,
                name: localTeam.name,
                players: availablePlayers.localPlayers,
              }}
              visitorTeam={{
                id: visitorTeam.id,
                name: visitorTeam.name,
                players: availablePlayers.visitorPlayers,
              }}
            />
          </section>
        )}
    </>
  );
};
