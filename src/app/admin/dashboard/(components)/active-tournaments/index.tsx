import Link from "next/link";
import { fetchLatestTournamentsAction } from "../../(actions)/fetchLatestTournamentsAction";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { InfoIcon } from "lucide-react";

export const ActiveTournaments = async () => {
  const { tournaments } = await fetchLatestTournamentsAction({ limit: 5 });

  return (
    <>
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4">
        Torneos Activos
      </h2>
      <Table>
        <TableBody>
          {tournaments.map(({ id, name, permalink }) => (
            <TableRow key={id}>
              <TableCell>
                {name}
              </TableCell>
              <TableCell>
                <Link href={`/admin/torneos/${permalink}`}>
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

export default ActiveTournaments;