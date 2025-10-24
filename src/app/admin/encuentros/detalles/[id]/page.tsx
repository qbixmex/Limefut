import { FC } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth.config";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Minus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { fetchMatchAction } from "../../(actions)";
import type { Match } from '@/shared/interfaces';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getMatchStatus } from "../../(helpers)/place";
import { TbSoccerField } from "react-icons/tb";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const MatchPage: FC<Props> = async ({ params }) => {
  const session = await auth();
  const id = (await params).id;

  const response = await fetchMatchAction(id, session?.user.roles ?? null);

  if (!response.ok) {
    redirect(`/admin/encuentros?error=${encodeURIComponent(response.message)}`);
  }

  const match = response.match as Match;

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800 relative">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-xl font-bold text-green-500">Detalles del Encuentro</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
              <div className="bg-gray-200 dark:bg-green-900/40 size-[512px] rounded-xl flex items-center justify-center">
                <TbSoccerField size={480} strokeWidth={1} className="text-gray-400" />
              </div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold w-[180px]">Encuentro</TableHead>
                    <TableCell className="flex items-center gap-3 font-semibold text-gray-200">
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
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Arbitro</TableHead>
                    <TableCell>{match.referee}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Sede</TableHead>
                    <TableCell>{match.place}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Fecha del Encuentro</TableHead>
                    <TableCell>
                      {
                        match.matchDate
                          ? format(match.matchDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                          : 'No Proporcionado'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Fecha de creación</TableHead>
                    <TableCell>
                      {format(new Date(match?.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">Última Actualización</TableHead>
                    <TableCell>
                      {format(new Date(match?.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableCell>
                      <Badge variant={getMatchStatus(match.status).variant}>
                        {getMatchStatus(match.status).label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            <div className="absolute top-5 right-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/encuentros/editar/${match.id}`}>
                    <Button variant="outline-warning" size="icon">
                      <Pencil />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchPage;