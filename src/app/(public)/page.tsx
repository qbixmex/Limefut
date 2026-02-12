import { type FC, Suspense } from "react";
import { Hero } from "./components/hero/hero";
import { CarouselSkeleton } from "./components/carousel/carousel-skeleton";
import { NextMatches } from "./components/next-matches";
import { LatestResults, MatchesSkeleton } from "./components";
import { HorizontalCalendarSkeleton } from "./components/horizontal-calendar/horizontal-calendar-skeleton";
import { ErrorHandler } from "@/shared/components/errorHandler";

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

      <div className="wrapper">
        <h1 className="hidden">LIMEFUT - Liga menor de fútbol</h1>

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
