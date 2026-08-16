import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BannerForm } from '../(components)/banner-form';

const CreateBannerPage = () => {
  return (
    <Suspense>
      <CreateBannerContent />
    </Suspense>
  );
};

const CreateBannerContent = async () => {
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
            <BannerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBannerPage;
