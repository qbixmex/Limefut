import crypto from "node:crypto";
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageForm } from '../(components)/page-form';
import { auth } from '@/auth';
import type { Session } from 'next-auth';

export const CrateCustomPage: FC = async () => {
  const session = await auth();
  const pageId = crypto.randomUUID();

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Página</CardTitle>
          </CardHeader>
          <CardContent>
            <PageForm key={pageId} session={session as Session} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrateCustomPage;
