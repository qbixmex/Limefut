import { Suspense, type FC, type ReactNode } from 'react';
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from 'next';
import { MainLayout } from './(components)/main-layout';
import DashboardSkeleton from './(components)/dashboard-skeleton';
import { auth } from "@/lib/auth";
import './layout.styles.css';

export const metadata: Metadata = {
  title: 'Limefut - Admin',
  description: 'Panel de administración',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{ children: ReactNode; }>;

const AdminLayout: FC<Props> = ({ children }) => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </Suspense>
  );
};

const AdminLayoutContent: FC<Props> = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

export default AdminLayout;
