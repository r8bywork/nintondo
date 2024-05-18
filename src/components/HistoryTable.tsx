import Loading from 'react-loading';
import { Field, InlineTable, ItemField } from './InlineTable/InlineTable';
import Pagination from './Table/Pagination';
import classNames from 'classnames';
import Arrow from '../assets/TableArrow.svg?react';

interface HistoryTable {
  data?: ItemField[];
  fields: Field[];
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (page: number) => void;
  tick: string;
  totalPages: number;
}

export const HistoryTable = ({
  data,
  fields,
  isLoading,
  isSuccess,
  isError,
  page,
  onPageChange,
  tick,
  totalPages,
}: HistoryTable) => {
  return (
    <div className='flex flex-col pt-[47px] w-full'>
      <div className='relative flex justify-center min-h-[670px]'>
        {isSuccess && !data?.length && (
          <p className='absolute top-[100px] text-[24px] font-bold text-center'>
            No orders found for <span className='text-[#FFBB00]'>{tick}</span>
          </p>
        )}
        {isError && (
          <p>
            Error while loading <span>orders history</span>.
          </p>
        )}
        {!isError && (
          <div className='relative w-full overflow-x-auto'>
            {isLoading && (
              <div className='absolute w-full h-full flex justify-center items-center'>
                <Loading type='balls' />
              </div>
            )}
            <div className={classNames({ 'opacity-40': isLoading })}>
              {(isLoading || isSuccess) && (
                <InlineTable
                  fields={fields}
                  data={data || []}
                  cellClassName='pl-[50px] max-medium:pl-[35px]'
                  underClassName='font-bold'
                  keyId='id'
                />
              )}
            </div>
          </div>
        )}
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
            'text-white flex justify-center items-center gap-x-[10px] text-center align-middle'
          }
          pageCount={totalPages - 1 || 0}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
