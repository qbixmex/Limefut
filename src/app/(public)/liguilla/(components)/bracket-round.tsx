import type { FC } from 'react';
import { MatchCard, type Match } from './match-card';
import { Trophy } from 'lucide-react';
import { BracketConnector } from './bracket-connector';

type Props = Readonly<{
  quarterFinals: [Match, Match, Match, Match];
  semiFinals: [Match, Match];
  final: Match;
  groupName: string;
  variant?: 'oro' | 'plata';
}>;

const getWinner = (match: Match): 'local' | 'visitor' | null => {
  if (match.status !== 'completed') return null;
  if (match.localScore === null || match.visitorScore === null) return null;
  if (match.localScore > match.visitorScore) return 'local';
  if (match.visitorScore > match.localScore) return 'visitor';
  if (match.penaltyShoots) {
    if (
      match.penaltyShoots.localGoals > match.penaltyShoots.visitorGoals
    ) {
      return 'local';
    }
    if (
      match.penaltyShoots.visitorGoals > match.penaltyShoots.localGoals
    ) {
      return 'visitor';
    }
  }
  return null;
};

const getLoser = (match: Match): 'local' | 'visitor' | null => {
  const winner = getWinner(match);
  if (!winner) return null;
  return winner === 'local' ? 'visitor' : 'local';
};

export const BracketRound: FC<Props> = ({ quarterFinals, semiFinals, final, groupName, variant = 'oro' }) => {
  const finalWinner = getWinner(final);
  const isFinalCompleted = final.status === 'completed';
  const [qf1, qf2, qf3, qf4] = quarterFinals;
  const [sf1, sf2] = semiFinals;

  const championColor = variant === 'oro' ? 'amber' : 'slate';

  return (
    <div>
      <h3 className={`text-lg font-bold mb-4 uppercase tracking-wide ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
        {groupName}
      </h3>

      <div
        className="hidden lg:grid min-h-[350px] overflow-visible"
        style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
      >
        {/* QF Left */}
        <div className="flex flex-col justify-between py-1">
          <MatchCard match={qf1} />
          <MatchCard match={qf2} />
        </div>

        {/* Connector QF → SF */}
        <div>
          <BracketConnector type="qf-to-sf" />
        </div>

        {/* SF Left */}
        <div className="flex flex-col justify-center py-1">
          <MatchCard match={sf1} winner={getWinner(sf1)} />
        </div>

        {/* Connector SF → Final */}
        <div>
          <BracketConnector type="sf-to-final" />
        </div>

        {/* Final */}
        <div className="flex flex-col justify-center py-1">
          <MatchCard match={final} winner={finalWinner} />
        </div>

        {/* Connector SF → Final */}
        <div>
          <BracketConnector type="sf-to-final" />
        </div>

        {/* SF Right */}
        <div className="flex flex-col justify-center py-1">
          <MatchCard match={sf2} winner={getWinner(sf2)} />
        </div>

        {/* Connector QF → SF (flipped) */}
        <div>
          <BracketConnector type="qf-to-sf" flip />
        </div>

        {/* QF Right */}
        <div className="flex flex-col justify-between py-1">
          <MatchCard match={qf3} />
          <MatchCard match={qf4} />
        </div>
      </div>

      <div
        className="hidden lg:grid mt-2 items-center"
        style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
      >
        <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Cuartos
        </span>
        <span />
        <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Semifinal
        </span>
        <span />
        <span className="text-center">
          {isFinalCompleted ? (
            <span className="flex flex-col items-center gap-0.5">
              {finalWinner && (
                <div className="flex flex-col items-center gap-2">
                  <Trophy size={64} className={`shrink-0 ${championColor === 'amber' ? 'stroke-amber-500' : 'stroke-slate-400'}`} strokeWidth={1.5} />
                  <span className="text-xl font-bold text-primary">
                    {finalWinner === 'local' ? final.localTeam.name : final.visitorTeam.name}
                  </span>
                  <span className={`text-2xl font-bold ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>Campeón</span>
                </div>
              )}
            </span>
          ) : (
            <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Final
            </span>
          )}
        </span>
        <span />
        <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
          Semifinal
        </span>
        <span />
        <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
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
                  <div className="flex flex-col items-center gap-2">
                  <Trophy size={64} className={`shrink-0 ${championColor === 'amber' ? 'stroke-amber-500' : 'stroke-slate-400'}`} strokeWidth={1.5} />
                    <span className="text-xl font-bold text-primary">
                      {finalWinner === 'local' ? final.localTeam.name : final.visitorTeam.name}
                    </span>
                    <span className={`text-2xl font-bold ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>Campeón</span>
                  </div>
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
