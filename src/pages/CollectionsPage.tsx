import FoundCounter from '../components/FoundCounter.tsx';
import Table from '../components/Table/Table.tsx';
import { collectionsFieldsTable } from '../settings/fields.tsx';
import { collectionsMock } from '../settings/settings.ts';

const CollectionsPage = () => {
  return (
    <div className={'pt-[150px] max-lg:pt-[100px] bg-black min-h-screen text-white'}>
      <div className={'max-w-[1326px] mx-auto px-[20px]'}>
        <div className={'flex flex-col gap-y-[10px]'}>
          <h1 className={'text-[32px] leading-[32px] font-bold'}>Collections</h1>
          <FoundCounter
            count={10000}
            customText={'collections'}
          />
        </div>
        <div className={'mt-[50px]'}>
          <Table
            data={collectionsMock}
            fields={collectionsFieldsTable}
            mode={'collections'}
          />
        </div>
      </div>
    </div>
  );
};
export default CollectionsPage;
