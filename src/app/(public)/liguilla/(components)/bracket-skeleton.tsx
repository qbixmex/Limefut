import type { FC } from 'react';

function ConnectorSkeleton({ type, flip }: { type: 'qf-to-sf' | 'sf-to-final'; flip?: boolean }) {
  return (
    <div className={`flex items-stretch h-full w-full ${flip ? '-scale-x-100' : ''}`}>
      <svg
        viewBox="0 0 40 100"
        preserveAspectRatio="none"
        className="w-full h-full text-gray-300 dark:text-gray-600 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === 'qf-to-sf' ? (
          <>
            <path
              d="M 0 15 L 16 15 M 24 50 L 40 50 M 0 85 L 16 85"
              strokeWidth="0.75"
            />
            <path
              d="M 16 15 Q 20 15 20 19 L 20 46 Q 20 50 24 50 M 16 85 Q 20 85 20 81 L 20 54 Q 20 50 24 50"
              strokeWidth="1"
            />
          </>
        ) : (
          <path d="M 0 50 L 40 50" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
}

const MatchCardSkeleton: FC = () => (
  <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-w-[140px] animate-pulse">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 flex-1">
        <div className="size-4 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
        <div className="h-3.5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
      </div>
      <div className="h-4 w-5 bg-gray-300 dark:bg-gray-600 rounded shrink-0" />
    </div>
    <div className="flex items-center justify-between gap-2 mt-2">
      <div className="flex items-center gap-1.5 flex-1">
        <div className="size-4 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
        <div className="h-3.5 bg-gray-300 dark:bg-gray-600 rounded w-16" />
      </div>
      <div className="h-4 w-5 bg-gray-300 dark:bg-gray-600 rounded shrink-0" />
    </div>
    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto" />
    </div>
  </div>
);

export const BracketSkeleton: FC = () => (
  <div className="flex flex-col gap-8" role="status" aria-label="Cargando bracket">
    <div>
      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-4 animate-pulse" />

      <div
        className="hidden lg:grid min-h-[350px] overflow-visible"
        style={{ gridTemplateColumns: '1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr' }}
      >
        <div className="flex flex-col justify-between py-1">
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </div>
        <div className="animate-pulse">
          <ConnectorSkeleton type="qf-to-sf" />
        </div>
        <div className="flex flex-col justify-center py-1">
          <MatchCardSkeleton />
        </div>
        <div className="animate-pulse">
          <ConnectorSkeleton type="sf-to-final" />
        </div>
        <div className="flex flex-col justify-center py-1">
          <MatchCardSkeleton />
        </div>
        <div className="animate-pulse">
          <ConnectorSkeleton type="sf-to-final" />
        </div>
        <div className="flex flex-col justify-center py-1">
          <MatchCardSkeleton />
        </div>
        <div className="animate-pulse">
          <ConnectorSkeleton type="qf-to-sf" flip />
        </div>
        <div className="flex flex-col justify-between py-1">
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </div>
      </div>

      <div className="lg:hidden space-y-5">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2 animate-pulse" />
            <div className="space-y-2">
              {section < 3 ? (
                Array.from({ length: section === 2 ? 2 : 4 }).map((_, i) => (
                  <MatchCardSkeleton key={i} />
                ))
              ) : (
                <MatchCardSkeleton />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
