import { useNumericInput } from '@/hooks/useNumericInput';
import { ITransfer } from '@/interfaces/intefaces';
import classNames from 'classnames';
import { ReactNode } from 'react';

interface ListProps {
  transfers: Record<string, ITransfer[]>;
  amount: number;
  tick: string;
  list: (pricePerToken: number) => void;
  onCancel: () => void;
}

export const ListModal = ({ transfers, amount, list, onCancel, tick }: ListProps) => {
  const [price, changePrice] = useNumericInput(0);

  return (
    <div className='flex flex-col gap-[34px] items-center'>
      <h1 className='text-[20px] leading-[21px] font-bold'>Confirmation</h1>
      <p className='text-[20px] leading-[21px] text-[#53DCFF]'>List following tokens?</p>
      <div
        className={classNames(
          'flex gap-[34px] max-w-[500px] overflow-auto',
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
      <div className='flex justify-between w-full flex-col gap-1'>
        <p className='text-[20px] font-bold'>
          Enter price <span className='text-[#4b4b4b] font-normal'>BEL/{tick}</span>
        </p>
        <input
          inputMode='numeric'
          pattern='[0-9]*'
          className='rounded-[50px] outline-none px-[20px] py-[3px] text-[18px] leading-[30px] bg-[#4b4b4b] w-full'
          placeholder={`BEL/${tick}`}
          value={price}
          onChange={(e) => changePrice(e.target.value)}
        />
      </div>
      <div className='flex px-[24px] py-[9px] justify-between w-full border border-[#53DCFF] rounded-[50px]'>
        <p className='text-[20px] font-bold leading-[21px] text-[#53DCFF]'>TOTAL</p>
        <p className='text-[20px] font-bold leading-[21px]'>
          {(amount * (Number(price) ?? 0)).toLocaleString()}
        </p>
      </div>
      <div className='flex gap-[52px]'>
        <button
          onClick={onCancel}
          className='font-bold py-[6px] px-[45px] rounded-[20px] text-[20px] text-black bg-white'
        >
          CANCEL
        </button>
        <button
          onClick={() => list(Number(price))}
          className='font-bold py-[6px] px-[45px] rounded-[20px] text-[20px] text-black shadow-[0px_1px_18px_0px_#FFD45C80] bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)]'
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};
