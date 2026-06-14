import type { FC } from 'react';

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

      <div className="hidden lg:grid grid-cols-[1fr_20px_1fr_20px_1fr_20px_1fr_20px_1fr] gap-0 overflow-visible min-h-[350px]">
        <div className="flex flex-col justify-between py-1">
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-600 -translate-x-1/2 animate-pulse" />
        </div>
        <div className="flex items-center">
          <MatchCardSkeleton />
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-600 -translate-x-1/2 animate-pulse" />
        </div>
        <div className="flex items-center justify-center">
          <MatchCardSkeleton />
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-600 -translate-x-1/2 animate-pulse" />
        </div>
        <div className="flex items-center">
          <MatchCardSkeleton />
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-600 -translate-x-1/2 animate-pulse" />
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
