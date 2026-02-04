import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BannerForm } from "../(components)/banner-form";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const CreateBannerPage = async () => {
  const session = await auth();

  if (!session?.user.roles.includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear banners !';
    redirect(`/admin/banners?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Hero Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <BannerForm session={session as Session} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBannerPage;
