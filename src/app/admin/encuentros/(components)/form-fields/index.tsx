'use client';

import type { FC } from 'react';
import { LocalTeamField } from './local-team-field';
import { MatchDateTimeFields } from './match-datetime-fields';
import { PlaceField } from './place-field';
import { RefereeField } from './referee-field';
import { ScoreField } from './score-field';
import { StatusField } from './status-field';
import { VisitorTeamField } from './visitor-team-field';
import { WeekField } from './week-field';
import type { Props } from './form-types';
import { InvertTeams } from './invert-teams';
import { TournamentSelectField } from './tournament-select-field';
import { CategorySelectField } from './category-select-field';
import { MATCH_STATUS } from '@/shared/enums';
import styles from './match-form.module.css';

export const FormFields: FC<Props> = ({
  tournaments,
  categories,
  teams,
  match,
  hiddenScores = false,
}) => {
  return (
    <>
      {/* Tournament and Category */}
      <section className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1">
          <TournamentSelectField tournaments={tournaments} />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <CategorySelectField categories={categories} />
        </div>
      </section>

      {/* Local Team and Visitor Team */}
      {
        (teams.length > 0) && (
          <section className={styles.teamsWrapper}>
            <div className={styles.teamField}>
              <LocalTeamField teams={teams} match={match} />
            </div>
            <InvertTeams />
            <div className={styles.teamField}>
              <VisitorTeamField teams={teams} match={match} />
            </div>
          </section>
        )
      }

      {/* Local Score and Visitor Score */}
      {!hiddenScores && (
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ScoreField name="localScore" label="Marcador Local" />
          </div>
          <div className="w-full lg:w-1/2">
            <ScoreField name="visitorScore" label="Marcador Visitante" />
          </div>
        </section>
      )}

      {/* Place and Week and Referee */}
      <section className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <PlaceField teams={teams} match={match} />
        </div>
        <div className="w-full lg:w-1/2">
          <RefereeField />
        </div>
      </section>

      {/* DateTime and Week */}
      <section className="flex flex-col gap-5 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <MatchDateTimeFields match={match} />
        </div>

        <div className='w-full lg:w-1/2 flex justify-end gap-5'>
          {((!match) || (match?.status !== MATCH_STATUS.COMPLETED)) && (
            <StatusField />
          )}
          <WeekField />
        </div>
      </section>
    </>
  );
};
