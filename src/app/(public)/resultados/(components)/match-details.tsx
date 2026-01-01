import type { FC } from "react";

type Props = Readonly<{
  params: Promise<{
    id: string;
    slug: string;
  }>;
}>;

const MatchDetails: FC<Props> = async ({ params }) => {
  const matchId = (await params).id;
  const matchSlug = (await params).slug;

  return (
    <>
      <p><b>Match ID:</b> {matchId}</p>
      <p><b>Match Slug:</b> {matchSlug}</p>
    </>
  );
};

export default MatchDetails;
