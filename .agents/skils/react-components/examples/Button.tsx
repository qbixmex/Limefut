import type { FC, ReactNode } from 'react';
import './Button.css';

type Props = Readonly<{
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}>;

const Button: FC<Props> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const buttonClass = `button button--${variant} ${disabled ? 'button--disabled' : ''} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
