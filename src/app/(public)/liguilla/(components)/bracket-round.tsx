import type { FC } from 'react';
import { MatchCard, type Match } from './match-card';
import { Trophy } from 'lucide-react';
import { BracketConnector } from './bracket-connector';
import { PLAYOFF_ROUND, type PLAYOFF_ROUND_TYPE } from '@/shared/enums';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  quarterFinals?: [Match, Match, Match, Match];
  semiFinals?: [Match, Match];
  final: Match;
  groupName: string;
  variant?: 'oro' | 'plata';
  startingRound: PLAYOFF_ROUND_TYPE;
}>;

const getWinner = (match: Match | undefined): 'local' | 'visitor' | null => {
  if (!match) return null;
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

const ChampionDisplay: FC<{
  final: Match;
  isFinalCompleted: boolean;
  championColor: 'amber' | 'slate';
}> = ({ final, isFinalCompleted, championColor }) => {
  const finalWinner = getWinner(final);
  return isFinalCompleted && finalWinner ? (
    <div className="flex flex-col items-center gap-2">
      <Trophy
        size={64}
        className={`shrink-0 ${championColor === 'amber' ? 'stroke-amber-500' : 'stroke-slate-400'}`}
        strokeWidth={1.5}
      />
      <span className="text-xl font-bold text-primary">
        {finalWinner === 'local' ? final.localTeam.name : final.visitorTeam.name}
      </span>
      <span className={`text-2xl font-bold ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
        Campeón
      </span>
    </div>
  ) : null;
};

const RoundLabel: FC<{ label: string }> = ({ label }) => (
  <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
    {label}
  </span>
);

const FinalCell: FC<{
  final: Match;
  isFinalCompleted: boolean;
  championColor: 'amber' | 'slate';
}> = ({ final, isFinalCompleted, championColor }) => {
  const finalWinner = getWinner(final);
  return (
    <span className="text-center">
      {isFinalCompleted && finalWinner ? (
        <span className="flex flex-col items-center gap-0.5">
          <ChampionDisplay final={final} isFinalCompleted={isFinalCompleted} championColor={championColor} />
        </span>
      ) : (
        <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Final
        </span>
      )}
    </span>
  );
};

const ConnectorSpacer: FC = () => <span />;

export const BracketRound: FC<Props> = ({
  quarterFinals,
  semiFinals,
  final,
  groupName,
  variant = 'oro',
  startingRound,
}) => {
  const finalWinner = getWinner(final);
  const isFinalCompleted = final.status === 'completed';
  const championColor = variant === 'oro' ? 'amber' : 'slate';

  const hasQuarterFinals = (startingRound === PLAYOFF_ROUND.QUARTER_FINAL) && quarterFinals;
  const hasSemiFinals = (startingRound === PLAYOFF_ROUND.SEMI_FINAL) && semiFinals;

  const quarterFinalMatches = quarterFinals ?? [];
  const semiFinalMatches = semiFinals ?? [];
  const [sf1, sf2] = semiFinalMatches;

  return (
    <div>
      <h3 className={`text-lg font-bold mb-4 uppercase tracking-wide ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
        {groupName}
      </h3>

      {/* Desktop */}
      {hasQuarterFinals ? (
        /* Full bracket (QF → SF → Final) */
        <>
          <div
            className="hidden lg:grid min-h-[350px] overflow-visible"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
          >
            <div className="flex flex-col justify-between py-1">
              <MatchCard match={quarterFinalMatches[0]} />
              <MatchCard match={quarterFinalMatches[1]} />
            </div>
            <div><BracketConnector type="qf-to-sf" /></div>
            <div className="flex flex-col justify-center py-1">
              <MatchCard match={sf1} winner={getWinner(sf1)} />
            </div>
            <div><BracketConnector type="sf-to-final" /></div>
            <div className="flex flex-col justify-center py-1">
              <MatchCard match={final} winner={finalWinner} />
            </div>
            <div><BracketConnector type="sf-to-final" /></div>
            <div className="flex flex-col justify-center py-1">
              <MatchCard match={sf2} winner={getWinner(sf2)} />
            </div>
            <div><BracketConnector type="qf-to-sf" flip /></div>
            <div className="flex flex-col justify-between py-1">
              <MatchCard match={quarterFinalMatches[2]} />
              <MatchCard match={quarterFinalMatches[3]} />
            </div>
          </div>
          <div
            className="hidden lg:grid mt-2 items-center"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
          >
            <RoundLabel label="Cuartos" />

            <ConnectorSpacer />

            <RoundLabel label="Semifinal" />

            <ConnectorSpacer />

            <FinalCell
              final={final}
              isFinalCompleted={isFinalCompleted}
              championColor={championColor}
            />

            <ConnectorSpacer />

            <RoundLabel label="Semifinal" />

            <ConnectorSpacer />

            <RoundLabel label="Cuartos" />
          </div>
        </>
      ) : hasSemiFinals ? (
        /* Semifinal → Final bracket (no QF) */
        <>
          <div
            className="hidden lg:grid min-h-[200px] overflow-visible"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr' }}
          >
            <div className="flex flex-col justify-center py-1">
              <MatchCard match={sf1} winner={getWinner(sf1)} />
            </div>
            <div><BracketConnector type="sf-to-final" /></div>
            <div className="flex flex-col justify-center py-1">
              <MatchCard match={final} winner={finalWinner} />
            </div>
            <div><BracketConnector type="sf-to-final" /></div>
            <div className="flex flex-col justify-center py-1">
              <MatchCard match={sf2} winner={getWinner(sf2)} />
            </div>
          </div>
          <div
            className="hidden lg:grid mt-2 items-center"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr' }}
          >
            <RoundLabel label="Semifinal" />
            <ConnectorSpacer />
            <FinalCell final={final} isFinalCompleted={isFinalCompleted} championColor={championColor} />
            <ConnectorSpacer />
            <RoundLabel label="Semifinal" />
          </div>
        </>
      ) : (
        /* Final only bracket */
        <>
          <div className="hidden lg:flex justify-start py-1">
            <MatchCard match={final} winner={finalWinner} />
          </div>
          <div className={cn('hidden lg:flex mt-2', { 'justify-center': hasQuarterFinals || hasSemiFinals })}>
            <FinalCell final={final} isFinalCompleted={isFinalCompleted} championColor={championColor} />
          </div>
        </>
      )}

      {/* Mobile */}
      <div className="lg:hidden space-y-5">
        {hasQuarterFinals && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Cuartos de Final
            </h4>
            <div className="space-y-2">
              {quarterFinalMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}
        {hasSemiFinals && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Semifinales
            </h4>
            <div className="flex flex-col gap-2">
              {semiFinalMatches.map((match) => (
                <MatchCard key={match.id} match={match} winner={getWinner(match)} />
              ))}
            </div>
          </div>
        )}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Final
          </h4>
          <div className="flex flex-col items-center gap-2">
            <MatchCard match={final} winner={finalWinner} />
            {isFinalCompleted && (
              <>
                {finalWinner && (
                  <ChampionDisplay final={final} isFinalCompleted={isFinalCompleted} championColor={championColor} />
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
