import Link from "next/link";
import { fetchLatestTournamentsAction } from "../../(actions)/fetchLatestTournamentsAction";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { InfoIcon } from "lucide-react";
import "./active-tournaments.css";
import "../../styles.css";

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
                    <Link href={`/admin/torneos/${id}`}>
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
        </section>
      )}
    </div>
  );
};

export default ActiveTournaments;