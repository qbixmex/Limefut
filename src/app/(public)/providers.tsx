import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

type Props = { readonly children?: ReactNode; };

export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { width: 400 } }}
        richColors
      />
    </ThemeProvider>
  );
};

export default Providers;
