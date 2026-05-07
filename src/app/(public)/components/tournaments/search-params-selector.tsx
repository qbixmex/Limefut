import type { FC } from 'react';
import { fetchTournamentsAction } from '../../(actions)';
import { SelectorInputs } from './selector';

type Props = Readonly<{ roles?: boolean }>;

export const SearchParamsSelector: FC<Props> = async ({ roles }) => {
  const { tournaments } = await fetchTournamentsAction();

  return <SelectorInputs tournaments={tournaments} roles={roles} />;
};
