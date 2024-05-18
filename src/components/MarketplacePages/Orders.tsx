import { Field } from '../InlineTable/InlineTable';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MARKET_API_URL } from '@/consts';
import { convertOrdersToView, useOrdersFilters } from '@/hooks/market';
import { HistoryTable } from '../HistoryTable';

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
  const { page, changePage, tick, filter } = useOrdersFilters();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['orders', tick, page, filter],
    queryFn: async () => {
      return axios.get(
        `${MARKET_API_URL}/pub/tokens/history?tick=${tick}&page=${page}${
          filter !== 'all' ? `&event=${filter}` : ''
        }`,
      );
    },
    select: (data) => ({ ...data!.data, data: convertOrdersToView(data!.data.events) }),
  });

  return (
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
  );
};
