import { type FC, Suspense } from "react";
import Image from "next/image";
import { Heading } from "./components/heading";
import { NextMatches } from "./components/next-matches";
import { LatestResults, MatchesSkeleton } from "./components";
import { HorizontalCalendarSkeleton } from "./components/horizontal-calendar/horizontal-calendar-skeleton";
import styles from "./home-styles.module.css";

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
    <div className="bg-neutral-50 md:rounded p-5 flex-1 flex flex-col gap-5">
      <Heading level="h1" className="text-green-900">
        Bienvenidos a LIMEFUT
      </Heading>

      <section className={styles.banners}>
        <Image
          src="/images/kid-playing-football.png"
          width={640}
          height={640}
          alt="Inscripciones"
          className="rounded"
        />
        <Image
          src="/images/set-aside-spot.jpg"
          width={640}
          height={640}
          alt="Aparta tu lugar"
          className="rounded"
        />
      </section>

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
  );
};

export default HomePage;
