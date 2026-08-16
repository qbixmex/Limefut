import type { FC } from 'react';
import { CreatePlayoffsForm } from './create-playoffs-form';
import { TournamentSelectField } from '../(components)/form-fields/tournament-select-field';
import { CategorySelectField } from '../(components)/form-fields/category-select-field';
import { TeamsSelectField } from '../(components)/form-fields/teams-select-field';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const CreatePlayoffContent: FC<Props> = async ({ searchParams }) => {
  const { tournament, category } = await searchParams;

  return (
    <CreatePlayoffsForm
      tournamentSlot={
        <TournamentSelectField />
      }
      categorySlot={
        <CategorySelectField />
      }
      teamsSlot={
        <TeamsSelectField
          key={`${tournament ?? 'tournament'}-${category ?? 'category'}`}
          tournamentPermalink={tournament}
          categoryPermalink={category}
        />
      }
    />
  );
};
