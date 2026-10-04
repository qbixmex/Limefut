import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

type Props = Readonly<{
  isSubmitting: boolean;
  label: string;
}>;

export const SubmitButton: FC<Props> = ({ isSubmitting, label }) => {
  return (
    <Button
      type="submit"
      variant="outline-primary"
      size="lg"
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
          <span className="text-sm italic">Espere</span>
          <LoaderCircle
            className="size-4 animate-spin"
            role="img"
            aria-label="Icono de carga"
          />
        </span>
      ) : (
        <span className="inline-flex gap-3">
          <span className="text-sm italic">{label}</span>
        </span>
      )}
    </Button>
  );
};
