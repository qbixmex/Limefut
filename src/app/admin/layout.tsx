import { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { Container } from "./(components)/container";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import SignOut from "@/shared/components/signOut";

export const metadata: Metadata = {
  title: "Limefut - Admin",
  description: "Panel de administración",
  robots: "noindex, nofollow",
};

type Props = Readonly<{ children: ReactNode; }>;

export const AdminLayout: FC<Props> = async ({ children }) => {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <Container>
      <nav className="flex justify-end mx-5 my-10">
        <SignOut />
      </nav>

      <main>
        {children}
      </main>
    </Container>
  );
};

export default AdminLayout;