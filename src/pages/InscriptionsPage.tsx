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
import FoundCounter from '../components/FoundCounter.tsx';
const InscriptionsPage = () => {
  return (
    <div className={'bg-black min-h-screen'}>
      <div className='max-w-[1700px] max-medium:flex-col mx-auto flex pt-[150px] max-medium:pt-[100px]'>
        <div className='w-full max-w-[421px] max-medium:max-w-none pt-[35px] px-[15px]'>
          <Search placeholder={'Search'} />
          <div className={'mt-[35px] flex flex-col gap-[30px]'}>
            <Filter
              singleSelect
              config={filterConfig}
            />
            <Filter
              singleSelect
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
          <FoundCounter
            count={2022442}
            customText={'inscriptions'}
            classNames={'px-[15px]'}
          />
          <div className='max-w-[1250px] mx-auto flex flex-wrap pt-[10px] gap-[10px] max-lg:justify-center'>
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

export default InscriptionsPage;
