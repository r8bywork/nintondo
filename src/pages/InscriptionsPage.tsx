import Card from '../components/Card/Card.tsx';
import { filterConfig, filterTimeConfig, filterTypeConfig } from '../settings/settings.ts';
import Search from './components/Search/Search.tsx';
import Filter from '../components/Controls/Filter.tsx';
import Svg from '../assets/filters/Plus.tsx';
import TimeSvg from '../assets/filters/Time.tsx';
import FoundCounter from '../components/FoundCounter.tsx';
import { useExplorerGetInscriptionsList } from '../hooks/marketinfo.ts';
import { useEffect, useState } from 'react';
import { InscriptionCards } from '../interfaces/inscriptions.ts';
import Pagination from '../components/Table/Pagination.tsx';
import Arrow from '../assets/TableArrow.svg?react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store.ts';
import { selectTimeFilter } from '../redux/slices/timeFilterSlice.ts';
import { selectTypeFilter } from '../redux/slices/typeFiltersSlice.ts';
import { selectSortByFilter } from '../redux/slices/sortByFiltersSlice.ts';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import { createHref } from '@/utils';
import { MARKET_API_URL } from '@/consts';
const InscriptionsPage = () => {
  const navigate = useNavigate();
  const [inscriptions, setInscriptions] = useState<InscriptionCards>();
  const timeFilters = useSelector((state: RootState) => state.timeFilters);
  const contentFilter = useSelector((state: RootState) => state.typeFilters);
  const sortBy = useSelector((state: RootState) => state.sortByFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const page = urlSearchParams.get('page');
  const [currentPage, setCurrentPage] = useState(Number(page ? parseInt(page, 10) - 1 : 0));
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

  const getInscriptions = useExplorerGetInscriptionsList();

  useEffect(() => {
    setIsLoading(true);
    setImagesLoaded({});
    getInscriptions(
      currentPage,
      sortBy.selectedSortByFilter,
      contentFilter.selectedTypeFilter,
      timeFilters.selectedTimeFilter,
    )
      .then((data) => {
        setInscriptions(data);
        data && currentPage > data.pages ? setCurrentPage(0) : null;
      })
      .catch((error) => {
        console.error('Failed to get inscription info:', error);
      });
    setIsLoading(false);
  }, [currentPage, sortBy, contentFilter, timeFilters]);

  useEffect(() => {
    setCurrentPage(0);
    const params = createHref({ page: '1' }, urlSearchParams);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [sortBy, contentFilter, timeFilters]);

  const onPageChange = (newPage: number) => {
    const params = createHref({ page: String(newPage + 1) }, urlSearchParams);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0 });
  };

  const handleImageLoad = (id: string) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const handleTimeFilterChange = (filter: string) => {
    dispatch(selectTimeFilter(filter !== 'all' ? filter.split(' ')[1].toLowerCase() : filter));
  };

  const handleTypeFilterChange = (filter: string) => {
    dispatch(selectTypeFilter(filter.toLowerCase()));
  };

  const handleSortByFilterChange = (filter: string) => {
    dispatch(selectSortByFilter(filter.toLowerCase()));
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
              initialState={sortBy.selectedSortByFilter}
            />
            <Filter
              selectAll={{ text: 'All' }}
              SvgIcon={Svg}
              config={filterTypeConfig}
              onChange={handleTypeFilterChange}
              initialState={contentFilter.selectedTypeFilter}
            />
            <Filter
              selectAll={{ text: 'All Time' }}
              SvgIcon={TimeSvg}
              config={filterTimeConfig}
              onChange={handleTimeFilterChange}
              initialState={timeFilters.selectedTimeFilter}
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
                      onClick={() => navigate(`/bellinals/inscriptions/${card.id}`)}
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
                  currentPage={currentPage}
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
