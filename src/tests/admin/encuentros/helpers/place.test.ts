import { getMatchStatus } from '@/app/admin/encuentros/(helpers)/place';
import { MATCH_STATUS } from '@/shared/enums';

describe('Tests on getMatchStatus helper', () => {
  test('Should return "En revisión" for the in review status', () => {
    expect(getMatchStatus(MATCH_STATUS.IN_REVIEW)).toEqual({
      label: 'En revisión',
      variant: 'outline-warning',
    });
  });

  test('Should return "Programado" for the scheduled status', () => {
    expect(getMatchStatus(MATCH_STATUS.SCHEDULED)).toEqual({
      label: 'Programado',
      variant: 'outline-primary',
    });
  });

  test('Should return "En Progreso" for the in progress status', () => {
    expect(getMatchStatus(MATCH_STATUS.IN_PROGRESS)).toEqual({
      label: 'En Progreso',
      variant: 'outline-info',
    });
  });

  test('Should return "Finalizado" for the completed status', () => {
    expect(getMatchStatus(MATCH_STATUS.COMPLETED)).toEqual({
      label: 'Finalizado',
      variant: 'outline-success',
    });
  });

  test('Should return "Pospuesto" for the post posed status', () => {
    expect(getMatchStatus(MATCH_STATUS.POST_POSED)).toEqual({
      label: 'Pospuesto',
      variant: 'outline-info',
    });
  });

  test('Should return "Cancelado" for the canceled status', () => {
    expect(getMatchStatus(MATCH_STATUS.CANCELED)).toEqual({
      label: 'Cancelado',
      variant: 'outline-secondary',
    });
  });

  test('Should return "Desconocido" for an unknown status', () => {
    expect(getMatchStatus('unknown' as never)).toEqual({
      label: 'Desconocido',
      variant: 'outline-secondary',
    });
  });
});
