'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
    complete: !searchParams.has('roles') || searchParams.get('roles') === 'complete',
    team: searchParams.get('roles') === 'team',
    field: searchParams.get('roles') === 'field',
  };

  useEffect(() => {
    if (searchParams.has('tournament') && searchParams.has('category') && !searchParams.has('roles')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('roles', 'complete');
      router.push(`${pathname}?${params}`);
    }
  }, [searchParams, pathname, router]);

  const handleRoleSelection = (type: 'complete' | 'team' | 'field') => {
    const params = new URLSearchParams(searchParams.toString());
    const currentRole = params.get('roles');

    if (params.has('team')) {
      params.delete('team');
    }

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
      default:
        params.set('roles', 'complete');
    }

    router.push(params.toString() ? `${pathname}?${params}` : pathname);
  };

  return {
    handleRoleSelection,
    rolesState,
  };
};
