import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons/lib';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  modifyPosition: () => void;
  icon: IconType | LucideIcon;
  disabled?: boolean;
}>;

export const PositionButtonModifier: FC<Props> = ({ icon: Icon, modifyPosition, disabled }) => {
  return (
    <button
      type="button"
      className={cn(styles.button, 'group')}
      onClick={modifyPosition}
      disabled={disabled}
    >
      <Icon className={cn(styles.buttonIcon, 'group-hover:text-stone-50!')} />
    </button>
  );
};
