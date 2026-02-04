import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GalleryForm } from "../(components)/galleryForm";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchTeamsForGalleryAction } from "../(actions)";
import { fetchTournamentsForGalleryAction } from "../(actions)/fetchTournamentsForGalleryAction";

export const CreateGalleryPage = async () => {
  const session = await auth();

  const { tournaments } = await fetchTournamentsForGalleryAction();
  const { teams } = await fetchTeamsForGalleryAction();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear galerías !';
    redirect(`/admin/galerias?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Galería</CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryForm
              session={session as Session}
              tournaments={tournaments}
              teams={teams}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGalleryPage;