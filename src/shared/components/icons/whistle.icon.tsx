import type { FC } from "react";

type Props = Readonly<{
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  color?: string;
  size?: number | string;
}>;

export const Whistle: FC<Props> = ({
  className,
  style,
  strokeWidth = 2,
  color = 'currentColor',
  size = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ ...style, color }}
    >
      <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5}>
        <path
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          d="M3.104 11.525c1.448-2.087 3.964-2.66 5.434-2.524h2.523c.528.09.673.309 1.327 1.342c.119.324 2.054.106 2.563.159c.558-.541 0-1.651 1.24-1.494c2.129 0 4.168-.091 5.102.046c.385.057.57.405.626.79c.223 1.55-.043 2.685-.3 2.944c-.687 1.216-2.669 2.395-3.651 2.208c-2.835 0-3.448-.074-3.694.396l-.864 2.235c-.577 1.23-2.6 3.656-5.994 3.344s-4.869-3.026-5.172-4.314c-.303-.824-.59-3.043.86-5.132M13.49 5.003V3.002m-2.496 3.002l-.998-1m5.989 1l.998-1"
        />
        <path
          strokeWidth={strokeWidth}
          d="M8.084 17a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"
        />
      </g>
    </svg>
  );
};

export { Whistle as WhistleIcon };
export default Whistle;
