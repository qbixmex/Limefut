import { randomUUID } from "node:crypto";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TournamentForm } from "../(components)/tournamentForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Session } from "@/lib/auth-client";
import { Suspense } from "react";

const CreateTournamentPage = async () => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreateUserContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CreateUserContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear torneos !';
    redirect(`/admin/torneos?error=${encodeURIComponent(message)}`);
  }

  return (
    <TournamentForm
      key={randomUUID()}
      session={session as Session}
    />
  );
};

export default CreateTournamentPage;
