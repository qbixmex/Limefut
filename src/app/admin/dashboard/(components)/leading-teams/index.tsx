import { Badge } from "~/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/ui/table";
import { fetchLeadingTeamsAction } from "../../(actions)/fetchLeadingTeamsAction";
import Link from "next/link";
import "../../styles.css";

export const LeadingTeams = async () => {
  const { leadingTeams } = await fetchLeadingTeamsAction({ quantity: 8 });

  return (
    <div className="widget">
      <h2 className="widgetTitle">
        Equipos Punteros
      </h2>
      {
        (leadingTeams.length === 0) && (
          <div className="widgetMessageContainer">
            <p className="widgetMessageText">
              No hay información disponible
            </p>
          </div>
        )
      }
      {
        (leadingTeams.length > 0) && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead className="w-22 text-center">Puntos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadingTeams.map((leading) => (
                <TableRow key={leading.team.id}>
                  <TableCell>
                    <Link
                      href={`/admin/equipos/${leading.team.id}`}
                      className="text-wrap space-x-1"
                      target="_blank"
                    >
                      <span>{leading.team.name},</span>
                      <span>{leading.team.category},</span>
                      <span className="space-x-1">
                        <span>{leading.team.format}</span>
                        <span>vs</span>
                        <span>{leading.team.format}</span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline-primary">{leading.points}</Badge>
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

export default LeadingTeams;
