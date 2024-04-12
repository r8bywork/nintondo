import Card from '../components/Card/Card.tsx';
import { filterConfig, filterTimeConfig, filterTypeConfig } from '../settings/settings.ts';
import Search from './components/Search/Search.tsx';
import Filter from '../components/Controls/Filter.tsx';
import Svg from '../assets/filters/Plus.tsx';
import TimeSvg from '../assets/filters/Time.tsx';
import FoundCounter from '../components/FoundCounter.tsx';
import { useExplorerGetInscriptionsList } from '../hooks/marketinfo.ts';
import { useCallback, useEffect, useState } from 'react';
import { InscriptionCards } from '../interfaces/inscriptions.ts';
import Pagination from '../components/Table/Pagination.tsx';
import Arrow from '../assets/TableArrow.svg?react';
import { useNavigate, useLocation } from 'react-router-dom';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import { MARKET_API_URL } from '@/consts';

interface Filters {
  currentPage: number;
  sortBy: string;
  contentType: string;
  timeFilter: string;
}

const InscriptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inscriptions, setInscriptions] = useState<InscriptionCards>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

  const parseSearchParams = useCallback(
    (searchParams: URLSearchParams) => ({
      currentPage: parseInt(searchParams.get('currentPage') || '1', 10) - 1,
      sortBy: searchParams.get('sortBy') || 'newest',
      contentType: searchParams.get('contentType') || 'all',
      timeFilter: searchParams.get('timeFilter') || 'all',
    }),
    [],
  );

  const [filters, setFilter] = useState<Filters>(
    parseSearchParams(new URLSearchParams(location.search)),
  );

  const getInscriptions = useExplorerGetInscriptionsList();

  const createHref = (newFilters: Partial<Filters>, currentParams: URLSearchParams) => {
    const params = new URLSearchParams(currentParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value.toString());
      }
    });
    return params.toString();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = parseSearchParams(searchParams);

    setFilter(newFilters);

    setIsLoading(true);
    setImagesLoaded({});
    getInscriptions(
      newFilters.currentPage,
      newFilters.sortBy,
      newFilters.contentType,
      newFilters.timeFilter,
    )
      .then((data) => {
        setInscriptions(data);
        if (data && newFilters.currentPage > data.pages) {
          setFilter((prev) => ({ ...prev, currentPage: 0 }));
        }
      })
      .catch((error) => {
        console.error('Failed to get inscription info:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.search]);

  const handleImageLoad = (id: string) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const onPageChange = (newPage: number) => {
    const params = createHref({ currentPage: newPage + 1 }, urlSearchParams);
    navigate(`?${params}`);
    window.scrollTo({ top: 0 });
  };

  const handleTimeFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    const params = createHref({ timeFilter: newFilter, currentPage: 1 }, urlSearchParams);
    navigate(`?${params}`);
    setFilter((prev) => ({ ...prev, timeFilter: newFilter }));
  };

  const handleTypeFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    const params = createHref({ contentType: newFilter, currentPage: 1 }, urlSearchParams);
    navigate(`?${params}`);
    setFilter((prev) => ({ ...prev, contentType: newFilter }));
  };

  const handleSortByFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    const params = createHref({ sortBy: newFilter, currentPage: 1 }, urlSearchParams);
    navigate(`?${params}`);
    setFilter((prev) => ({ ...prev, sortBy: newFilter }));
  };

  return (
    <div className={'bg-black min-h-screen'}>
      <div className='max-w-[1700px] max-medium:flex-col mx-auto flex pt-[150px] max-medium:pt-[100px]'>
        <div className='w-full max-w-[421px] max-medium:max-w-none pt-[35px] px-[15px]'>
          <Search placeholder={'Search'} />
          <div className={'mt-[35px] flex flex-col gap-[30px]'}>
            <Filter
              config={filterConfig}
              onChange={handleSortByFilterChange}
              state={filters.sortBy}
            />
            <Filter
              selectAll={{ text: 'All' }}
              SvgIcon={Svg}
              config={filterTypeConfig}
              onChange={handleTypeFilterChange}
              state={filters.contentType}
            />
            <Filter
              selectAll={{ text: 'All Time' }}
              SvgIcon={TimeSvg}
              config={filterTimeConfig}
              onChange={handleTimeFilterChange}
              state={filters.timeFilter}
            />
          </div>
        </div>
        <div className='flex-grow overflow-y-auto px-[15px]'>
          {inscriptions && !isLoading ? (
            <>
              <FoundCounter
                count={inscriptions?.count}
                customText={'inscriptions'}
                classNames={'px-[15px]'}
              />
              <div className='max-w-[1250px] mx-auto flex flex-wrap pt-[10px] gap-[10px] max-lg:justify-center'>
                {inscriptions?.inscriptions.map((card, index) => (
                  <div key={index}>
                    <Card
                      onClick={() => navigate(`/bellinals/inscription/${card.id}`)}
                      image={`${MARKET_API_URL}/pub/preview/${card.id}`}
                      onLoadHandler={() => handleImageLoad(card.id)}
                      text={card.number}
                      date={card.created}
                      tags={[{ tagText: card.file_type, active: true }]}
                      BigCard={false}
                      contentType={'image'}
                      blurImage={!imagesLoaded[card.id]}
                    />
                  </div>
                ))}
              </div>
              {inscriptions.count >= 18 && (
                <Pagination
                  activeClassName='bg-[#FFBB00] text-black'
                  leftBtnPlaceholder={<Arrow />}
                  rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
                  buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
                  currentPage={filters.currentPage}
                  arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
                  className={
                    'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
                  }
                  pageCount={inscriptions.pages}
                  onPageChange={onPageChange}
                />
              )}
            </>
          ) : (
            <Skeleton classNames='h-[80dvh]' />
          )}
        </div>
      </div>
    </div>
  );
};

export default InscriptionsPage;
