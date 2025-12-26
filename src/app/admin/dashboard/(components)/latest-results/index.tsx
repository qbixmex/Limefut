import { Badge } from "~/src/components/ui/badge";
import { fetchLatestResultsAction } from "../../(actions)/fetchLatestResultsAction";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/ui/table";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { Button } from "~/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import "../../styles.css";

export const LatestResults = async () => {
  const { latestResults } = await fetchLatestResultsAction({ quantity: 5 });

  return (
    <div className="widget">
      <h2 className="widgetTitle">
        <span>Últimos Resultados</span>
      </h2>
      {
        (latestResults.length === 0) && (
          <div className="widgetMessageContainer">
            <p className="widgetMessageText">
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
                  <TableCell>
                    <Link href={`/admin/encuentros/detalles/${result.id}`}>
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

export default LatestResults;
