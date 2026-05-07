import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { fetchResultsAction } from '../../(actions)/fetchResultsAction';
import ConcentratedResults from './concentrated-results';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  tournament: string;
  category: string;
}>;

export const MatchesTable: FC<Props> = async ({ tournament, category }) => {
  const { ok, message, data } = await fetchResultsAction(tournament, category);

  if (!ok) {
    redirect(`${ROUTES.PUBLIC_CONCENTRATED}?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="table-scroll">
      <ConcentratedResults data={data} />
    </div>
  );
};

export default MatchesTable;
