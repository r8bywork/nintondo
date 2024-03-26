import Card from '../components/Card/Card.tsx';
import {
  cardConfig,
  filterConfig,
  filterTimeConfig,
  filterTypeConfig,
} from '../settings/settings.ts';
import Search from './components/Search/Search.tsx';
import Filter from '../components/Controls/Filter.tsx';
import Svg from '../assets/filters/Plus.tsx';
import TimeSvg from '../assets/filters/Time.tsx';
const MarketPlacePage = () => {
  return (
    <div className={'bg-black'}>
      <div className='h-[100vh] max-w-[1700px] mx-auto flex pt-[150px]'>
        <div className='flex-none max-w-[421px] w-full'>
          <Search placeholder={'Search'} />
          <div className={'mt-[35px] flex flex-col gap-[30px]'}>
            <Filter
              singleSelect
              config={filterConfig}
            />
            <Filter
              selectAll={{ text: 'All' }}
              SvgIcon={Svg}
              config={filterTypeConfig}
            />
            <Filter
              selectAll={{ text: 'All Time' }}
              SvgIcon={TimeSvg}
              config={filterTimeConfig}
              containParams={{
                fontSize: '16px',
                marginRight: '0px',
                paddingLeft: '0px',
                paddingRight: '0px',
              }}
            />
          </div>
        </div>

        <div className='flex-grow overflow-y-auto'>
          <div className='max-w-[1250px] mx-auto flex flex-wrap gap-[10px]'>
            {cardConfig.map((card, index) => (
              <Card
                key={index}
                {...card}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlacePage;