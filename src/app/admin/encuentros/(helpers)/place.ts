import { MATCH_STATUS } from "@/shared/enums";

type BadgeVariant = "outline-secondary" | "outline-info" | "outline-warning" | "outline-success" | "outline-danger";

/**
 * Get match status in string format
 * @param status MATCH_STATUS enum
 * @example
 * ```ts
 * const status = getMatchStatus(MATCH_STATUS.SCHEDULED);
 * console.log(status); // 'Programado'
 * ```
 * @returns representation of the match status
 */
export const getMatchStatus = (status: MATCH_STATUS): {
  label: string;
  variant: BadgeVariant;
} => {
  switch (status) {
    case MATCH_STATUS.SCHEDULED:
      return { label: 'Programado', variant: 'outline-warning' };
    case MATCH_STATUS.INPROGRESS:
      return { label: 'En Curso', variant: 'outline-info' };
    case MATCH_STATUS.COMPLETED:
      return { label: 'Finalizado', variant: 'outline-success' };
    case MATCH_STATUS.POST_POSED:
      return { label: 'Pospuesto', variant: 'outline-warning' };
    case MATCH_STATUS.CANCELED:
      return { label: 'Cancelado', variant: 'outline-danger' };
    default:
      return { label: 'Desconocido', variant: 'outline-secondary' };
  }
};
