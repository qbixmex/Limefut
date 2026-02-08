import { Suspense } from "react";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GalleryForm } from "../(components)/galleryForm";
import type { Session } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchTeamsForGalleryAction } from "../(actions)";
import { fetchTournamentsForGalleryAction } from "../(actions)/fetchTournamentsForGalleryAction";

const CreateGalleryPage = () => {
  return (
    <Suspense>
      <CreateGalleryContent />
    </Suspense>
  );
};

const CreateGalleryContent = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  const { tournaments } = await fetchTournamentsForGalleryAction();
  const { teams } = await fetchTeamsForGalleryAction();

  if (session && !(session.user.roles as string[]).includes('admin')) {
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