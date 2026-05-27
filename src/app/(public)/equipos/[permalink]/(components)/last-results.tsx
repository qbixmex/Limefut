import type { FC } from 'react';
import { Match } from './next-match';
import type { MATCH_TYPE } from '../../(actions)/fetchTeamAction';
import { MATCH_STATUS } from '@/shared/enums';

type Props = Readonly<{ matches: MATCH_TYPE[]; }>;

export const LastResults: FC<Props> = async ({ matches }) => {
  const completedMatches = matches.filter(match => match.status === MATCH_STATUS.COMPLETED);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-5">Resultados:</h2>

      {(matches.length === 0) && (
        <div className="w-fit px-5 py-2.5 border border-sky-500 rounded mb-5">
          <p className="text-sky-500 font-bold italic">
            No hay encuentros completados
          </p>
        </div>
      )}

      {(completedMatches.length > 0) && (
        <div className="space-y-5">
          {completedMatches.map((match) => (
            <Match
              key={match.id}
              localScore={match.localScore as number}
              visitorScore={match.visitorScore as number}
              penaltyShootout={match.penaltyShootout}
              matchDetails={{
                matchDate: match.matchDate,
                status: match.status,
                place: match.place,
                week: match.week,
              }}
              localTeam={match.localTeam}
              visitorTeam={match.visitorTeam}
              showScore
            />
          ))}
        </div>
      )}
    </section>
  );
};
