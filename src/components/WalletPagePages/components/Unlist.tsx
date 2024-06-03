import { ITransfer } from '@/interfaces/intefaces';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface UnlistProps {
  transfers: Record<string, ITransfer[]>;
  amount: number;
  unlist: (transfers: UnlistProps['transfers']) => void;
  onCancel: () => void;
}

export const Unlist = ({ transfers, amount, unlist, onCancel }: UnlistProps) => {
  return (
    <div className='flex flex-col gap-[34px] items-center'>
      <h1 className='text-[20px] leading-[21px] font-bold'>Confirmation</h1>
      <p className='text-[20px] leading-[21px] text-[#53DCFF]'>Unlist following tokens?</p>
      <div
        className={classNames(
          'flex gap-[34px] max-w-[500px] overflow-auto pb-4',
          Object.values(transfers).flat().length > 2 && 'px-[62px] -mx-[62px]',
        )}
      >
        {Object.entries(transfers).reduce((acc, [key, value]) => {
          const transferAmountStr = amount.toLocaleString();
          const fontSize = transferAmountStr.length > 7 ? (32 * 5) / transferAmountStr.length : 32;

          return [
            ...acc,
            ...value.map((transfer) => {
              return (
                <div
                  key={transfer.inscription_id}
                  className={classNames(
                    'px-[10px] py-[13px] bg-[#262626] rounded-[15px] flex flex-col gap-[15px] w-[170px] h-[130px] transition',
                  )}
                >
                  <div className='w-[150px] h-[70px] flex items-center justify-center rounded-[9px] bg-[#0F0F0F]'>
                    <div>
                      <p
                        style={{
                          fontSize,
                        }}
                        className='font-bold'
                      >
                        {transfer.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between flex-1'>
                    <p className='overflow-hidden rounded-[4px] text-ellipsis text-[16px] border border-[#FFBB00] text-[#FFBB00] px-[5px]'>
                      {key}
                    </p>
                    <p className='rounded-[4px] text-[16px] border px-[5px]'>#{transfer.number}</p>
                  </div>
                </div>
              );
            }),
          ];
        }, [] as ReactNode[])}
      </div>
      <div className='flex px-[24px] py-[9px] justify-between w-full border border-[#53DCFF] rounded-[50px]'>
        <p className='text-[20px] font-bold leading-[21px] text-[#53DCFF]'>TOTAL</p>
        <p className='text-[20px] font-bold leading-[21px]'>{amount.toLocaleString()}</p>
      </div>
      <div className='flex gap-[52px]'>
        <button
          onClick={onCancel}
          className='font-bold py-[6px] px-[45px] rounded-[20px] text-[20px] text-black bg-white'
        >
          CANCEL
        </button>
        <button
          onClick={() => unlist(transfers)}
          className='font-bold py-[6px] px-[45px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};
