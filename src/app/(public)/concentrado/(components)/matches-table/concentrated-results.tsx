'use client';

import { type FC } from 'react';
import Link from 'next/link';
import type { DataType } from '../../(actions)/fetchResultsAction';
import { useConcentratedResults } from '../../(hooks)/use-concentrated-results';
import "./styles.css";

type Props = Readonly<{
  data: DataType;
}>;

export const ConcentratedResults: FC<Props> = ({ data }) => {
  const { tournament, results } = data;
  const teams = tournament?.teams || [];

  const { getResultCell } = useConcentratedResults(results, teams);

  if (!tournament || teams.length === 0) {
    return (
      <div className="w-full min-h-[400px] border border-blue-500 rounded flex justify-center items-center">
        <p className="text-sky-500 text-2xl font-semibold italic">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="concentrated-table">
        <thead>
          <tr>
            <th>Equipos</th>
            <th>&nbsp;</th>
            {teams.map((team, index) => (
              <th key={team.id}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((rowTeam, rowIndex) => (
            <tr key={rowTeam.id} data-row={rowIndex + 1} data-team={rowTeam.id}>
              <td data-row-label>
                <Link
                  href={
                    `/equipos/${rowTeam.permalink}`
                    + `?torneo=${tournament.permalink}`
                    + `&categoria=${rowTeam.category}`
                    + `&formato=${rowTeam.format}`
                  }
                  target="_blank"
                >
                  {rowTeam.name}
                </Link>
              </td>
              <td className="position">{rowIndex + 1}</td>
              {teams.map((colTeam, colIndex) => {
                const cellData = getResultCell(rowTeam.id as string, colTeam.id as string);
                const isDiagonal = rowTeam.id === colTeam.id;

                return (
                  <td
                    key={`${rowTeam.id}-${colTeam.id}`}
                    data-col={colIndex + 1}
                    {...(cellData.matchId && {
                      'data-match': cellData.matchId,
                      'data-match-local': rowTeam.id,
                      'data-match-visitor': colTeam.id,
                    })}
                    className={isDiagonal ? 'empty' : cellData.className}
                  >
                    {
                      isDiagonal
                      ? <span>&nbsp;</span>
                      : (
                        <Link
                          href={
                            `/resultados/`
                            + cellData.matchId
                            + '/'
                            + rowTeam.permalink
                            + `-vs-`
                            + colTeam.permalink
                          }
                          target="_blank"
                          className="text-white"
                        >
                          {cellData.content}
                        </Link>
                      )
                    }
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <section className="status">
        <div className="status-item">
          <span>programado</span>
          <span className="status-color status-scheduled" />
        </div>
        <div className="status-item">
          <span>en progreso</span>
          <span className="status-color status-in_progress" />
        </div>
        <div className="status-item">
          <span>cancelado</span>
          <span className="status-color status-canceled" />
        </div>
        <div className="status-item">
          <span>pospuesto</span>
          <span className="status-color status-postposed" />
        </div>
        <div className="status-item">
          <span>finalizado</span>
          <span className="status-color status-completed" />
        </div>
      </section>
    </div>
  );
};

export default ConcentratedResults;
