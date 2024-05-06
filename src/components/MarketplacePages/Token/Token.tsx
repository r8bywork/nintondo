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
      className={cn('flex flex-col py-[8px] px-[10px] rounded-[15px] gap-[10px]')}
      style={{ background }}
    >
      <div className='flex justify-between items-center'>
        <p className='bg-[#0F0F0F] text-[#FFFFFF] px-[7px] py-[2px] rounded-[31px] text-[14px]'>
          {tick}
        </p>
        {full && (
          <button
            className={cn(
              'size-[15px] rounded-[4px] cursor-pointer transition-all border-[1px]',
              { 'bg-[#0F0F0F] border-[#1A1A1A]': !checked },
              { 'bg-[#53DCFF] border-[transparent]': checked },
            )}
            onClick={() => onSelect?.(token)}
          />
        )}
      </div>
      <div className='bg-[#0F0F0F] rounded-[9px] px-[29px] py-[16px] flex items-center justify-evenly gap-3'>
        <div className=''>
          <p className=' text-[16px]'>{token.amount}</p>
        </div>
        <div className='w-[1px] h-[55px] bg-white'></div>
        <div className=''>
          <p className='text-[#FFBB00] text-[16px]'>{token.price_per_token.toFixed(4)}</p>
          <span></span>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <p className='font-bold text-[16px]'>{token.shortenOutpoint}</p>
        {full && (
          <>
            <div className='flex justify-between items-center'>
              <p className='border-[1px] rounded-[4px] h-[19px] border-[#FFFFFF] px-[5px] text-[14px] font-normal text-[#FFFFFF] leading-[17px] gap-[5px] flex items-center'>
                <BellsIcon className='w-[11px]' />
                {token.fullPrice}
              </p>
              <p className='border-[1px] rounded-[4px] border-[#4B4B4B] px-[5px] text-[14px] font-normal text-[#4B4B4B] leading-[17px]'>
                $ 0
              </p>
            </div>
            <button
              className=' h-[24px] text-center border-[1px] border-[#FFFFFF] rounded-[20px] font-bold flex items-center justify-center transition duration-300 hover:border-[#FFBB00] hover:text-[#FFBB00] cursor-pointer'
              onClick={() => onBuyClick?.(token)}
            >
              BUY
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Token;
