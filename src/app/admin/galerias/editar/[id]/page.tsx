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
    id: string;
  }>;
}>;

export const EditGalleryPage: FC<Props> = async ({ params }) => {
  const galleryId = (await params).id;
  const session = await auth();

  const response = await fetchGalleryAction(session?.user.roles ?? [], galleryId);

  if (!response.ok && !response.gallery) {
    redirect('/admin/gallerias');
  }

  const { tournaments } = await fetchTournamentsForGalleryAction();
  const { teams } = await fetchTeamsForGalleryAction();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para actualizar galerías !';
    redirect(`/admin/galerias?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Galería</CardTitle>
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