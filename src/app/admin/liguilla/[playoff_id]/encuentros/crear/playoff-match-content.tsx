import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CreatePlayoffsMatchForm } from './create-playoffs-match-form';
import { TeamsSlot } from './form-fields/teams-slot';
import { FieldsSlot } from './form-fields/fields-slot';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
  }>;
}>;

export const PlayoffMatchContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const playoffId = (await params).playoff_id;

  return (
    <CreatePlayoffsMatchForm
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      playoffId={playoffId}
      teamsSlot={
        <TeamsSlot
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
          playoffId={playoffId}
        />
      }
      fieldsSlot={
        <FieldsSlot
          authenticatedUserId={session?.user.id}
          authenticatedUserRoles={session?.user.roles}
        />
      }
    />
  );
};
