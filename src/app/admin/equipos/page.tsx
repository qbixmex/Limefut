import { type FC, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { TournamentsSelector } from "../(components)/tournaments-selector";
import { TeamsContent } from "./(components)/teams-content";
import { ClearFilters } from "./(components)/clear-filters";
import { TournamentsSelectorSkeleton } from "./(components)/TournamentsSelectorSkeleton";
import { fetchTournamentsAction } from '@/shared/actions/fetchTournamentsAction';
import { Search } from "@/shared/components/search";
import { ErrorHandler } from "@/shared/components/errorHandler";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    query?: string;
    page?: string;
  }>;
}>;

const TeamsPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Equipos</CardTitle>
              <section className="flex gap-5 items-center">
                <ClearFilters />
                <Search placeholder="Buscar equipo ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/equipos/crear">
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
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <TournamentsContent />
              </Suspense>
              <Suspense>
                <ErrorHandler />
                <TeamsContent searchParamsPromise={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const TournamentsContent = async () => {
  const { tournaments } = await fetchTournamentsAction();

  return (
    <TournamentsSelector tournaments={tournaments} />
  );
};

export default TeamsPage;