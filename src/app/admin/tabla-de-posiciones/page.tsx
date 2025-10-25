import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { StandingsContainer } from "./(components)";
import { fetchTournamentsAction, type TournamentType } from "./(actions)/fetchTournamentsAction";

export const StandingsPage = async () => {
  // const session = await auth();

  const response = await fetchTournamentsAction();
  const tournaments = response.tournaments;

  return (
    <>
      <ErrorHandler />
      <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 flex rounded-xl md:min-h-min p-10">
          <Card className="w-full bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-800 shadow-none">
            <CardHeader>
              <CardTitle>Tabla de posiciones</CardTitle>
            </CardHeader>
            <CardContent>
               <StandingsContainer tournaments={tournaments as TournamentType[]} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StandingsPage;