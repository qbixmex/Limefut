'use client';

import type { FC } from 'react';
import { MatchCard, type Match } from './match-card';
import { BracketConnector } from './bracket-connector';
import { PLAYOFF_ROUND, type PLAYOFF_ROUND_TYPE } from '@/shared/enums';
import { useBracketRound } from '../use-bracket-round';
import { FinalCell } from './final-cell';
import { ChampionDisplay } from './champion-display';
import Link from 'next/link';

type Props = Readonly<{
  quarterFinals?: [Match, Match, Match, Match];
  semiFinals?: [Match, Match];
  final: Match;
  groupName: string;
  variant?: 'oro' | 'plata';
  startingRound: PLAYOFF_ROUND_TYPE;
  tournament: string;
  category: string;
}>;

const RoundLabel: FC<{ label: string }> = ({ label }) => (
  <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
    {label}
  </span>
);

const ConnectorSpacer: FC = () => <span />;

export const BracketRound: FC<Props> = ({
  quarterFinals,
  semiFinals,
  final,
  groupName,
  variant = 'oro',
  startingRound,
  tournament,
  category,
}) => {
  const { getWinner } = useBracketRound();
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
      <h3 className={`text-2xl text-center font-bold mb-4 uppercase tracking-wide ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
        {groupName}
      </h3>

      {/* Desktop */}
      {hasQuarterFinals ? (
        <section>
          <div
            className="hidden lg:grid mb-5 items-center"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
          >
            <RoundLabel label="Cuartos" />

            <ConnectorSpacer />

            <RoundLabel label="Semifinal" />

            <ConnectorSpacer />

            <RoundLabel label="Final" />

            <ConnectorSpacer />

            <RoundLabel label="Semifinal" />

            <ConnectorSpacer />

            <RoundLabel label="Cuartos" />
          </div>
          <div
            className="hidden lg:grid min-h-[350px] overflow-visible"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
          >
            <div className="flex flex-col justify-between py-1">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${tournament}` +
                  `&category=${category}` +
                  `&local_team=${quarterFinalMatches[0]?.localTeam.permalink ?? 'none'}` +
                  `&visitor_team=${quarterFinalMatches[0]?.visitorTeam.permalink ?? 'none'}`
                }
                target="_blank"
              >
                <MatchCard match={quarterFinalMatches[0]} />
              </Link>
              <Link href={
                '/liguilla/encuentro' +
                `?tournament=${tournament}` +
                `&category=${category}` +
                `&local_team=${quarterFinalMatches[1]?.localTeam.permalink ?? 'none'}` +
                `&visitor_team=${quarterFinalMatches[1]?.visitorTeam.permalink ?? 'none'}`
              }>
                <MatchCard match={quarterFinalMatches[1]} />
              </Link>
            </div>
            <div><BracketConnector type="qf-to-sf" /></div>
            <div className="flex flex-col justify-center py-1">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${tournament}` +
                  `&category=${category}` +
                  `&local_team=${sf1?.localTeam.permalink ?? 'none'}` +
                  `&visitor_team=${sf1?.visitorTeam.permalink ?? 'none'}`
                }
                target="_blank"
              >
                <MatchCard match={sf1} winner={getWinner(sf1)} />
              </Link>
            </div>
            <div><BracketConnector type="sf-to-final" /></div>
            <div className="flex flex-col justify-center py-1">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${tournament}` +
                  `&category=${category}` +
                  `&local_team=${final.localTeam.permalink}` +
                  `&visitor_team=${final.visitorTeam.permalink}`
                }
                target="_blank"
              >
                <MatchCard match={final} winner={finalWinner} />
              </Link>
            </div>
            <div><BracketConnector type="sf-to-final" /></div>
            <div className="flex flex-col justify-center py-1">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${tournament}` +
                  `&category=${category}` +
                  `&local_team=${sf2?.localTeam.permalink ?? 'none'}` +
                  `&visitor_team=${sf2?.visitorTeam.permalink ?? 'none'}`
                }
                target="_blank"
              >
                <MatchCard match={sf2} winner={getWinner(sf2)} />
              </Link>
            </div>
            <div><BracketConnector type="qf-to-sf" flip /></div>
            <div className="flex flex-col justify-between py-1">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${tournament}` +
                  `&category=${category}` +
                  `&local_team=${quarterFinalMatches[2]?.localTeam.permalink ?? 'none'}` +
                  `&visitor_team=${quarterFinalMatches[2]?.visitorTeam.permalink ?? 'none'}`
                }
                target="_blank"
              >
                <MatchCard match={quarterFinalMatches[2]} />
              </Link>
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${tournament}` +
                  `&category=${category}` +
                  `&local_team=${quarterFinalMatches[3]?.localTeam.permalink ?? 'none'}` +
                  `&visitor_team=${quarterFinalMatches[3]?.visitorTeam.permalink ?? 'none'}`
                }
                target="_blank"
              >
                <MatchCard match={quarterFinalMatches[3]} />
              </Link>
            </div>
          </div>
          <div>
            <FinalCell
              final={final}
              isFinalCompleted={isFinalCompleted}
              championColor={championColor}
            />
          </div>
        </section>
      ) : hasSemiFinals ? (
        <section>
          <div
            className="hidden lg:grid items-center overflow-visible"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr' }}
          >
            <Link
              href={
                '/liguilla/encuentro' +
                `?tournament=${tournament}` +
                `&category=${category}` +
                `&local_team=${sf1?.localTeam.permalink ?? 'none'}` +
                `&visitor_team=${sf1?.visitorTeam.permalink ?? 'none'}`
              }
              target="_blank"
            >
              <MatchCard match={sf1} winner={getWinner(sf1)} />
            </Link>
            <div><BracketConnector type="sf-to-final" /></div>
            <Link
              href={
                '/liguilla/encuentro' +
                `?tournament=${tournament}` +
                `&category=${category}` +
                `&local_team=${final.localTeam.permalink}` +
                `&visitor_team=${final.visitorTeam.permalink}`
              }
              target="_blank"
            >
              <MatchCard match={final} winner={finalWinner} />
            </Link>
            <div><BracketConnector type="sf-to-final" /></div>
            <Link
              href={
                '/liguilla/encuentro' +
                `?tournament=${tournament}` +
                `&category=${category}` +
                `&local_team=${sf2?.localTeam.permalink ?? 'none'}` +
                `&visitor_team=${sf2?.visitorTeam.permalink ?? 'none'}`
              }
              target="_blank"
            >
              <MatchCard match={sf2} winner={getWinner(sf2)} />
            </Link>
          </div>
          <div
            className="hidden lg:grid mt-2 items-center"
            style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr' }}
          >
            <RoundLabel label="Semifinal" />
            <ConnectorSpacer />
            <FinalCell
              final={final}
              isFinalCompleted={isFinalCompleted}
              championColor={championColor}
            />
            <ConnectorSpacer />
            <RoundLabel label="Semifinal" />
          </div>
        </section>
      ) : (
        <section>
          <div className="hidden lg:flex justify-center py-1">
            <MatchCard
              match={final}
              winner={finalWinner}
              isJustFinal
            />
          </div>
          <div className="hidden lg:flex mt-2 justify-center">
            <FinalCell
              final={final}
              isFinalCompleted={isFinalCompleted}
              championColor={championColor}
            />
          </div>
        </section>
      )}

      {/* Mobile */}
      <div className="lg:hidden space-y-5">
        {hasQuarterFinals && (
          <div>
            <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Cuartos de Final
            </h4>
            <div className="space-y-2">
              {quarterFinalMatches.map((match) => (
                <Link
                  key={match.id}
                  href={
                    '/liguilla/encuentro' +
                    `?tournament=${tournament}` +
                    `&category=${category}` +
                    `&local_team=${match.localTeam.permalink}` +
                    `&visitor_team=${match.visitorTeam.permalink}`
                  }
                >
                  <MatchCard match={match} />
                </Link>
              ))}
            </div>
          </div>
        )}
        {hasSemiFinals && (
          <div>
            <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Semifinales
            </h4>
            <div className="flex flex-col gap-2">
              {semiFinalMatches.map((match) => (
                <Link
                  key={match.id}
                  href={
                    '/liguilla/encuentro' +
                    `?tournament=${tournament}` +
                    `&category=${category}` +
                    `&local_team=${match.localTeam.permalink}` +
                    `&visitor_team=${match.visitorTeam.permalink}`
                  }
                  target="_blank"
                >
                  <MatchCard match={match} winner={getWinner(match)} />
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Final
          </h4>
          <div className="flex flex-col items-center gap-2">
            <Link
              href={
                '/liguilla/encuentro' +
                `?tournament=${tournament}` +
                `&category=${category}` +
                `&local_team=${final.localTeam.permalink}` +
                `&visitor_team=${final.visitorTeam.permalink}`
              }
              className="w-full"
            >
              <MatchCard match={final} winner={finalWinner} />
            </Link>
            {isFinalCompleted && (
              <>
                {finalWinner && (
                  <ChampionDisplay
                    final={final}
                    isFinalCompleted={isFinalCompleted}
                    championColor={championColor}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
