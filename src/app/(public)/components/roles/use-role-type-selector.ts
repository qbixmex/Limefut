'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type RoleStatus = {
  complete: boolean;
  team: boolean;
  field: boolean;
};

export const useRoleTypeSelector = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const rolesState: RoleStatus = {
    complete: searchParams.get('roles') === 'complete',
    team: searchParams.get('roles') === 'team',
    field: searchParams.get('roles') === 'field',
  };

  const handleRoleSelection = (type: 'complete' | 'team' | 'field') => {
    const params = new URLSearchParams(searchParams.toString());
    const currentRole = params.get('roles');

    switch (type) {
      case 'complete':
        if (currentRole === type) params.delete('roles');
        else params.set('roles', 'complete');
        break;
      case 'team':
        if (currentRole === type) params.delete('roles');
        else params.set('roles', 'team');
        break;
      case 'field':
        if (currentRole === type) params.delete('roles');
        else params.set('roles', 'field');
        break;
    }

    router.push(params.toString() ? `${pathname}?${params}` : pathname);
  };

  return {
    handleRoleSelection,
    rolesState,
  };
};
