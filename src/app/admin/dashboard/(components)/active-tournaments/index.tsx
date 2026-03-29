import { fetchLatestTournamentsAction } from '../../(actions)/fetchLatestTournamentsAction';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import './active-tournaments.css';
import { LinkDetails } from '../link-details';
import '../../styles.css';

export const ActiveTournaments = async () => {
  const { tournaments } = await fetchLatestTournamentsAction();

  return (
    <div className="widget">
      <h2 className="widgetTitle">
        Torneos Activos
      </h2>
      {
        (tournaments.length === 0) && (
          <div className="widgetMessageContainer">
            <p className="widgetMessageText">
              No hay torneos para mostrar
            </p>
          </div>
        )
      }
      {(tournaments.length > 0) && (
        <section className="tournaments-list">
          <Table>
            <TableBody>
              {tournaments.map(({ id, name, category, format }) => (
                <TableRow key={id}>
                  <TableCell>
                    <p className="text-pretty">
                      {name}, {category}, {format} vs {format}
                    </p>
                  </TableCell>
                  <TableCell>
                    <LinkDetails url={`/admin/torneos/${id}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
};

export default ActiveTournaments;
