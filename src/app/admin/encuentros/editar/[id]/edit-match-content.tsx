import type { FC } from "react";
import { auth } from "~/src/auth";
import { MatchForm } from "../../(components)/matchForm";
import { fetchMatchAction } from "../../(actions)";
import { redirect } from "next/navigation";
import { fetchTeamsForMatchAction } from "../../(actions)/fetchTeamsForMatchAction";
import type { MatchType } from "../../(actions)/fetchMatchAction";
import type { Team } from "~/src/shared/interfaces";
import type { Session } from "next-auth";

type Props = {
  matchId: string;
};

export const EditMatchContent: FC<Props> = async ({ matchId }) => {
  const session = await auth();
  
  const responseMatch = await fetchMatchAction(matchId, session?.user.roles ?? null);

  if (!responseMatch.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(responseMatch.message)}`);
  }

  const match = responseMatch.match as MatchType;

  const responseTeams = await fetchTeamsForMatchAction({
    tournamentId: match?.tournament.id as string,
    week: match?.week as number,
  });

  if (!responseTeams.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(responseTeams.message)}`);
  }

  const teams = responseTeams.teams as Team[];

  return (
    <MatchForm
      session={session as Session}
      match={match}
      initialTeams={teams}
    />
  );
};

export default EditMatchContent;