import type { FC } from 'react';

type Props = Readonly<{
  type: 'qf-to-sf' | 'sf-to-final';
  flip?: boolean;
}>;

export const BracketConnector: FC<Props> = ({ type, flip }) => {
  return (
    <div className={`flex items-stretch h-full w-full px-1 ${flip ? '-scale-x-100' : ''}`}>
      <svg
        viewBox="0 0 40 400"
        className="w-full h-full text-emerald-600 dark:text-emerald-400 overflow-visible"
        fill="none"
        stroke="currentColor"
      >
        {type === 'qf-to-sf' ? (
          <>
            <path
              d="M 0 60 L 16 60 M 24 200 L 40 200 M 0 340 L 16 340"
              strokeWidth="1"
            />
            <path
              d="M 16 60 Q 20 60 20 76 L 20 184 Q 20 200 24 200 M 16 340 Q 20 340 20 324 L 20 216 Q 20 200 24 200"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <path d="M 0 200 L 40 200" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
};
