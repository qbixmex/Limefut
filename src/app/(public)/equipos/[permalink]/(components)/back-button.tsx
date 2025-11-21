'use client';

import type { FC } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '~/src/components/ui/button';
import { useRouter } from 'next/navigation';

type Props = Readonly<{
  permalink: string;
}>;

export const BackButton: FC<Props> = ({ permalink }) => {
  const router = useRouter();

  const handleRedirect = () => {
    const params = new URLSearchParams();
    params.set('torneo', permalink);
    router.push(`/equipos?${params}`);
  };

  return (
    <Button variant="outline-primary" onClick={handleRedirect}>
      <ChevronLeft />
    </Button>
  );
};

export default BackButton;
