import { Field, InlineTable, ItemField } from '../InlineTable/InlineTable';
import Pagination from '../Table/Pagination';
import Arrow from '../../assets/TableArrow.svg?react';
import { useSearchParams } from 'react-router-dom';

const FIELDS: Field[] = [
  { key: 'txid', title: 'ATOMICALS TXID' },
  { key: 'event', title: 'EVENT' },
  { key: 'price', title: 'PRICE' },
  { key: 'quantity', title: 'QUANTITY' },
  { key: 'total', title: 'TOTAL VALUE' },
  { key: 'from', title: 'FROM' },
  { key: 'to', title: 'TO' },
  { key: 'time', title: 'TIME' },
];

const MOCK_DATA: ItemField[] = [
  {
    txid: { value: '2e86b...2d4a7:0', bold: true },
    event: { value: 'Unlisted' },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e86b...2d4a7:0', bold: true },
    event: { value: 'Unlisted' },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e86b...2d437:0', bold: true },
    event: { value: 'Unlisted' },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e86b...2d427:0', bold: true },
    event: { value: 'Unlisted' },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e86b...2a427:0', bold: true },
    event: { value: 'Listed', marked: true },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e86b...3d427:0', bold: true },
    event: { value: 'Listed', marked: true },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e89b...3d427:0', bold: true },
    event: { value: 'Unlisted' },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
  {
    txid: { value: '2e89b...3d427:0', bold: true },
    event: { value: 'Unlisted' },
    price: { value: '8,500', under: '$5.28', additional: 'sats/atom' },
    quantity: { value: '1,517' },
    total: { value: '12,894,500', under: '$8008.74', additional: 'sats' },
    from: { value: 'bc1p4...y7vz2' },
    to: { value: '-' },
    time: { value: '4/18/2024, 5:59:58 PM' },
  },
];

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = isNaN(Number(searchParams.get('page'))) ? 1 : Number(searchParams.get('page'));

  const handlePageChange = (page: number) => {
    searchParams.set('page', (page + 1).toString());

    setSearchParams(searchParams);
  };

  return (
    <div className='flex flex-col pt-[47px]'>
      <div className='w-full overflow-x-auto'>
        <InlineTable
          fields={FIELDS}
          data={MOCK_DATA}
          cellClassName='pl-[73px] max-medium:pl-[35px]'
          underClassName='font-bold'
          keyId='txid'
        />
      </div>
      <div className='pt-[15px]'>
        <Pagination
          activeClassName='bg-[#FFBB00] text-black'
          leftBtnPlaceholder={<Arrow />}
          rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
          buttonsClassName='flex items-center justify-center w-auto min-w-[21px] px-[7px] bg-[#191919] rounded-full text-[14px]'
          currentPage={page - 1}
          arrowsClassName='h-full flex items-center p-[6px] bg-[#191919] rounded-[26px]'
          className={
            'text-white flex justify-center items-center gap-x-[3px] text-center align-middle'
          }
          pageCount={20}
          onPageChange={handlePageChange}
          dotsClassName='tracking-[-0.15em]'
        />
      </div>
    </div>
  );
};
