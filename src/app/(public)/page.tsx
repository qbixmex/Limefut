import { type FC, Suspense } from "react";
import { Heading } from "./components/heading";
import { NextMatches } from "./components/next-matches";
import { LatestResults, MatchesSkeleton } from "./components";
import { HorizontalCalendarSkeleton } from "./components/horizontal-calendar/horizontal-calendar-skeleton";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Hero } from "./components/hero/hero";
import { CarouselSkeleton } from "./components/carousel/carousel-skeleton";

type Props = Readonly<{
  searchParams: Promise<{
    "next-matches"?: string;
    "latest-results"?: string;
  }>;
}>;

const HomePage: FC<Props> = ({ searchParams }) => {
  const matchesPromise = searchParams.then((sp) => ({ matchesPage: sp['next-matches'] }));
  const resultsPromise = searchParams.then((sp) => ({ latestResultsPage: sp['latest-results'] }));

  return (
    <>
      <Suspense>
        <ErrorHandler />
      </Suspense>

      <div className="bg-zinc-100 dark:bg-zinc-900 md:rounded p-5 flex-1 flex flex-col gap-5">
        <Heading level="h1" className="text-emerald-900 dark:text-emerald-500 text-center">
          Bienvenidos a LIMEFUT
        </Heading>

        <Suspense fallback={<CarouselSkeleton />}>
          <Hero />
        </Suspense>

        <Suspense fallback={
          <>
            <HorizontalCalendarSkeleton />
            <MatchesSkeleton />
          </>
        }>
          <NextMatches matchesPromise={
            matchesPromise as Promise<{ matchesPage: string }>
          } />
        </Suspense>

        <Suspense fallback={<MatchesSkeleton />}>
          <LatestResults
            resultsPromise={
              resultsPromise as Promise<{ latestResultsPage: string }>
            }
          />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
