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
import ClearFilters from "./(components)/clear-filters";
import { fetchTournamentsForMatchAction } from './(actions)/fetchTournamentsForMatchAction';
import { TournamentsSelector } from "../(components)/tournaments-selector";
import { MatchesContent } from "./matches-content";
import type { MATCH_STATUS_TYPE } from "@/shared/enums";
import { TournamentsSelectorSkeleton } from "../../(public)/components";

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortMatchDate?: 'asc' | 'desc';
    sortWeek?: 'asc' | 'desc';
    torneo?: string;
    status?: MATCH_STATUS_TYPE;
  }>;
}>;

export const MatchesPage: FC<Props> = (props) => {
  const searchParams = props.searchParams;

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Encuentros</CardTitle>
              <section className="flex gap-5 items-center">
                <ClearFilters />
                <Search placeholder="Buscar encuentro ..." />
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
              </section>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <TournamentsWrapper />
              </Suspense>
              <Suspense>
                <MatchesContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const TournamentsWrapper = async () => {
  const { tournaments } = await fetchTournamentsForMatchAction();

  return (
    <TournamentsSelector tournaments={tournaments} />
  );
};

export default MatchesPage;
