import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pencil,
  InfoIcon,
  Plus,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DeleteMatch } from "./(components)/delete-match";
import { fetchMatchesAction } from "./(actions)";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { auth } from "@/auth.config";
import { getMatchStatus } from "./(helpers)/place";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const MatchesPage = async () => {
  const response = await fetchMatchesAction();
  const matches = response.matches;

  const session = await auth();

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Encuentros</CardTitle>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/encuentros/crear">
                      <Button variant="outline-primary" size="icon">
                        <Plus strokeWidth={3} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>crear</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              {matches && matches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Encuentro</TableHead>
                      <TableHead className="w-[100px] text-center">Semana</TableHead>
                      <TableHead className="w-[120px]">Estado</TableHead>
                      <TableHead>Sede</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="grid grid-cols-[1fr_50px_50px_50px_1fr] gap-2 font-semibold text-gray-500">
                          <Link href={`/admin/equipos/${match.localTeam.permalink}`}>
                            {match.localTeam.name}
                          </Link>
                          <Badge variant="outline-info">{match.localScore}</Badge>
                          <Minus strokeWidth={2} />
                          <Badge variant="outline-info">{match.visitorScore}</Badge>
                          <Link href={`/admin/equipos/${match.localTeam.permalink}`}>
                            {match.visitorTeam.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline-info">{match.week}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getMatchStatus(match.status).variant}>
                            {getMatchStatus(match.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell>{match.place}</TableCell>
                        <TableCell>
                          {format(new Date(match?.matchDate), "d 'de' MMMM 'del' yyyy", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/encuentros/detalles/${match.id}`}>
                                  <Button variant="outline-info" size="icon">
                                    <InfoIcon />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                detalles
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/encuentros/editar/${match.id}`}>
                                  <Button variant="outline-warning" size="icon">
                                    <Pencil />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>editar</p>
                              </TooltipContent>
                            </Tooltip>
                            <DeleteMatch
                              id={match.id}
                              roles={session?.user.roles as string[]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="bg-sky-600 p-5 rounded">
                  <p className="text-center text-xl font-bold">Todavía no hay encuentros creados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MatchesPage;