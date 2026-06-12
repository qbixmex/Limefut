import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { EditPlayoffsMatchForm } from './edit-playoff-match-form';
import { TeamsSlot } from '../../(components)/form-fields/teams-slot';
import { FieldsSlot } from '../../(components)/form-fields/fields-slot';
import { fetchMatchForEditAction, type MATCH_TYPE } from '../../(actions)/fetch-match-for-edit.action';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { MATCH_STATUS } from '@/shared/enums';
import { PenaltyShoots } from '@/shared/components/penalty-shoots';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
    match_id: string;
  }>;
}>;

export const EditPlayoffMatchContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const playoffId = (await params).playoff_id;
  const matchId = (await params).match_id;

  const response = await fetchMatchForEditAction({
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
    playoffId,
    matchId,
  });

  if (!response.ok) {
    redirect(
      ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId) +
      `?error=${encodeURIComponent(response.message)}`,
    );
  }

  const playoffMatch = response.match as MATCH_TYPE;

  const usedShooterIds = playoffMatch.penaltyShootout?.kicks
    ?.map(kick => kick.playerId) ?? [];

  const availableLocalPlayers = playoffMatch.localTeam.players
    ?.filter(({ id }) => !usedShooterIds.includes(id))
    .map(({ id, name }) => ({ id, name })) ?? [];

  const availableVisitorPlayers = playoffMatch.visitorTeam.players
    ?.filter(({ id }) => !usedShooterIds.includes(id))
    .map(({ id, name }) => ({ id, name })) ?? [];

  return (
    <>
      <EditPlayoffsMatchForm
        authenticatedUserId={session?.user.id}
        authenticatedUserRoles={session?.user.roles}
        playoffId={playoffId}
        teamsSlot={
          <TeamsSlot
            authenticatedUserId={session?.user.id}
            authenticatedUserRoles={session?.user.roles}
            playoffId={playoffId}
          />
        }
        fieldsSlot={
          <FieldsSlot
            authenticatedUserId={session?.user.id}
            authenticatedUserRoles={session?.user.roles}
          />
        }
        match={response.match as MATCH_TYPE}
      />

      {
        (playoffMatch.status === MATCH_STATUS.COMPLETED) &&
        (playoffMatch.localScore === playoffMatch.visitorScore) && (
          <>
            <div className="w-full h-0.25 bg-gray-300 dark:bg-gray-700 my-8" />
            <PenaltyShoots
              userRoles={session?.user.roles}
              match={{
                id: playoffMatch.id,
                status: playoffMatch.status,
                localScore: playoffMatch.localScore as number,
                visitorScore: playoffMatch.visitorScore as number,
              }}
              localTeam={playoffMatch.localTeam}
              visitorTeam={playoffMatch.visitorTeam}
              penaltyShootout={playoffMatch.penaltyShootout}
              availablePlayers={{
                localPlayers: availableLocalPlayers,
                visitorPlayers: availableVisitorPlayers,
              }}
              phase="playoffs"
            />
          </>
        )}
    </>
  );
};
