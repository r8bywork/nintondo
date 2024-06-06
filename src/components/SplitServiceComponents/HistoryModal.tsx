/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_URL } from '@/consts';
import { useMakeAuthRequests } from '@/hooks/auth';
import { SplitHistoryItem } from '@/interfaces/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from 'react-loading';

interface HistoryModalProps {
  onClose: () => void;
}

export const HistoryModal = ({ onClose }: HistoryModalProps) => {
  const makeAuthRequest = useMakeAuthRequests();

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['split-history'],
    queryFn: () =>
      makeAuthRequest(() => axios.get(`${BACKEND_URL}/split/history`, { withCredentials: true })),
    select: (res) => (res?.data as SplitHistoryItem[]).map((item) => item.txid) as string[],
  });

  return (
    <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] rounded-[15px] py-[21px] mx-[17px] px-[36px] py-[20px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
      {isLoading && <Loading type='balls' />}
      <div className='max-h-[420px] overflow-y-auto px-[20px]'>
        {isSuccess && (
          <div className='flex flex-col gap-3 text-[#53DCFF] py-3 items-center'>
            <span className='text-white font-bold text-[26px]'>TXIDS</span>
            {data?.map((f, i) => (
              <a
                href={`/explorer/tx/${f}`}
                key={i}
              >
                {f}
              </a>
            ))}
          </div>
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
