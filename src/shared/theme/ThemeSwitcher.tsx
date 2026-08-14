'use client';

import type { FC } from 'react';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '../../lib/utils';
import { Moon, Sun } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = Readonly<{
  className?: string;
}>;

const subscribe = () => () => {};

export const ThemeSwitcher: FC<Props> = ({ className }) => {
  const { setTheme, resolvedTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className={cn('size-5', className)} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {resolvedTheme === 'light' ? (
          <button onClick={() => setTheme('dark')}>
            <Moon className={cn('size-5', className)} />
          </button>
        ) : (
          <button onClick={() => setTheme('light')}>
            <Sun className={cn('size-5', className)} />
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {resolvedTheme === 'light' ? 'Modo Obscuro' : 'Modo Claro'}
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeSwitcher;
