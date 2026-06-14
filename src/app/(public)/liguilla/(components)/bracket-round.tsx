import type { FC } from 'react';
import { MatchCard, type Match } from './match-card';

type Props = Readonly<{
  quarterFinals: [Match, Match, Match, Match];
  semiFinals: [Match, Match];
  final: Match;
  groupName: string;
}>;

function getWinner(match: Match): 'local' | 'visitor' | null {
  if (match.status !== 'completed') return null;
  if (match.localScore === null || match.visitorScore === null) return null;
  if (match.localScore > match.visitorScore) return 'local';
  if (match.visitorScore > match.localScore) return 'visitor';
  if (match.penaltyShoots) {
    if (match.penaltyShoots.localGoals > match.penaltyShoots.visitorGoals) return 'local';
    if (match.penaltyShoots.visitorGoals > match.penaltyShoots.localGoals) return 'visitor';
  }
  return null;
}

function getLoser(match: Match): 'local' | 'visitor' | null {
  const winner = getWinner(match);
  if (!winner) return null;
  return winner === 'local' ? 'visitor' : 'local';
}

export const BracketRound: FC<Props> = ({ quarterFinals, semiFinals, final, groupName }) => {
  const finalWinner = getWinner(final);
  const isFinalCompleted = final.status === 'completed';
  const [qf1, qf2, qf3, qf4] = quarterFinals;
  const [sf1, sf2] = semiFinals;

  return (
    <div>
      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4 uppercase tracking-wide">
        {groupName}
      </h3>

      <div className="hidden lg:grid grid-cols-5 gap-4 min-h-[350px]">
        {/* QF Left */}
        <div className="flex flex-col justify-between py-1">
          <MatchCard match={qf1} />
          <MatchCard match={qf2} />
        </div>

        {/* SF Left */}
        <div className="flex flex-col justify-center py-1">
          <MatchCard match={sf1} winner={getWinner(sf1)} />
        </div>

        {/* Final */}
        <div className="flex flex-col justify-center py-1">
          <MatchCard match={final} winner={finalWinner} />
        </div>

        {/* SF Right */}
        <div className="flex flex-col justify-center py-1">
          <MatchCard match={sf2} winner={getWinner(sf2)} />
        </div>

        {/* QF Right */}
        <div className="flex flex-col justify-between py-1">
          <MatchCard match={qf3} />
          <MatchCard match={qf4} />
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-5 gap-4 mt-2 items-center">
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Cuartos
        </span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Semifinal
        </span>
        <span className="text-center">
          {isFinalCompleted ? (
            <span className="flex flex-col items-center gap-0.5">
              {finalWinner && (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  🏆 Campeón
                </span>
              )}
              {getLoser(final) && (
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 italic">
                  Finalista
                </span>
              )}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Final
            </span>
          )}
        </span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Semifinal
        </span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Cuartos
        </span>
      </div>

      {/* Mobile */}
      <div className="lg:hidden space-y-5">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Cuartos de Final
          </h4>
          <div className="space-y-2">
            {quarterFinals.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Semifinales
          </h4>
          <div className="flex flex-col gap-2">
            {semiFinals.map((match) => (
              <MatchCard key={match.id} match={match} winner={getWinner(match)} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Final
          </h4>
          <div className="flex flex-col items-center gap-2">
            <MatchCard match={final} winner={finalWinner} />
            {isFinalCompleted && (
              <>
                {finalWinner && (
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 text-center">
                    🏆 Campeón
                  </span>
                )}
                {getLoser(final) && (
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 italic text-center">
                    Finalista
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
