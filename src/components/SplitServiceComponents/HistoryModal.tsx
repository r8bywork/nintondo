import { BACKEND_URL } from '@/consts';
import { useMakeAuthRequests } from '@/hooks/auth';
import { SplitHistoryItem } from '@/interfaces/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Field, InlineTable, ItemField } from '../InlineTable/InlineTable';
import Loading from 'react-loading';
import { shortAddress } from '@/utils';
import { TableLink } from './components/TableLink';

const TABLE_HEADER: Field[] = [
  { key: 'shortenTXID', title: 'TXID', Component: TableLink },
  { key: 'confirmed', title: 'CONFIRMED' },
];

interface HistoryModalProps {
  onClose: () => void;
}

export const HistoryModal = ({ onClose }: HistoryModalProps) => {
  const makeAuthRequest = useMakeAuthRequests();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['split-history'],
    queryFn: () =>
      makeAuthRequest(() => axios.get(`${BACKEND_URL}/split/history`, { withCredentials: true })),
    select: (res) =>
      (res?.data as SplitHistoryItem[]).map((item) => ({
        txid: { value: item.txid },
        shortenTXID: { value: shortAddress(item.txid) },
        confirmed: { value: item.confirmed ? 'Yes' : 'No' },
      })) as ItemField[],
  });

  return (
    <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] rounded-[15px] py-[21px] mx-[17px] px-[62px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
      {isLoading && <Loading type='balls' />}
      <div className='max-h-[420px] overflow-y-auto px-[20px]'>
        {isSuccess && (
          <InlineTable
            headClassName='sticky top-0 bg-[#191919]'
            fields={TABLE_HEADER}
            data={data}
            keyId='txid'
            cellClassName='px-[20px]'
            firstCellClassName='pl-[20px]'
          />
        )}
      </div>
      <button
        onClick={onClose}
        className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold'
      >
        CLOSE
      </button>
    </div>
  );
};
