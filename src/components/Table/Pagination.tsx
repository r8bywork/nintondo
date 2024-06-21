import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';

interface Props {
  pageCount: number;
  currentPage?: number;
  leftBtnPlaceholder?: string | React.ReactNode;
  rightBtnPlaceholder?: string | React.ReactNode;
  arrowsClassName?: string;
  buttonsClassName?: string;
  activeClassName?: string;
  className?: string;
  dotsClassName?: string;
  onPageChange: (page: number) => void;
}

const Pagination: FC<Props> = ({
  pageCount,
  arrowsClassName,
  buttonsClassName,
  className,
  rightBtnPlaceholder,
  leftBtnPlaceholder,
  activeClassName = '',
  currentPage = 1,
  onPageChange,
}) => {
  const calculateButtons = (size: number) => {
    switch (true) {
      case size < 500: {
        return 2;
      }
      case size <= 600: {
        return 3;
      }
      case size <= 700: {
        return 4;
      }
      default: {
        return 5;
      }
    }
  };
  const [visiblePageButtonsCount, setVisiblePageButtonsCount] = useState<number>(
    calculateButtons(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => {
      setVisiblePageButtonsCount(calculateButtons(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const halfCount = Math.floor(visiblePageButtonsCount / 2);

  const visiblePages = () => {
    let startPage = currentPage - 1 - halfCount > 0 ? currentPage - halfCount : 1;
    let endPage = currentPage + halfCount < pageCount ? currentPage + halfCount : pageCount - 1;

    if (endPage - startPage < visiblePageButtonsCount) {
      if (startPage === 1) {
        endPage = Math.min(visiblePageButtonsCount, pageCount);
      } else if (endPage === pageCount) {
        startPage = Math.max(pageCount - visiblePageButtonsCount + 1, 1);
      }
    }

    return Array.from(
      {
        length:
          endPage -
          startPage +
          (visiblePageButtonsCount === endPage || endPage === currentPage - 1 ? 2 : 0),
      },
      (_, i) => startPage + i,
    );
  };

  const shouldShowLeftPage = currentPage - Math.floor(visiblePageButtonsCount / 2) > 1;
  const shouldShowRightPage = currentPage + Math.floor(visiblePageButtonsCount / 2) < pageCount;
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page <= pageCount && page >= 1) {
      onPageChange(page);
    }
  };

  const LinkItem: FC<{ page: number }> = ({ page }) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`${buttonsClassName}${currentPage === page ? ` ${activeClassName}` : ''}`}
    >
      {page}
    </button>
  );

  return (
    <div className={className}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={classNames(arrowsClassName, {
          hidden: visiblePageButtonsCount <= 4 || currentPage === 1,
        })}
      >
        {leftBtnPlaceholder}
      </button>
      {shouldShowLeftPage && <LinkItem page={1} />}
      {visiblePages().map((pageNumber) => (
        <LinkItem
          key={`page-${pageNumber}`}
          page={pageNumber}
        />
      ))}
      {shouldShowRightPage && <LinkItem page={pageCount} />}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={classNames(arrowsClassName, {
          hidden: visiblePageButtonsCount <= 4 || currentPage === pageCount,
        })}
      >
        {rightBtnPlaceholder}
      </button>
    </div>
  );
};

export default Pagination;
