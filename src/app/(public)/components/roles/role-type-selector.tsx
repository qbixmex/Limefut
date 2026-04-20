'use client';

import { Button } from '@/components/ui/button';
import { useRoleTypeSelector } from './use-role-type-selector';
import { cn } from '@/lib/utils';
import './role-type-selector.css';

export const RoleTypeSelector = () => {
  const { handleRoleSelection, rolesState } = useRoleTypeSelector();

  return (
    <nav
      className="flex gap-2 mb-6"
      role="navigation"
      aria-label="Selector de rol de juego"
    >
      <Button
        variant="outline-primary"
        onClick={() => handleRoleSelection('complete')}
        role="button"
        aria-label="Seleccionar rol completo"
        className={cn({ 'selected-option': rolesState.complete })}
      >
        Rol completo
      </Button>

      <Button
        variant="outline-primary"
        onClick={() => handleRoleSelection('team')}
        role="button"
        aria-label="Seleccionar rol por equipo"
        className={cn({ 'selected-option': rolesState.team })}
      >
        Rol por equipo
      </Button>

      {/* <Button
        variant="outline-primary"
        onClick={() => handleRoleSelection('field')}
        role="button"
        aria-label="Seleccionar rol por cancha"
        className={cn({ 'selected-option': rolesState.field })}
      >
        Rol por cancha
      </Button> */}
    </nav>
  );
};
