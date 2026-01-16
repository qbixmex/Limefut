import type { FC } from 'react';
import "./matches-table/styles.css";

export const ConcentratedMatchesSkeleton: FC = () => {

  return (
    <div className="animate-pulse">
      <table className="concentrated-table">
        <thead>
          <tr>
            <th>
              <div className="w-[120px] h-8 ml-auto bg-gray-600 rounded" />
            </th>
            <th>&nbsp;</th>
            {Array.from({ length: 8 }).map((_, row) => (
              <th key={`row-${row}`}>
                <div className="w-8 m-auto h-8 bg-gray-600 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, row) => (
            <tr key={`row-${row}`}>
              <td>
                <div className="w-[120px] ml-auto h-8 bg-gray-600 rounded" />
              </td>
              <td className="position">
                <div className="w-8 m-auto h-8 bg-gray-600 rounded" />
              </td>
              {Array.from({ length: 8 }).map((_, col) => (
                <td key={`col-${col}`} className="empty"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <section className="status">
        {Array.from({ length: 5 }).map((_, item) => (
          <div key={`item-${item}`} className="w-full flex gap-5 justify-end">
            <div className="w-25 h-5 bg-gray-600 rounded" />
            <div className="size-5 bg-gray-600 rounded" />
          </div>
        ))}
      </section>
    </div>
  );

};

export default ConcentratedMatchesSkeleton;
