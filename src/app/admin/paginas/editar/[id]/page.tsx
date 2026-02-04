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
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Página</CardTitle>
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
