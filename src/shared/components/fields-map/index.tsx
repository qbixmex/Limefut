import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { FieldMap } from '@/shared/components/field-map';
import type { ResolvedFieldMap } from '@/lib/maps';

type Variant = 'public' | 'admin';

const VARIANTS = {
  public: {
    section: 'flex flex-col gap-3 mb-5',
    heading: 'text-3xl font-bold text-sky-500 mb-2',
    fieldName: 'text-lg font-semibold text-emerald-700 dark:text-emerald-300',
    empty: 'text-gray-500 font-semibold text-lg italic',
  },
  admin: {
    section: 'flex flex-col gap-3',
    heading: 'text-xl font-bold text-sky-600 mb-5',
    fieldName: 'text-lg font-semibold text-emerald-700 dark:text-emerald-300',
    empty: 'text-gray-500 font-semibold text-lg italic',
  },
} as const;

type Props = Readonly<{
  maps: readonly ResolvedFieldMap[];
  variant?: Variant;
  className?: string;
}>;

export const FieldsMap: FC<Props> = ({
  maps,
  variant = 'public',
  className,
}) => {
  const styles = VARIANTS[variant];

  return (
    <section className={cn(styles.section, className)}>
      <h2 className={styles.heading}>
        {maps.length === 1 ? 'Cancha' : 'Canchas'}
      </h2>

      {maps.length === 0 ? (
        <p className={styles.empty}>No hay canchas asignadas</p>
      ) : (
        <div
          className={cn('grid grid-cols-1 gap-5', {
            'md:grid-cols-2': maps.length > 1,
          })}
        >
          {maps.map((map) => (
            <div key={map.id} className="flex flex-col gap-2">
              <h3 className={styles.fieldName}>{map.name}</h3>
              <FieldMap
                link={map.link}
                embedUrl={map.embedUrl}
                title={map.name}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
