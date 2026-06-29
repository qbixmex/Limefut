import { fetchLatestTournamentsAction } from '../../(actions)/fetchLatestTournamentsAction';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { LinkDetails } from '../link-details';
import './active-tournaments.css';
import style from '../../styles.module.css';

export const ActiveTournaments = async () => {
  const { tournaments } = await fetchLatestTournamentsAction();

  return (
    <div className={style.widget}>
      <h2 className={style.widgetTitle}>
        Torneos Activos
      </h2>
      {
        (tournaments.length === 0) && (
          <div className={style.widgetMessageContainer}>
            <p className={style.widgetMessageText}>
              No hay torneos para mostrar
            </p>
          </div>
        )
      }
      {(tournaments.length > 0) && (
        <section className="tournaments-list">
          <Table>
            <TableBody>
              {tournaments.map(({ id, name }) => (
                <TableRow key={id}>
                  <TableCell>
                    <p className="text-pretty">
                      {name}
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
