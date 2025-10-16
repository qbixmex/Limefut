import type { FC } from "react";

type Props = Readonly<{
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  color?: string;
  size?: number | string;
}>;

export const SoccerField: FC<Props> = ({
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
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
        <path
          strokeWidth={strokeWidth}
          d="M.75 3.75h22.5v16.5H.75zm11.25 0v16.5"
        />
        <path
          strokeWidth={strokeWidth}
          d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0M.75 8.25h3a1.5 1.5 0 0 1 1.5 1.5v4.5a1.5 1.5 0 0 1-1.5 1.5h-3m22.5-7.5h-3a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h3"
        />
      </g>
    </svg>
  );
};

export { SoccerField as SoccerFieldIcon };
export default SoccerField;


