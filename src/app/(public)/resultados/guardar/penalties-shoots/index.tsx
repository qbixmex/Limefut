'use client';

import type { FC } from 'react';
import { useState } from 'react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { LocalPenaltyShoots } from './local-penalty-shoots';
import { VisitorPenaltyShoots } from './visitor-penalty-shoots';
import styles from '../styles.module.css';

export const PenaltiesShoots: FC = () => {
  const [penaltyShoots, setPenaltyShoots] = useState(false);

  return (
    <section className="mb-5">
      <FieldLabel htmlFor="switch-penalty-shoots">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className={cn({
              'text-emerald-500 font-bold': penaltyShoots,
            })}>Tanda de penales</FieldTitle>
            <FieldDescription>
              {penaltyShoots ? (
                <span className="text-emerald-600 dark:text-emerald-50 font-medium italic">
                  Ahora capture el marcador de los tiros penales.
                </span>
              ) : (
                <span>Si el partido quedó empatado y si se realizaron tiros de penales seleccione esta opción.</span>
              )}
            </FieldDescription>
          </FieldContent>
          <Switch
            id="switch-penalty-shoots"
            checked={penaltyShoots}
            // ps -> previous state
            onCheckedChange={() => setPenaltyShoots(ps => !ps)}
          />
        </Field>
      </FieldLabel>

      {penaltyShoots && (
        <div className={cn(styles.goalsGroup, 'mt-5')}>
          <LocalPenaltyShoots />
          <VisitorPenaltyShoots />
        </div>
      )}
    </section>
  );
};
