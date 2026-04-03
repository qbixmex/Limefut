import type { FC } from 'react';
import { Suspense } from 'react';
import { Hero } from './components/hero';
import { CarouselSkeleton } from './components/carousel/carousel-skeleton';
import { CalendarMatches } from './components/calendar-matches';
import { LatestResults, MatchesSkeleton } from './components';
import { HorizontalCalendarSkeleton } from './components/horizontal-calendar/horizontal-calendar-skeleton';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { LatestImages } from './components/latest-images';
import { Sidebar } from './components/sidebar';
import { LatestImagesSkeleton } from './components/latest-images/latest-images-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    'next-matches'?: string;
    'latest-results'?: string;
    'selected-day'?: string;
  }>;
}>;

const HomePage: FC<Props> = ({ searchParams }) => {
  const matchesPromise = searchParams.then((sp) => ({ matchesPage: sp['next-matches'] }));
  const resultsPromise = searchParams.then((sp) => ({ latestResultsPage: sp['latest-results'] }));
  const selectedDayPromise = searchParams.then((sp) => ({ selectedDay: sp['selected-day'] }));

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <main className="w-full">
        <h1 className="visually-hidden">Limefut - Liga menor de fútbol</h1>
        <Suspense>
          <ErrorHandler />
        </Suspense>
        <div className="wrapper">
          <Suspense fallback={<CarouselSkeleton />}>
            <Hero />
          </Suspense>
          <Suspense fallback={
            <>
              <HorizontalCalendarSkeleton />
              <MatchesSkeleton />
            </>
          }>
            <CalendarMatches
              matchesPromise={matchesPromise}
              selectedDayPromise={selectedDayPromise}
            />
          </Suspense>
          <Suspense fallback={<MatchesSkeleton />}>
            <LatestResults
              resultsPromise={
                resultsPromise as Promise<{ latestResultsPage: string }>
              }
            />
          </Suspense>
          <Suspense fallback={<LatestImagesSkeleton />}>
            <LatestImages />
          </Suspense>
        </div>
      </main>
      <Sidebar />
    </div>
  );
};

export default HomePage;
