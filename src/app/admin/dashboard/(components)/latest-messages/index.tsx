import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import { fetchLatestMessagesAction } from '../../(actions)/fetchLatestMessagesAction';
import "../../styles.css";

export const LatestMessages = async () => {
  const { latestMessages } = await fetchLatestMessagesAction({ quantity: 5 });

  return (
    <div className="widget">
      <h2 className="widgetTitle">
        <span>Últimos Mensajes</span>
        <span className="widgetDateLength">(30 días)</span>
      </h2>
      {
        (latestMessages.length === 0) && (
          <div className="widgetMessageContainer">
            <p className="widgetMessageText">
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
                    <p className="text-gray-500 italic text-pretty">
                      {message}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/mensajes/${id}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline-info" size="icon-sm">
                            <InfoIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          ver detalles
                        </TooltipContent>
                      </Tooltip>
                    </Link>
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
