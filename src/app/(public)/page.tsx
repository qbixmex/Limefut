import type { FC } from 'react';
import { Suspense } from 'react';
import { Hero } from './components/hero';
import { CarouselSkeleton } from './components/carousel/carousel-skeleton';
import { NextMatches } from './components/next-matches';
import { HorizontalCalendar, LatestResults, MatchesSkeleton } from './components';
import { HorizontalCalendarSkeleton } from './components/horizontal-calendar/horizontal-calendar-skeleton';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { LatestImages } from './components/latest-images';

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
    <>
      <Suspense>
        <ErrorHandler />
      </Suspense>

      <div className="wrapper">
        <h1 className="visually-hidden">Limefut - Liga menor de fútbol</h1>

        <Suspense fallback={<CarouselSkeleton />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<HorizontalCalendarSkeleton />}>
          <HorizontalCalendar />
        </Suspense>

        <Suspense fallback={<MatchesSkeleton />}>
          <NextMatches
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

        <Suspense fallback={<p>Cargando imágenes recientes</p>}>
          <LatestImages />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
