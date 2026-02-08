import { type FC, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { TournamentsTable } from "./(components)/tournamentsTable";
import { TournamentsTableSkeleton } from "./(components)/tournaments-table-skeleton";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Search } from "@/shared/components/search";

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const TournamentPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <TournamentContent searchParams={searchParams} />
    </Suspense>
  );
};

const TournamentContent: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query || '';
  const currentPage = (await searchParams).page || '1';

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
        <div className="admin-page-container">
          <Card className="admin-page-card">
            <CardHeader className="admin-page-card-header">
              <CardTitle className="admin-page-card-title">Lista de Torneos</CardTitle>
              <section className="flex gap-5 mt-3 lg:mt-0 items-center">
                <Search placeholder="Buscar torneo ..." />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/torneos/crear">
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
              <Suspense
                key={`${query ?? 'query'}-${currentPage}`}
                fallback={<TournamentsTableSkeleton colCount={7} rowCount={8} />}
              >
                <TournamentsTable query={query} currentPage={currentPage} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TournamentPage;