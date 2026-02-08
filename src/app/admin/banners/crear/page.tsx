import { Suspense } from "react";
import { headers } from "next/headers";
import type { Session } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BannerForm } from "../(components)/banner-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const CreateBannerPage = () => {
  return (
    <Suspense>
      <CreateBannerContent />
    </Suspense>
  );
};

const CreateBannerContent = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear banners !';
    redirect(`/admin/banners?error=${encodeURIComponent(message)}`);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">
              Crear Hero Banner
            </CardTitle>
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
