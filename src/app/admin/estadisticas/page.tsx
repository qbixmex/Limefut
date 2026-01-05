import { type FC, Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { TournamentsSelectorSkeleton } from "./(components)/tournaments-selector-skeleton";
import { TournamentsWrapper } from "./(components)/tournaments-wrapper";
import { StandingsContainer } from "./(components)/StandingsContainer";

export const metadata: Metadata = {
  title: 'Tabla de posiciones',
  description: 'Tabla de posiciones por torneo.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
  }>;
}>;

export const StandingsPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader>
              <CardTitle>Tabla de posiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <TournamentsWrapper />
              </Suspense>
              <Suspense>
                <StandingsContainer searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StandingsPage;