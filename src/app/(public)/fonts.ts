import { Arimo, Open_Sans } from 'next/font/google';
 
export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-open-sans',
});
 
export const arimo = Arimo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-arimo',
});
