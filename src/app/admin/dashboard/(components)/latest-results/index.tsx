import Link from "next/link";
import { Badge } from "~/src/components/ui/badge";
import { fetchLatestResultsAction } from "../../(actions)/fetchLatestResultsAction";

export const LatestResults = async () => {
  const { latestResults } = await fetchLatestResultsAction({ quantity: 5 });

  return (
    <div>
      <h2 className="text-emerald-500 text-2xl font-semibold mb-4">
        Últimos Resultados
      </h2>
      <div>
        <div className="flex flex-col gap-2">
          {latestResults.map((result) => (
            <Link key={result.id} href={`/admin/encuentros/detalles/${result.id}`} className="group">
              <div className="grid grid-cols-[1fr_30px_50px_30px_1fr] place-items-center">
                <div className="text-gray-200 group-hover:text-blue-500 italic text-center">
                  { result.localTeamName.substring(0, 15) } ...
                </div>
                <div className="text-center">
                  <Badge variant="outline-primary">
                    {result.localTeamScore}
                  </Badge>
                </div>
                <div className="text-gray-300 italic group-hover:text-blue-500">vs</div>
                <div className="text-center">
                  <Badge variant="outline-primary">
                    {result.visitorTeamScore}
                  </Badge>
                </div>
                <div className="text-gray-200 group-hover:text-blue-500 italic text-center">
                  { result.visitorTeamName.substring(0, 14) } ...
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestResults;