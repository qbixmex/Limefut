import { Suspense, type FC } from "react";
import MatchDetails from "../../(components)/match-details";

type Props = Readonly<{
  params: Promise<{
    id: string;
    slug: string;
  }>;
}>;

const ResultsPage: FC<Props> = ({ params }) => {
  return (
    <Suspense>
      <MatchDetails params={params} />
    </Suspense>
  );
};

export default ResultsPage;
