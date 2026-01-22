import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CrateCustomPage: FC = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="bg-muted/50 min-h-screen flex-1 flex rounded-xl md:min-h-min p-10">
        <Card className="w-full shadow-none bg-neutral-100 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Crear Página</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <PageForm
              session={session as Session}
              tournaments={tournaments}
              pages={pages}
            /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrateCustomPage;
