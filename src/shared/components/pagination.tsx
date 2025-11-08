'use client';

import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/shared/actions';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type PaginationProps = Readonly<{
  totalPages: number;
  propName?: string;
}>;

export const Pagination: FC<PaginationProps> = (props) => {
  const { totalPages, propName = 'page' } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get(propName)) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set(propName, pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          url={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                url={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          url={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
};

type PaginationNumberProps = Readonly<{
  page: number | string;
  url: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}>;

const PaginationNumber: FC<PaginationNumberProps> = ({ page, url, isActive, position, }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.replace(url, { scroll: false });    
  };

  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-emerald-700 border-emerald-700 text-white': isActive,
      'bg-gray-400 hover:bg-emerald-700 dark:hover:bg-emerald-700 dark:bg-gray-800 text-emerald-50': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <button className={className} onClick={handleNavigate}>
      {page}
    </button>
  );
};

type PaginationArrowProps = Readonly<{
  url: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}>;

const PaginationArrow: FC<PaginationArrowProps> = ({ url, direction, isDisabled }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.replace(url, { scroll: false });    
  };

  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300 bg-gray-400 dark:bg-gray-800': isDisabled,
      'hover:bg-emerald-700 text-emerald-50 bg-emerald-700 dark:bg-emerald-700 hover:bg-emerald-600!': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeft className="w-4" />
    ) : (
      <ArrowRight className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <button className={className} onClick={handleNavigate}>
      {icon}
    </button>
  );
};

export default Pagination;
