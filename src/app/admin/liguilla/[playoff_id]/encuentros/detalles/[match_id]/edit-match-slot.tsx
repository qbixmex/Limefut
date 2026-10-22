import type { FC } from 'react';
import { EditMatch } from '../../(components)/edit-match';

type Props = Readonly<{
  params: Promise<{
    match_id: string;
    playoff_id: string;
  }>;
}>;

export const EditMatchSlot: FC<Props> = async ({ params }) => {
  const { playoff_id: playoffId, match_id: matchId } = await params;

  return <EditMatch playoffId={playoffId} matchId={matchId} />;
};
