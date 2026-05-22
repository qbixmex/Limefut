'use client';

import type { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MATCH_STATUS } from '@/shared/enums';
import { useMatchForm } from './use-match-form';
import { LocalTeamField } from './local-team-field';
import { MatchDateTimeFields } from './match-datetime-fields';
import { PlaceField } from './place-field';
import { RefereeField } from './referee-field';
import { ScoreField } from './score-field';
import { StatusField } from './status-field';
import { UpdateMatchScore } from './update-match-score';
import { VisitorTeamField } from './visitor-team-field';
import { WeekField } from './week-field';
import type { Props } from './form-types';
import { InvertTeams } from './invert-teams';
import { TournamentSelectField } from './tournament-select-field';
import { CategorySelectField } from './category-select-field';
import styles from './match-form.module.css';

export const MatchForm: FC<Props> = ({
  authenticatedUserId,
  sessionUserRoles,
  tournaments,
  categories,
  teams,
  week,
  match,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    form,
    hiddenScores,
    setHiddenScores,
    handleFlipTeams,
    handleNavigateBack,
    onSubmit,
  } = useMatchForm({
    authenticatedUserId,
    sessionUserRoles,
    match,
    week,
    router,
    searchParams,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
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
              <InvertTeams flipCallback={handleFlipTeams} />
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

        {/* Buttons */}
        <section className={styles.buttons}>
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
          >
            cancelar
          </Button>

          {hiddenScores && (
            <Button
              type="button"
              variant="outline-info"
              onClick={() => setHiddenScores(false)}
            >
              modificar marcadores
            </Button>
          )}

          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>guardar</span>
            )}
          </Button>

          {!hiddenScores && match?.status === MATCH_STATUS.COMPLETED && (
            <UpdateMatchScore match={match} />
          )}
        </section>
      </form>
    </Form>
  );
};
