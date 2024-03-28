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
const InscriptionsPage = () => {
  const navigate = useNavigate();
  const [inscriptions, setInscriptions] = useState<InscriptionCards>();
  const [page, setPage] = useState(0);
  const timeFilters = useSelector((state: RootState) => state.timeFilters);
  const contentFilter = useSelector((state: RootState) => state.typeFilters);
  const sortBy = useSelector((state: RootState) => state.sortByFilters);
  const dispatch: AppDispatch = useDispatch();
  const getInscriptions = useExplorerGetInscriptionsList();

  useEffect(() => {
    getInscriptions(
      page,
      sortBy.selectedSortByFilter,
      contentFilter.selectedTypeFilter,
      timeFilters.selectedTimeFilter,
    )
      .then((data) => {
        setInscriptions(data);
        data && page > data.pages ? setPage(0) : null;
      })
      .catch((error) => {
        console.error('Ошибка при получении списка инскрипций:', error);
      });
  }, [page, sortBy, contentFilter, timeFilters]);

  const onPageChange = (newPage: number) => {
    setPage(newPage);
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
        <div className='flex-grow overflow-y-auto'>
          {inscriptions && (
            <>
              <FoundCounter
                count={inscriptions?.count}
                customText={'inscriptions'}
                classNames={'px-[15px]'}
              />
              <div className='max-w-[1250px] mx-auto flex flex-wrap pt-[10px] gap-[10px] max-lg:justify-center'>
                {inscriptions?.inscriptions.map((card, index) => (
                  <Card
                    onClick={() => navigate(`/marketplace/inscriptions/${card.id}`)}
                    image={`http://0.0.0.0:8111/pub/preview/${card.id}`}
                    key={index}
                    text={card.number}
                    date={card.created}
                    tags={[{ tagText: card.file_type, active: true }]}
                    BigCard={false}
                    contentType={'image'}
                  />
                ))}
              </div>
              <Pagination
                activeClassName='bg-[#FFBB00] text-black'
                leftBtnPlaceholder={<Arrow />}
                rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
                buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
                currentPage={page}
                arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
                className={
                  'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
                }
                pageCount={inscriptions.pages}
                onPageChange={onPageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InscriptionsPage;
