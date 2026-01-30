import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchPageAction } from "../../(actions)/fetchPageAction";
import { PageForm } from "../../(components)/page-form";

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCustomPage: FC<Props> = async ({ params }) => {
  const pageId = (await params).id;
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para actualizar páginas !';
    redirect(`/admin/paginas?error=${encodeURIComponent(message)}`);
  }

  const response = await fetchPageAction(session?.user.roles ?? [], pageId);

  if (!response.page) {
    const message = `¡ La página con el id: "${pageId}", no existe ❌ !`;
    redirect(`/admin/paginas?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Editar Página</CardTitle>
          </CardHeader>
          <CardContent>
            <PageForm
              key={response.page.id}
              page={response.page}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCustomPage;
