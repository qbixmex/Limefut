import {
  getAlignmentTranslation,
  getBadgeRobotsVariant,
  getGenderTranslation,
  getPageStatus,
  getRobots,
  getStageTranslation,
  getStatusTranslation,
  sleep,
  slugify,
} from "@/lib/utils";
import { PAGE_STATUS, ROBOTS } from "@/shared/interfaces";
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from "@/shared/enums";

describe('Test on Utils', () => {
  test('Should slugify text with spaces', () => {
    expect(slugify('lorem ipsum')).toBe('lorem-ipsum');
    expect(slugify('acción construcción')).toBe('accion-construccion');
    expect(slugify(' lorem ipsum ')).toBe('lorem-ipsum');
    expect(slugify('-lorem ipsum-')).toBe('lorem-ipsum');
    expect(slugify('alex @ gmail . com')).toBe('alex-gmail');
    expect(slugify('picture.png')).toBe('picture');
  });

  test('Should sleep the timer', async () => {
    const start = Date.now();
    await sleep(0.5);
    const end = Date.now();
    const elapsed = (end - start) / 1000;

    expect(elapsed).toBeGreaterThanOrEqual(0.5);
  });

  test('Should get stage translation', async () => {
    expect(getStageTranslation('regular')).toEqual({
      label: 'regular',
      variant: 'outline-info',
    });
    expect(getStageTranslation('playoffs')).toEqual({
      label: 'liguilla',
      variant: 'outline-warning',
    });
    expect(getStageTranslation('finals')).toEqual({
      label: 'finales',
      variant: 'outline-success',
    });
    expect(getStageTranslation('lorem')).toEqual({
      label: 'desconocida',
      variant: 'outline-secondary',
    });
  });

  test('Should gets the variant for the SEO robots badge', () => {
    expect(getBadgeRobotsVariant(ROBOTS.INDEX_FOLLOW))
      .toBe('outline-success');
    expect(getBadgeRobotsVariant(ROBOTS.INDEX_NO_FOLLOW))
      .toBe('outline-info');
    expect(getBadgeRobotsVariant(ROBOTS.NO_INDEX_FOLLOW))
      .toBe('outline-warning');
    expect(getBadgeRobotsVariant(ROBOTS.NO_INDEX_NO_FOLLOW))
      .toBe('outline-secondary');
    expect(getBadgeRobotsVariant('lorem' as ROBOTS))
      .toBe('outline-secondary');
  });

  test('Should translates the SEO robots to a user friendly string', () => {
    expect(getRobots(ROBOTS.INDEX_FOLLOW)).toBe('indexar, seguir');
    expect(getRobots(ROBOTS.INDEX_NO_FOLLOW)).toBe('indexar, no seguir');
    expect(getRobots(ROBOTS.NO_INDEX_FOLLOW)).toBe('no indexar, seguir');
    expect(getRobots(ROBOTS.NO_INDEX_NO_FOLLOW)).toBe('no indexar, no seguir');
    expect(getRobots('lorem' as ROBOTS)).toBe('no indexar, no seguir');
  });

  test('Should translates the page status to a user friendly string', () => {
    expect(getPageStatus(PAGE_STATUS.DRAFT)).toEqual({
      label: "Borrador",
      variant: 'outline-secondary',
    });
    expect(getPageStatus(PAGE_STATUS.HOLD)).toEqual({
      label: "Retenido",
      variant: "outline-warning",
    });
    expect(getPageStatus(PAGE_STATUS.UNPUBLISHED)).toEqual({
      label: "No Publicado",
      variant: "outline-info",
    });
    expect(getPageStatus(PAGE_STATUS.PUBLISHED)).toEqual({
      label: "Publicado",
      variant: "outline-success",
    });
    expect(getPageStatus('lorem' as PAGE_STATUS)).toEqual({
      label: "Desconocido",
      variant: "outline-secondary",
    });
  });

  test('Should translates the alignment value to Spanish.', () => {
    expect(getAlignmentTranslation('left')).toBe('izquierda');
    expect(getAlignmentTranslation('center')).toBe('centro');
    expect(getAlignmentTranslation('right')).toBe('derecha');
  });

  test('Should translates the gender to spanish', () => {
    expect(getGenderTranslation('female')).toBe('femenil');
    expect(getGenderTranslation('male')).toBe('varonil');
  });

  test('Should translates the match status to Spanish.', () => {
    expect(getStatusTranslation(MATCH_STATUS.SCHEDULED))
      .toBe('programado');
    expect(getStatusTranslation(MATCH_STATUS.IN_PROGRESS))
      .toBe('en progreso');
    expect(getStatusTranslation(MATCH_STATUS.POST_POSED))
      .toBe('pospuesto');
    expect(getStatusTranslation(MATCH_STATUS.CANCELED))
      .toBe('cancelado');
    expect(getStatusTranslation(MATCH_STATUS.COMPLETED))
      .toBe('completado');
    expect(getStatusTranslation('lorem' as MATCH_STATUS_TYPE))
      .toBe('desconocido');
  });
});
