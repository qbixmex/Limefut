import { MATCH_STATUS, type MATCH_STATUS_TYPE } from "@/shared/enums";

type BadgeVariant = "outline-secondary" | "outline-info" | "outline-warning" | "outline-success" | "outline-danger";

/**
 * Get match status in string format
 * @param state MATCH_STATUS enum
 * @example
 * ```ts
 * const status = getMatchStatus(MATCH_STATUS.SCHEDULED);
 * console.log(status); // 'Programado'
 * ```
 * @returns representation of the match status
 */
export const getMatchStatus = (state: MATCH_STATUS_TYPE): {
  label: string;
  variant: BadgeVariant;
} => {
  switch (state) {
    case MATCH_STATUS.SCHEDULED:
      return { label: 'Programado', variant: 'outline-warning' };
    case MATCH_STATUS.IN_PROGRESS:
      return { label: 'En Curso', variant: 'outline-info' };
    case MATCH_STATUS.COMPLETED:
      return { label: 'Finalizado', variant: 'outline-success' };
    case MATCH_STATUS.POST_POSED:
      return { label: 'Pospuesto', variant: 'outline-info' };
    case MATCH_STATUS.CANCELED:
      return { label: 'Cancelado', variant: 'outline-danger' };
    default:
      return { label: 'Desconocido', variant: 'outline-secondary' };
  }
};
