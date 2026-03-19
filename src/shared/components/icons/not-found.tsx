import type { FC } from 'react';

type Props = Readonly<{
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  color?: string;
  size?: number | string;
}>;

export const NotFound: FC<Props> = ({
  className,
  style,
  strokeWidth = 1.5,
  color = 'currentColor',
  size = 800,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <g fill="none" stroke={color} strokeWidth={strokeWidth}>
        <path d="M2 9V3h20v6M2 19v2h20v-2m0-12H2m7.89 5.94v2a2 2 0 1 0 4 0v-2a2 2 0 1 0-4 0Z" />
        <path strokeLinecap="square" d="M21.444 15.44h-5v-.5l3.5-4h.5v6m-12.888-1.5h-5v-.5l3.5-4h.5v6" />
      </g>
    </svg>
  );
};

export { NotFound as NotFoundIcon };
export default NotFound;
