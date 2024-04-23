import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createHref } from '@/utils';
import { InscriptionCards } from '@/interfaces/inscriptions.ts';
import { useExplorerGetInscriptionsList } from '@/hooks/marketinfo.ts';

interface Filters {
  currentPage: number;
  sortBy?: string;
  contentType?: string;
  timeFilter?: string;
  from?: string;
  to?: string;
  genesisBlock?: number;
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
      from: Number(searchParams.get('from')) > 0 ? searchParams.get('from') || '0' : '0',
      to:
        Number(searchParams.get('to')) < Number.MAX_SAFE_INTEGER
          ? searchParams.get('to') || 'max'
          : 'max',
      genesisBlock: parseInt(searchParams.get('genesisBlock') || '0', 10),
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

    getInscriptions(
      newFilters.currentPage,
      newFilters.sortBy,
      newFilters.contentType,
      newFilters.timeFilter,
      newFilters.from,
      newFilters.to,
      newFilters.genesisBlock,
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

  const handleCreationBlockClick = (filter: number) => {
    const currentFilters = { ...filters, genesisBlock: filter, currentPage: 1 };
    const params = createHref(currentFilters, new URLSearchParams());
    navigate(`/bellinals/inscriptions?${params}`);
    setFilters((prev) => ({ ...prev, genesisBlock: filter, currentPage: 1 }));
  };

  const handleDeleteGenesisBlock = () => {
    const currentFilters = { ...filters, genesisBlock: undefined, currentPage: 1 };
    const params = createHref(currentFilters, new URLSearchParams());
    navigate(`/bellinals/inscriptions?${params}`);
    setFilters((prev) => ({ ...prev, genesisBlock: undefined, currentPage: 1 }));
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
    handleCreationBlockClick,
    handleDeleteGenesisBlock,
  };
};
