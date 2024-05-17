import { Field, InlineTable } from '../InlineTable/InlineTable';
import Pagination from '../Table/Pagination';
import Arrow from '../../assets/TableArrow.svg?react';
import { useQuery } from '@tanstack/react-query';
import { useMakeAuthRequests } from '@/hooks/auth';
import axios from 'axios';
import { MARKET_API_URL } from '@/consts';
import { convertOrdersToView, useOrdersFilters } from '@/hooks/market';
import Loading from 'react-loading';
import classNames from 'classnames';

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

export const Orders = () => {
  const makeAuthRequest = useMakeAuthRequests();

  const { page, changePage, tick } = useOrdersFilters();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['orders', tick, page, makeAuthRequest],
    queryFn: async () => {
      return makeAuthRequest(() =>
        axios.get(`${MARKET_API_URL}/pub/tokens/history?tick=${tick}&page=${page}`),
      );
    },
    select: (data) => ({ ...data!.data, data: convertOrdersToView(data!.data.events) }),
  });

  console.log(data);

  return (
    <div className='flex flex-col pt-[47px]'>
      <div className=' flex justify-center min-h-[640px]'>
        {isError && (
          <p>
            Error while loading <span>orders history</span>.
          </p>
        )}
        <div className='relative w-full overflow-x-auto'>
          {isLoading && (
            <div className='absolute w-full h-full flex justify-center items-center'>
              <Loading type='balls' />
            </div>
          )}
          <div className={classNames({ 'opacity-40': isLoading })}>
            {(isLoading || isSuccess) && (
              <InlineTable
                fields={FIELDS}
                data={data?.data || []}
                cellClassName='pl-[73px] max-medium:pl-[35px]'
                underClassName='font-bold'
                keyId='rawTxid'
              />
            )}
          </div>
        </div>
      </div>
      <div className='pt-[15px]'>
        <Pagination
          activeClassName='bg-[#FFBB00] text-black'
          leftBtnPlaceholder={<Arrow />}
          rightBtnPlaceholder={<Arrow className={'rotate-180 flex'} />}
          buttonsClassName='flex items-center justify-center w-auto min-w-[2.25rem] px-[6px] h-9 bg-[#191919] rounded-full'
          currentPage={page - 1}
          arrowsClassName='h-full flex items-center p-[10px] bg-[#191919] rounded-[26px]'
          className={
            'text-white flex justify-center pt-[30px] pb-[30px] items-center gap-x-[10px] text-center align-middle'
          }
          pageCount={data?.total_pages - 1 || 0}
          onPageChange={changePage}
        />
      </div>
    </div>
  );
};
