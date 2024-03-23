import FoundCounter from '../components/FoundCounter.tsx';
import Table from '../components/Table/Table.tsx';
import { collectionsFieldsTable } from '../settings/fields.tsx';
import { collectionsMock } from '../settings/settings.ts';
import { useEffect, useState } from 'react';
import { createHref } from '../utils';

const CollectionsPage = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const [currentPage, setCurrentPage] = useState(Number(urlSearchParams.get('page')) || 1);
  const [limit] = useState(Number(urlSearchParams.get('limit')) || 4);
  const [startItem, setStartItem] = useState(((currentPage - 1) * limit) | 0);
  const [lastItem, setLastItem] = useState(currentPage * limit);
  const [recordsTotal] = useState(collectionsMock.length);

  const fetchData = (currentPage: number, limit: number) => {
    console.log(currentPage, limit);
  };
  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    const params = createHref({ page: String(newPage) }, urlSearchParams);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
    setCurrentPage(newPage);
    setStartItem((newPage - 1) * limit);
    setLastItem(newPage * limit);
  };

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
            // In the future, the data from the query will be changed here, without trimming the array
            data={collectionsMock.slice(startItem, lastItem)}
            fields={collectionsFieldsTable}
            mode={'collections'}
            selectedColumns={['image', 'collection', 'creationFee']}
            pagination={{
              currentPage: currentPage,
              recordsTotal: recordsTotal,
              pageCount: Math.ceil(recordsTotal / limit),
              onPageChange: handlePageChange,
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default CollectionsPage;
