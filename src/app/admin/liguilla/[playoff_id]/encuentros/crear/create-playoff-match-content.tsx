import type { FC } from 'react';
import { CreatePlayoffsMatchForm } from './create-playoffs-match-form';
import { TeamsSlot } from '../(components)/form-fields/teams-slot';
import { FieldsSlot } from '../(components)/form-fields/fields-slot';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
  }>;
}>;

export const CreatePlayoffMatchContent: FC<Props> = async ({ params }) => {
  const playoffId = (await params).playoff_id;

  return (
    <CreatePlayoffsMatchForm
      playoffId={playoffId}
      teamsSlot={
        <TeamsSlot
          playoffId={playoffId}
        />
      }
      fieldsSlot={
        <FieldsSlot />
      }
    />
  );
};
