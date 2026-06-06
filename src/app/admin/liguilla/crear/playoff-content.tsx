import type { FC } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
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

export const PlayoffContent: FC<Props> = async ({ searchParams }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { tournament, category } = await searchParams;

  return (
    <CreatePlayoffsForm
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      tournamentSlot={
        <TournamentSelectField
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
        />
      }
      categorySlot={
        <CategorySelectField
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
        />
      }
      teamsSlot={
        <TeamsSelectField
          key={`${category ?? 'category'}`}
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
          tournamentPermalink={tournament}
          categoryPermalink={category}
        />
      }
    />
  );
};
