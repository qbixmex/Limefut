import { Loader2 } from 'lucide-react';

export const SessionLoader = () => {
  return (
    <div
      className="animate-spin"
      aria-label="Cargando sesión"
      aria-live="polite"
    >
      <Loader2 />
    </div>
  );
};
