import { Suspense, type FC, type ReactNode } from 'react';
import type { Metadata } from 'next';
import './layout.styles.css';
import { MainLayout } from './(components)/auth-redirect';
import DashboardSkeleton from './(components)/dashboard-skeleton';

export const metadata: Metadata = {
  title: 'Limefut - Admin',
  description: 'Panel de administración',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{ children: ReactNode; }>;

export const AdminLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Suspense fallback={<DashboardSkeleton />}>
        <MainLayout>
          {children}
        </MainLayout>
      </Suspense>
    </>
  );
};

export default AdminLayout;