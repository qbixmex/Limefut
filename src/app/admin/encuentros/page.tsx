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
import { MatchesTableSkeleton } from "./(components)/matches-table-skeleton";
import { Search } from "@/root/src/shared/components/search";
import { MatchesWrapper } from "./(components)/matches.wrapper";
import ClearFilters from "./(components)/clear-filters";

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortMatchDate?: 'asc' | 'desc';
    sortWeek?: 'asc' | 'desc';
  }>;
}>;

export const MatchesPage: FC<Props> = async (props) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const sortMatchDate = searchParams?.sortMatchDate;
  const sortWeek = searchParams?.sortWeek ?? 'desc';

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Lista de Encuentros</CardTitle>
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
              <Suspense
                key={`${query}-${currentPage}`}
                fallback={<MatchesTableSkeleton colCount={6} rowCount={16} />}
              >
                <MatchesWrapper
                  query={query}
                  currentPage={currentPage}
                  sortMatchDate={sortMatchDate}
                  sortWeek={sortWeek}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MatchesPage;