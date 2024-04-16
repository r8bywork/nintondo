import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createHref } from '@/utils';
import { InscriptionCards } from '@/interfaces/inscriptions.ts';
import { useExplorerGetInscriptionsList } from '@/hooks/marketinfo.ts'; // Предполагается, что эта функция уже определена

interface Filters {
  currentPage: number;
  sortBy?: string;
  contentType?: string;
  timeFilter?: string;
  from?: string;
  to?: string;
}

export const useInscriptionFilters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const getInscriptions = useExplorerGetInscriptionsList();
  const [inscriptions, setInscriptions] = useState<InscriptionCards>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

  const parseSearchParams = useCallback(
    (searchParams: URLSearchParams) => ({
      currentPage: parseInt(searchParams.get('currentPage') || '1', 10) - 1,
      sortBy: searchParams.get('sortBy') || 'newest',
      contentType: searchParams.get('contentType') || 'all',
      timeFilter: searchParams.get('timeFilter') || 'all',
      from: searchParams.get('from') || '0',
      to: searchParams.get('to') || 'max',
    }),
    [],
  );

  const [filters, setFilters] = useState<Filters>(
    parseSearchParams(new URLSearchParams(location.search)),
  );

  const handleImageLoad = (id: string) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = parseSearchParams(searchParams);
    setFilters(newFilters);
    setIsLoading(true);
    setImagesLoaded({});
    console.log(newFilters);
    getInscriptions(
      newFilters.currentPage,
      newFilters.sortBy,
      newFilters.contentType,
      newFilters.timeFilter,
      newFilters.from,
      newFilters.to,
    )
      .then((data) => {
        setInscriptions(data);
        if (data && newFilters.currentPage > data.pages) {
          setFilters((prev) => ({ ...prev, currentPage: 0 }));
        }
      })
      .catch((error) => {
        console.error('Failed to get inscription info:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.search]);

  const onPageChange = (newPage: number) => {
    const params = createHref({ currentPage: newPage + 1 }, urlSearchParams);
    navigate(`?${params}`);
    window.scrollTo({ top: 0 });
  };

  const handleTimeFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    const params = createHref({ timeFilter: newFilter, currentPage: 1 }, urlSearchParams);
    navigate(`?${params}`);
    setFilters((prev) => ({ ...prev, timeFilter: newFilter }));
  };

  const handleTypeFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    const params = createHref({ contentType: newFilter, currentPage: 1 }, urlSearchParams);
    navigate(`?${params}`);
    setFilters((prev) => ({ ...prev, contentType: newFilter }));
  };

  const handleSortByFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    const params = createHref({ sortBy: newFilter, currentPage: 1 }, urlSearchParams);
    navigate(`?${params}`);
    setFilters((prev) => ({ ...prev, sortBy: newFilter }));
  };

  const handleRangeFilterChange = (filter: string) => {
    let [from, to] = filter.split(',');
    if (from === 'all') {
      from = '0';
      to = '18446744073709551615';
    }
    const toForUrl = to === '18446744073709551615' ? 'max' : to;

    if (from !== filters.from || to !== filters.to) {
      const params = createHref({ from: from, to: toForUrl, currentPage: 1 }, urlSearchParams);
      navigate(`?${params}`);
    } else {
      const params = createHref({ from: from, to: toForUrl }, urlSearchParams);
      navigate(`?${params}`);
    }

    setFilters((prev) => ({ ...prev, from: from, to: to }));
  };

  return {
    imagesLoaded,
    filters,
    inscriptions,
    isLoading,
    onPageChange,
    handleTimeFilterChange,
    handleTypeFilterChange,
    handleSortByFilterChange,
    handleRangeFilterChange,
    handleImageLoad,
  };
};
