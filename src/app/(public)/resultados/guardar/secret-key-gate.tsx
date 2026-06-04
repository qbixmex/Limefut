'use client';

import type { FC, ReactNode, SubmitEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifySecretAction } from '../(actions)/verifySecretAction';
import { Eye, EyeClosed, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 horas
const STORAGE_KEY = 'match-form-verified';

type Props = Readonly<{
  children: ReactNode;
}>;

export const SecretKeyGate: FC<Props> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { expiresAt } = JSON.parse(stored) as { expiresAt: number };
        return Date.now() < expiresAt;
      }
    } catch { /* ignore */ }
    return false;
  });
  const [key, setKey] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifySecretAction(key);

    if (result.ok) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ expiresAt: Date.now() + EXPIRATION_MS }),
        );
      } catch { /* ignore */ }
      setIsVerified(true);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <section className="w-full md:max-w-md md:mx-auto">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="secret-key">Clave secreta</Label>
          <div className="relative">
            <Input
              id="secret-key"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Ingrese la clave secreta"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(prev => !prev)}
              className={cn(
                'absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-400 z-10',
                { hidden: key.length === 0 },
              )}
            >
              {passwordVisible ? <Eye /> : <EyeClosed />}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div className="md:text-right">
          <Button
            type="submit"
            variant="outline-primary"
            disabled={loading}
            className="w-full lg:w-fit"
          >
            {loading ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Verificando</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>Acceder</span>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};
