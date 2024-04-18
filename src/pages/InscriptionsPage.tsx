import Card from '../components/Card/Card.tsx';
import {
  filterConfig,
  filterGenesisConfig,
  filterRangeConfig,
  filterTimeConfig,
  filterTypeConfig,
} from '../settings/settings.ts';
import Search from './components/Search/Search.tsx';
import Svg from '../assets/filters/Plus.tsx';
import TimeSvg from '../assets/filters/Time.tsx';
import RangeSvg from '../assets/filters/Range.tsx';
import FoundCounter from '../components/FoundCounter.tsx';
import Pagination from '../components/Table/Pagination.tsx';
import Arrow from '../assets/TableArrow.svg?react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Placeholders/Skeleton.tsx';
import { MARKET_API_URL } from '@/consts';
import { useInscriptionFilters } from '@/hooks/useInscriptionFilters.ts';
import Filter from '@/components/Controls/Filter.tsx';
import TrendingIcon from '@/assets/filters/Trending.tsx';

const InscriptionsPage = () => {
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const {
    imagesLoaded,
    filters,
    isLoading,
    inscriptions,
    onPageChange,
    handleTimeFilterChange,
    handleTypeFilterChange,
    handleSortByFilterChange,
    handleRangeFilterChange,
    handleImageLoad,
    handleDeleteGenesisBlock,
  } = useInscriptionFilters();

  return (
    <div className={'bg-black min-h-screen'}>
      <div className='max-w-[1700px] max-medium:flex-col mx-auto flex pt-[150px] max-medium:pt-[100px]'>
        <div className='w-full max-w-[421px] max-medium:max-w-none pt-[35px] px-[10px]'>
          <Search placeholder={'Search'} />
          <div
            className={
              'mt-[35px] flex flex-col gap-[30px] max-medium:mt-[18px] max-medium:gap-[11px]'
            }
          >
            {/* Hide trending row in mobile version */}
            <Filter
              config={filterConfig}
              onChange={handleSortByFilterChange}
              state={filters.sortBy ?? ''}
              className='max-medium:hidden'
            />
            <Filter
              selectAll={{ text: 'All' }}
              SvgIcon={Svg}
              config={filterTypeConfig}
              onChange={handleTypeFilterChange}
              state={filters.contentType ?? ''}
              mobileHorizontally
            />
            <div className='flex flex-col gap-[30px] max-medium:flex-row max-medium:justify-between max-medium:gap-[2px] flex-wrap'>
              <Filter
                selectAll={{ text: 'All Time' }}
                SvgIcon={TimeSvg}
                config={filterTimeConfig}
                onChange={handleTimeFilterChange}
                state={filters.timeFilter ?? ''}
              />
              {/* Trending button is visible in mobile version (viewport that has less than 850px)*/}
              <Filter
                selectAll={{ text: 'Trending' }}
                SvgIcon={TrendingIcon}
                config={filterConfig}
                onChange={handleSortByFilterChange}
                state={filters.sortBy ?? ''}
                className='hidden max-medium:block'
                mobileAlwaysActive
              />
              <Filter
                selectAll={{ text: 'Range' }}
                SvgIcon={RangeSvg}
                config={filterRangeConfig}
                onChange={handleRangeFilterChange}
                state={[filters.from, filters.to] as string[]}
              />
            </div>
            {urlSearchParams.get('genesisBlock') && (
              <Filter
                selectAll={{ text: 'Genesis Block' }}
                SvgIcon={Svg}
                config={filterGenesisConfig}
                onChange={handleDeleteGenesisBlock}
                state={[filters.from, filters.to] as string[]}
                mobileHorizontally
              />
            )}
          </div>
        </div>
        <div className='flex-grow overflow-y-auto max-md:px-[0px] md:px-[10px]'>
          {inscriptions && !isLoading ? (
            <>
              <FoundCounter
                count={inscriptions?.count}
                customText={'inscriptions'}
                classNames={'px-[15px]'}
              />
              <div className='max-w-[1250px] mx-auto flex flex-wrap pt-[10px] max-md:gap-[5px] md:gap-[10px] max-lg:justify-center'>
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
