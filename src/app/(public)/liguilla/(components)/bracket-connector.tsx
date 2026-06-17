import type { FC } from 'react';

type Props = Readonly<{
  type: 'qf-to-sf' | 'sf-to-final';
  flip?: boolean;
}>;

export const BracketConnector: FC<Props> = ({ type, flip }) => {
  return (
    <div className={`flex items-stretch w-full h-full px-1 overflow-hidden ${flip ? '-scale-x-100' : ''}`}>
      <svg
        viewBox="0 0 40 200"
        className="w-full h-full text-emerald-600 dark:text-emerald-400 overflow-visible"
        fill="none"
        stroke="currentColor"
        preserveAspectRatio="none"
      >
        {type === 'qf-to-sf' ? (
          <>
            <path
              d="M 0 30 L 16 30 M 24 100 L 40 100 M 0 170 L 16 170"
              strokeWidth="1"
            />
            <path
              d="M 16 30 Q 20 30 20 38 L 20 92 Q 20 100 24 100 M 16 170 Q 20 170 20 162 L 20 108 Q 20 100 24 100"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <path d="M 0 100 L 40 100" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
};
