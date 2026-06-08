'use client';

import type { FC } from 'react';
import { GoalField } from './goal-field';

export const LocalGoalsField: FC = () => (
  <GoalField name="localTeamScore" label="Goles Local" />
);
