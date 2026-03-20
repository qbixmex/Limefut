import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { HeaderContent } from './header-content';

export const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <HeaderContent session={session} />;
};

export default Header;
