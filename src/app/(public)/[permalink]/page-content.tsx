import { type FC } from "react";
import { fetchCustomPageAction } from "./(actions)/fetchCustomPageAction";
import { redirect } from "next/navigation";

type Props = Readonly<{
  permalink: string;
}>;

export const PageContent: FC<Props> = async ({ permalink }) => {
  const { ok, message, customPage } = await fetchCustomPageAction(permalink);

  if (!ok || !customPage) {
    redirect(`/?error=${encodeURIComponent(message)}`);
  }

  return (
    <>
      <h1 className="level-1">{ customPage.title }</h1>

      <p>{ customPage.content }</p>
    </>
  );
};
