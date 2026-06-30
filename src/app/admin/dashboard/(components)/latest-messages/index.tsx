import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { fetchLatestMessagesAction } from '../../(actions)/fetchLatestMessagesAction';
import { LinkDetails } from '../link-details';
import styles from '../../styles.module.css';

export const LatestMessages = async () => {
  const { latestMessages } = await fetchLatestMessagesAction({ quantity: 5 });

  return (
    <div className={styles.widget}>
      <h2 className={styles.widgetTitle}>
        <span>Últimos Mensajes</span>
        <span className={styles.widgetDateLength}>(30 días)</span>
      </h2>
      {
        (latestMessages.length === 0) && (
          <div className={styles.widgetMessageContainer}>
            <p className={styles.widgetMessageText}>
              No hay mensajes para mostrar
            </p>
          </div>
        )
      }
      {
        (latestMessages.length > 0) && (
          <Table>
            <TableBody>
              {(latestMessages.length > 0) && latestMessages.map(({ id, message }) => (
                <TableRow key={id}>
                  <TableCell>
                    <p className="italic text-pretty">
                      {message}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <LinkDetails url={`/admin/mensajes/${id}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }
    </div>
  );
};

export default LatestMessages;
