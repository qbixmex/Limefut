import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GalleryForm } from "../../(components)/galleryForm";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchTeamsForGalleryAction, fetchGalleryAction } from "../../(actions)";
import { fetchTournamentsForGalleryAction } from "../../(actions)/fetchTournamentsForGalleryAction";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const EditGalleryPage: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;
  const session = await auth();

  const response = await fetchGalleryAction(session?.user.roles ?? [], permalink);

  if (!response.ok && !response.gallery) {
    redirect('/admin/galleries');
  }

  const { tournaments } = await fetchTournamentsForGalleryAction();
  const { teams } = await fetchTeamsForGalleryAction();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para actualizar galerías !';
    redirect(`/admin/galerias?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Galería</CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryForm
              session={session as Session}
              tournaments={tournaments}
              teams={teams}
              gallery={response.gallery!}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditGalleryPage;