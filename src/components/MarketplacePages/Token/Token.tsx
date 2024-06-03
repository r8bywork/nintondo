import { MarketplaceTokenView } from '@/interfaces/marketapi';
import { FC } from 'react';
import cn from 'classnames';
import BellsIcon from '@/assets/bells.svg?react';

interface TokenProps {
  token: MarketplaceTokenView;
  tick: string;
  full?: boolean;
  checked?: boolean;
  background?: string;
  onBuyClick?: (token: MarketplaceTokenView) => void;
  onSelect?: (token: MarketplaceTokenView) => void;
}

const Token: FC<TokenProps> = ({
  token,
  full,
  tick,
  checked = false,
  onBuyClick,
  background = '#1A1A1A',
  onSelect,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-between p-[15px] rounded-[24px] gap-[10px] border-[1px] transition-all',
        {
          'border-[#FFBB00]': checked,
          'border-[transparent]': !checked,
        },
      )}
      style={{ background }}
    >
      <div className='flex justify-between items-center'>
        <p className='bg-[#0F0F0F] text-[#FFFFFF] px-[20px] py-[2px] rounded-[31px] text-[16px]'>
          {tick}
        </p>
        {full && (
          <button
            className={cn(
              'size-[20px] rounded-[5px] cursor-pointer transition-all border-[1px]',
              { 'bg-[#0F0F0F] border-[#1A1A1A]': !checked },
              { 'bg-[#53DCFF] border-[transparent]': checked },
            )}
            onClick={() => onSelect?.(token)}
          />
        )}
      </div>
      <div className='bg-[#0F0F0F] rounded-[9px] px-[29px] py-[20px] flex items-center justify-evenly gap-3'>
        <div className=''>
          <p className=' text-[18px]'>{token.amount}</p>
        </div>
        <div className='w-[2px] h-[55px] bg-white'></div>
        <div className=''>
          <p className='text-[#FFBB00] text-[18px]'>{token.price_per_token / 10 ** 8}</p>
          <span></span>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <p className='font-bold text-[18px]'>{token.shortenOutpoint}</p>
        {full && (
          <>
            <div className='flex justify-between items-center'>
              <p className='border-[1px] rounded-[4px] h-[19px] border-[#FFFFFF] px-[5px] text-[16px] font-normal text-[#FFFFFF] leading-[19px] gap-[5px] flex items-center'>
                <BellsIcon className='w-[11px]' />
                {token.fullPrice}
              </p>
              <p className='border-[1px] rounded-[4px] border-[#4B4B4B] px-[5px] text-[16px] font-normal text-[#4B4B4B] leading-[17px]'>
                $ 0
              </p>
            </div>
            <button
              className='h-[32px] text-[18px] leading-[21px] text-center border-[1px] border-[#FFFFFF] rounded-[20px] font-bold flex items-center justify-center transition duration-300 hover:border-[#FFBB00] hover:text-[#FFBB00] scale-[1] hover:scale-[1.02] cursor-pointer'
              onClick={() => onBuyClick?.(token)}
            >
              Buy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Token;
