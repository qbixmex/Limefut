import type { FC, ReactNode } from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchAdminGlobalSettingsAction } from '@/app/admin/ajustes-globales/(actions)/fetchAdminGlobalSettingsAction';
import { MainLayout } from './(components)/main-layout';
import DashboardSkeleton from './(components)/dashboard-skeleton';
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
  const { globalSettings } = await fetchAdminGlobalSettingsAction();

  return (
    <MainLayout settings={globalSettings}>
      {children}
    </MainLayout>
  );
};

export default AdminLayout;
