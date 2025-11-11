import { type FC, Suspense } from "react";
import Image from "next/image";
import styles from "./home-styles.module.css";
import { Heading } from "./components/heading";
import { NextMatches } from "./components/next-matches";
import { HorizontalCalendar, MatchesSkeleton } from "./components";
import { HorizontalCalendarSkeleton } from "./components/horizontal-calendar/horizontal-calendar-skeleton";

type Props = Readonly<{
  searchParams: Promise<{
    "next-matches"?: string;
  }>;
}>;

const HomePage: FC<Props> = ({ searchParams }) => {
  const matchesPromise = searchParams.then((sp) => ({ matchesPage: sp['next-matches'] }));

  return (
    <div className="bg-gray-50 md:rounded p-5 flex-1 flex flex-col gap-5">
      <Heading level="h1" className="text-green-900">
        Bienvenidos a LIMEFUT
      </Heading>

      <section className={styles.banners}>
        <Image
          src="/images/inscription.jpg"
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

      <Suspense fallback={<HorizontalCalendarSkeleton />}>
        <HorizontalCalendar />
      </Suspense>

      <Suspense fallback={<MatchesSkeleton />}>
        <NextMatches matchesPromise={
          matchesPromise as Promise<{ matchesPage: string }>
        } />
      </Suspense>
    </div>
  );
};

export default HomePage;
