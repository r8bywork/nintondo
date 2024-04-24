import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';

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
  dotsClassName,
  activeClassName = '',
  currentPage = 1,
  onPageChange,
}) => {
  const calculateButtons = (size: number) => {
    switch (true) {
      case size < 500:
        return 2;
      case size <= 600:
        return 3;
      case size <= 700:
        return 4;
      default:
        return 5;
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
    let startPage = currentPage - halfCount > 0 ? currentPage - halfCount : 0;
    let endPage = currentPage + halfCount < pageCount ? currentPage + halfCount : pageCount - 1;

    if (endPage - startPage + 1 < visiblePageButtonsCount) {
      if (startPage === 1) {
        endPage = Math.min(visiblePageButtonsCount, pageCount);
      } else if (endPage === pageCount) {
        startPage = Math.max(pageCount - visiblePageButtonsCount + 1, 1);
      }
    }

    return Array.from({ length: endPage - startPage + 2 }, (_, i) => startPage + i);
  };

  const shouldShowLeftPage = currentPage - Math.floor(visiblePageButtonsCount / 2) > 1;
  const shouldShowLeftDots = currentPage - Math.floor(visiblePageButtonsCount / 2) > 2;
  const shouldShowRightPage = currentPage + Math.floor(visiblePageButtonsCount / 2) < pageCount;
  const shouldShowRightDots = currentPage + Math.floor(visiblePageButtonsCount / 2) < pageCount - 1;
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const LinkItem: FC<{ page: number }> = ({ page }) => (
    <button
      key={page}
      onClick={() => handlePageChange(page - 1)} // Уменьшаем на 1 для корректной внутренней логики
      className={`${buttonsClassName}${currentPage === page - 1 ? ` ${activeClassName}` : ''}`}
    >
      {page}
    </button>
  );

  return (
    <div className={className}>
      {currentPage > 0 && leftBtnPlaceholder && visiblePageButtonsCount > 4 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={arrowsClassName}
        >
          {leftBtnPlaceholder}
        </button>
      )}
      {shouldShowLeftPage && <LinkItem page={1} />}
      {shouldShowLeftDots && (
        <span className={cn(buttonsClassName, dotsClassName, 'select-none')}>...</span>
      )}
      {visiblePages().map((pageNumber) => (
        <LinkItem
          key={`page-${pageNumber}`}
          page={pageNumber + 1}
        />
      ))}
      {shouldShowRightDots && (
        <span className={cn(buttonsClassName, dotsClassName, 'select-none')}>...</span>
      )}
      {shouldShowRightPage && <LinkItem page={pageCount + 1} />}
      {currentPage < pageCount - 1 && rightBtnPlaceholder && visiblePageButtonsCount > 4 && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={arrowsClassName}
        >
          {rightBtnPlaceholder}
        </button>
      )}
    </div>
  );
};

export default Pagination;
