import Link from "next/link";
import { fetchLatestTournamentsAction } from "../../(actions)/fetchLatestTournamentsAction";

export const ActiveTournaments = async () => {
  const { tournaments } = await fetchLatestTournamentsAction({ limit: 5 });

  return (
    <>
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4">
        Torneos Activos
      </h2>
      <div>
        <div className="flex flex-col gap-2">
          {tournaments.map(({ id, name, permalink }) => (
            <Link key={id}
              className="text-sky-500 text-wrap"
              href={`/admin/torneos/${permalink}`}>
              {name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActiveTournaments;