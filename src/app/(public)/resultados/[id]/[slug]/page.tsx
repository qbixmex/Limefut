import { Suspense, type FC } from "react";
import { MatchContent } from "../../(components)/match-content";
import { Heading } from "../../../components";

type Props = Readonly<{
  params: Promise<{
    id: string;
    slug: string;
  }>;
}>;

const ResultsPage: FC<Props> = ({ params }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600">
        Información del encuentro
      </Heading>
      <Suspense>
        <MatchContent params={params} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
