import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import { fetchLatestMessagesAction } from '../../(actions)/fetchLatestMessagesAction';

export const LatestMessages = async () => {
  const { latestMessages } = await fetchLatestMessagesAction({ quantity: 5 });

  return (
    <>
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4 space-x-2">
        <span>Últimos Mensajes</span>
        <span className="text-emerald-700 text-sm font-normal italic">(30 días)</span>
      </h2>

      <Table>
        <TableBody>
          {(latestMessages.length > 0) && latestMessages.map(({ id, message }) => (
            <TableRow key={id}>
              <TableCell>
                <p className="text-gray-500 italic text-pretty">
                  { message }
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
    </>
  );
};

export default LatestMessages;
