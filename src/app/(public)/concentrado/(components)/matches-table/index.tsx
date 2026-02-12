import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { fetchResultsAction } from '../../(actions)/fetchResultsAction';
import ConcentratedResults from './concentrated-results';

type Props = Readonly<{
  tournament?: string;
  category?: string;
  format?: string;
}>;

export const MatchesTable: FC<Props> = async ({
  tournament,
  category,
  format,
}) => {
  if (!tournament || !category || !format) {
    redirect(`/resultados?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  }

  const { ok, message, data } = await fetchResultsAction(tournament, category, format);

  if (!ok) {
    redirect(`/encuentros?error=${encodeURIComponent(message)}`);
  }

  if (!tournament || !category || !format) {
    redirect(`/encuentros?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  }

  return (
    <div className="table-scroll">
      <ConcentratedResults data={data} />
    </div>
  );
};

export default MatchesTable;
