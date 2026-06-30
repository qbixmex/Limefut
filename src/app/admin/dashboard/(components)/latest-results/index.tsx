import { Badge } from '~/src/components/ui/badge';
import { fetchLatestResultsAction } from '../../(actions)/fetchLatestResultsAction';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/src/components/ui/table';
import { LinkDetails } from '../link-details';
import styles from '../../styles.module.css';
import { ROUTES } from '@/shared/constants/routes';

export const LatestResults = async () => {
  const { latestResults } = await fetchLatestResultsAction({ quantity: 10 });

  return (
    <div className={styles.widget}>
      <h2 className={styles.widgetTitle}>
        <span>Últimos Resultados</span>
      </h2>
      {
        (latestResults.length === 0) && (
          <div className={styles.widgetMessageContainer}>
            <p className={styles.widgetMessageText}>
              No hay resultados disponibles
            </p>
          </div>
        )
      }
      {
        (latestResults.length > 0) && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Local</TableHead>
                <TableHead className="text-center w-[150px]">Resultado</TableHead>
                <TableHead>Visitante</TableHead>
                <TableHead className="text-center">Categoría</TableHead>
                <TableHead className="text-center">Formato</TableHead>
                <TableHead>&nbsp;</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="text-right">
                    <p className="text-pretty">{result.localTeamName}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-3 items-center">
                      <div className="text-center">
                        <Badge variant="outline-primary">
                          {result.localTeamScore}
                        </Badge>
                      </div>
                      <div className="text-gray-300 italic group-hover:text-blue-500">vs</div>
                      <div className="text-center">
                        <Badge variant="outline-primary">
                          {result.visitorTeamScore}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <p className="text-pretty">{result.localTeamName}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {
                      result.category
                        ? result.category.name
                        : <Badge variant="outline-secondary">No asignada aún</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    <LinkDetails url={ROUTES.ADMIN_MATCHES_SHOW(result.id)} />
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
