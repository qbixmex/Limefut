import { Suspense, type FC } from "react";
import { StandingsTable } from "./standings-table";
import { StandingsSkeleton } from "./standings-skeleton";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
  }>;
}>;

export const Standings: FC<Props> = async ({ searchParams }) => {
  const {
    torneo: tournament,
    categoria: category,
    formato: format,
  } = await searchParams;

  if (!tournament && !category && !format) {
    return null;
  }

  return (
    <Suspense
      key={
        `${tournament ?? 'tournament'}`
        + `-${category ?? 'category'}`
        + `-${format ?? 'format'}`
      }
      fallback={<StandingsSkeleton />}
    >
      <StandingsTable
        tournament={tournament}
        category={category}
        format={format}
      />
    </Suspense>
  );
};

export default Standings;
