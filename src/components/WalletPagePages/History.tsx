import { convertOrdersToView, useOrdersFilters } from '@/hooks/market';
import { Field } from '../InlineTable/InlineTable';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MARKET_API_URL } from '@/consts';
import { HistoryTable } from '../HistoryTable';
import { Filter } from '../MarketplacePages/components/Filter';
import { EVENT_FILTERS } from '@/utils/market/constants';
import { TickDropdown } from '../MarketplacePages/components/TickDropdown';
import { useMakeAuthRequests } from '@/hooks/auth';

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

export const History = () => {
  const makeAuthRequest = useMakeAuthRequests();
  const { page, changePage, tick, filter } = useOrdersFilters();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['orders', tick, page, filter],
    queryFn: async () => {
      return makeAuthRequest(() =>
        axios.get(
          `${MARKET_API_URL}/tokens/history?tick=${tick}&page=${page}${
            filter !== 'all' ? `&event=${filter}` : ''
          }`,
          { withCredentials: true },
        ),
      );
    },
    select: (data) => ({ ...data!.data, data: convertOrdersToView(data!.data.events) }),
  });

  return (
    <div className='flex flex-col gap-[30px]'>
      <div className='flex items-center gap-[15px]'>
        <TickDropdown />
        <div>
          <Filter
            defaultFilter={Object.keys(EVENT_FILTERS)[0]}
            filterKey='event'
            filters={EVENT_FILTERS}
            className='min-w-[150px]'
          />
        </div>
      </div>
      <div>
        <HistoryTable
          data={data?.data}
          isError={isError}
          isSuccess={isSuccess}
          isLoading={isLoading}
          onPageChange={changePage}
          tick={tick}
          totalPages={data?.total_pages || 0}
          fields={FIELDS}
          page={page}
        />
      </div>
    </div>
  );
};
