import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createHref } from '@/utils';
import { useGetListedTokens } from '@/hooks/marketinfo.ts';
import { ListedTokenCard } from '@/interfaces/marketapi';

interface Filters {
  currentPage: number;
  tick: string;
}

export const useTokenFilters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const getTokens = useGetListedTokens();
  const [tokenCard, setTokens] = useState<ListedTokenCard>({ count: 0, pages: 0, tokens: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const parseSearchParams = useCallback(
    (searchParams: URLSearchParams) => ({
      currentPage: parseInt(searchParams.get('currentPage') || '1', 10) - 1,
      tick: searchParams.get('tick') || 'nook',
    }),
    [],
  );

  const [filters, setFilters] = useState<Filters>(
    parseSearchParams(new URLSearchParams(location.search)),
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = parseSearchParams(searchParams);
    setFilters(newFilters);
    setIsLoading(true);

    getTokens(newFilters.currentPage, newFilters.tick, '')
      .then((data) => {
        if (data) setTokens(data);
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
    // window.scrollTo({ top: 0 });
  };

  return {
    filters,
    onPageChange,
    isLoading,
    tokenCard,
  };
};
