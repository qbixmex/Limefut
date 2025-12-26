import { Badge } from "~/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/ui/table";
import { fetchLeadingTeamsAction } from "../../(actions)/fetchLeadingTeamsAction";
import Link from "next/link";

export const LeadingTeams = async () => {
  const { leadingTeams } = await fetchLeadingTeamsAction({ quantity: 100 });

  return (
    <>
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4">
        Equipos Punteros
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipo</TableHead>
            <TableHead>Torneo</TableHead>
            <TableHead className="text-center">Puntos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadingTeams.map((leading) => (
            <TableRow key={leading.team.id}>
              <TableCell>
                <Link
                  href={`/admin/equipos/${leading.team.permalink}`}
                  className="text-wrap">
                  {leading.team.name}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/torneos/${leading.tournament.permalink}`}
                  className="text-wrap"
                >
                  {leading.tournament.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline-primary">{leading.points}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default LeadingTeams;
