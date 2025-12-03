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

export const CreateGallery = async () => {
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear galerías !';
    redirect(`/admin/galerias?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Galería</CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryForm session={session as Session} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGallery;