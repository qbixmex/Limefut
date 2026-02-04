import { Suspense, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Search } from "@/shared/components/search";
import { TeamsSelectorSkeleton } from "./(components)/teams-selector-skeleton";
import { PlayersContent } from "./(components)/players-content";
import { TeamsSelector } from "./(components)/teams-selector";
import { fetchTeamsAction } from "~/src/shared/actions/fetchTeamsAction";
import { TournamentsSelector } from "../(components)/tournaments-selector";
import { fetchTournamentsAction } from "~/src/shared/actions/fetchTournamentsAction";
import TournamentsSelectorSkeleton from "../equipos/(components)/TournamentsSelectorSkeleton";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    equipo?: string;
    query?: string;
    page?: string;
  }>;
}>;

export const PlayersPage: FC<Props> = ({ searchParams }) => {
  const tournamentIdPromise = searchParams.then((sp) => ({ tournamentId: sp.torneo }));

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Jugadores</CardTitle>
              <section className="flex gap-5 items-center">
                <Search placeholder="Buscar jugador ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/jugadores/crear">
                      <Button variant="outline-primary" size="icon">
                        <Plus strokeWidth={3} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>crear</p>
                  </TooltipContent>
                </Tooltip>
              </section>
            </CardHeader>
            <CardContent>
              <section className="flex flex-col gap-5 mb-10">
                <Suspense fallback={<TournamentsSelectorSkeleton />}>
                  <TournamentsWrapper />
                </Suspense>
                <TournamentsIdProvider tournamentIdPromise={tournamentIdPromise} />
              </section>
              <Suspense>
                <PlayersContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const TournamentsWrapper = async () => {
  const { tournaments } = await fetchTournamentsAction();
  return (
    <TournamentsSelector tournaments={tournaments} />
  );
};

type TeamsWrapperProps = Readonly<{
  tournamentIdPromise: Promise<{
    tournamentId: string | undefined;
  }>;
}>;

const TournamentsIdProvider: FC<TeamsWrapperProps> = async ({ tournamentIdPromise }) => {
  const { tournamentId } = await tournamentIdPromise;

  if (!tournamentId) {
    return null;
  }

  return (
    <Suspense fallback={<TeamsSelectorSkeleton />}>
      <TeamsWrapper tournamentIdPromise={tournamentIdPromise} />
    </Suspense>
  );
};

const TeamsWrapper: FC<TeamsWrapperProps> = async ({ tournamentIdPromise }) => {
  const { tournamentId } = await tournamentIdPromise;

  const { teams } = await fetchTeamsAction(tournamentId as string);

  return (
    <TeamsSelector teams={teams} />
  );
};

export default PlayersPage;