import { Suspense, type FC } from "react";
import { MatchDetails } from "./match-details";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const MatchContent: FC<Props> = async ({ params }) => {
  const matchId = (await params).id;

  return (
    <>
      <Suspense>
        <MatchDetails matchId={matchId} />
      </Suspense>
    </>
  );
};

export default MatchContent;
