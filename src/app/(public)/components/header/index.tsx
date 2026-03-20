import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { HeaderClient } from './header-ui';

export const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <HeaderClient session={session} />;
};

export default Header;
