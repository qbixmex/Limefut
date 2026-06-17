'use client';

import type { FC } from 'react';
import { MatchCard, type Match } from '../match-card';
import { BracketConnector } from '../bracket-connector';
import { PLAYOFF_ROUND, type PLAYOFF_ROUND_TYPE } from '@/shared/enums';
import { useBracketRound } from '../../use-bracket-round';
import { FinalCell } from '../final-cell';
import { ChampionDisplay } from '../champion-display';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

type Props = Readonly<{
  quarterFinals?: [Match, Match, Match, Match];
  semiFinals?: [Match, Match];
  final: Match;
  groupName: string;
  variant?: 'oro' | 'plata';
  categoryName: string;
  isSingleGroup: boolean;
  startingRound: PLAYOFF_ROUND_TYPE;
  tournament: string;
  category: string;
}>;

const RoundLabel: FC<{ label: string }> = ({ label }) => (
  <span className={styles.roundLabel}>
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
  categoryName,
  isSingleGroup,
  startingRound,
  tournament,
  category,
}) => {
  const { getWinner } = useBracketRound();
  const finalWinner = getWinner(final);
  const isFinalCompleted = final.status === 'completed';
  const championColor = (variant === 'oro') ? 'gold' : (variant === 'plata') ? 'silver' : 'general';
  const hasQuarterFinals = (startingRound === PLAYOFF_ROUND.QUARTER_FINAL) && quarterFinals;
  const hasSemiFinals = semiFinals && semiFinals.length > 0;

  const quarterFinalMatches = quarterFinals ?? [];
  const semiFinalMatches = semiFinals ?? [];
  const [sf1, sf2] = semiFinalMatches;

  return (
    <>
      <h3 className={cn([
        styles.heading,
        {
          [styles.goldColor]: championColor === 'gold',
          [styles.silverColor]: championColor === 'silver',
          [styles.generalColor]: isSingleGroup,
        },
      ])}>
        Finales {isSingleGroup ? categoryName : groupName}
      </h3>

      {/* Desktop */}
      <section className={styles.desktop}>
        {hasQuarterFinals ? (
          <section className={styles.quarterFinals}>
            <div className={styles.branchesHeadings}>
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
            <div className={styles.branches}>
              <div className={styles.quarterFinalsBranches}>
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
              <div className={styles.semifinalBranch}>
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
              <div className={styles.finalBranch}>
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
              <div className={styles.semifinalBranch}>
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
              <div className={styles.quarterFinalsBranches}>
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
          <section className={styles.semifinals}>
            <div className={styles.headings}>
              <RoundLabel label="Semifinal" />
              <ConnectorSpacer />
              <RoundLabel label="Final" />
              <ConnectorSpacer />
              <RoundLabel label="Semifinal" />
            </div>
            <div className={styles.branches}>
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
            <div className={styles.championTeam}>
              <FinalCell
                final={final}
                isFinalCompleted={isFinalCompleted}
                championColor={championColor}
              />
            </div>
          </section>
        ) : (
          <section className={styles.finals}>
            <Link href={
              '/liguilla/encuentro' +
              `?tournament=${tournament}` +
              `&category=${category}` +
              `&local_team=${final.localTeam.permalink ?? 'none'}` +
              `&visitor_team=${final.visitorTeam.permalink ?? 'none'}`
            }>
              <MatchCard
                match={final}
                winner={finalWinner}
                isJustFinal
              />
            </Link>
            <FinalCell
              final={final}
              isFinalCompleted={isFinalCompleted}
              championColor={championColor}
            />
          </section>
        )}
      </section>

      {/* Mobile */}
      <section className={styles.mobile}>
        {(hasQuarterFinals) && (
          <section className={styles.quarterFinals}>
            <h4 className={styles.mobileHeading}>Cuartos de Final</h4>
            <div className={styles.mobileQuarterFinals}>
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
          </section>
        )}
        {(hasSemiFinals) && (
          <section className={styles.semifinals}>
            <h4 className={styles.mobileHeading}>Semifinales</h4>
            <div className={styles.mobileSemifinals}>
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
          </section>
        )}
        <section className={styles.finals}>
          <h4 className={styles.mobileHeading}>Final</h4>
          <div className={styles.mobileFinals}>
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
        </section>
      </section>
    </>
  );
};
