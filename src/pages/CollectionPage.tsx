import CollectionHeader from '../components/CollectionComponents/CollectionHeader.tsx';
import { cardConfig, CollectionPageMock } from '../settings/settings.ts';
import Card from '../components/Card/Card.tsx';
import FoundCounter from '../components/FoundCounter.tsx';

const CollectionPage = () => {
  return (
    <div className={'pt-[150px] max-lg:pt-[100px] bg-black min-h-screen text-white'}>
      <div className={'max-w-[1670px] w-full mx-auto px-[0px]'}>
        <CollectionHeader data={CollectionPageMock} />
        <div className='flex-grow overflow-y-auto mt-[45px]'>
          <FoundCounter
            count={10000}
            customText={'collections'}
          />
          <div className='mx-auto flex flex-wrap pt-[10px] gap-[10px]'>
            {cardConfig.map((card, index) => (
              <Card
                key={index}
                {...card}
                contentType={'image'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CollectionPage;
