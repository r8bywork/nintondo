import { MarketplaceTokenView } from '@/interfaces/marketapi';
import Token from '../Token/Token';

interface ConfirmationModalProps {
  onClose: () => void;
  tokensToBuy: MarketplaceTokenView[];
  tick: string;
  onConfirm: (tokensToBuy: MarketplaceTokenView[], tick: string) => void;
}

export const ConfirmationModal = ({
  onConfirm,
  onClose,
  tokensToBuy,
  tick,
}: ConfirmationModalProps) => {
  return (
    <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] rounded-[15px] py-[21px] mx-[17px] px-[62px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
      <p className='text-[20px] font-bold'>Confirmation</p>
      <p className='text-[20px] text-[#4b4b4b]'>Please, confirm the transaction below:</p>
      <div>
        {tokensToBuy.map((value) => (
          <Token
            token={value}
            tick={tick || ''}
            key={value.outpoint}
            background='#292929'
          />
        ))}
      </div>
      <div className='flex flex-col gap-[13px]'>
        <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B] max-w-[620px]'>
          <div className='flex w-[400px] max-medium:w-[220px] justify-between'>
            <p className='text-[20px] text-[#4B4B4B]'>TOTAL VALUE</p>
            <p className='text-[20px]'>8000000</p>
          </div>
          <div className='flex w-[200px] max-medium:w-[120px] justify-between pt-[6px]'>
            <p className='text-[20px] max-medium:text-[14px] text-[#4B4B4B]'>sats</p>
            <p className='text-[20px] max-medium:text-[14px]'>~$5000.00</p>
          </div>
        </div>
        <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
          <div className='flex w-[400px] max-medium:w-[220px] justify-between'>
            <p className='text-[20px] text-[#4B4B4B]'>SERVICE FEE</p>
            <p className='text-[20px] '>40000</p>
          </div>
          <div className='flex w-[200px] max-medium:w-[120px] justify-between pt-[6px]'>
            <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>sats</p>
            <p className='text-[20px] max-medium:text-[14px]'>~$25.29</p>
          </div>
        </div>
        <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
          <div className='flex w-[400px] max-medium:w-[220px] flex-col gap-[10px]'>
            <div className='flex justify-between'>
              <p className='text-[20px] text-[#4B4B4B]'>TRANSACTION FEE RATE</p>
              <p className='text-[20px]'>321</p>
            </div>
            <div className='flex justify-between'>
              <p className='text-[20px] text-[#4B4B4B]'></p>
              <p className='text-[20px]'>10778</p>
            </div>
          </div>
          <div className='flex w-[200px] max-medium:w-[120px] flex-col gap-[10px] max-medium:gap-[49px] pt-[6px]'>
            <div className='flex justify-between items-center'>
              <p className='text-[20px] max-medium:text-[14px] text-[#4B4B4B]'>sats/vB</p>
              <button className='text-[20px] text-[#FFBB00] border border-[#FFBB00] px-2 rounded-[4px] leading-5 max-medium:text-[14px] max-medium:px-[2px]'>
                Customize
              </button>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>sats</p>
              <p className='text-[20px] max-medium:text-[14px]'>~$25.29</p>
            </div>
          </div>
        </div>
        <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
          <div className='flex w-[400px] max-medium:w-[220px] flex-col gap-[10px]'>
            <div className='flex justify-between'>
              <p className='text-[20px] text-[#4B4B4B]'>TOTAL</p>
              <p className='text-[20px] text-[#FFBB00] font-bold'>~8,050,778</p>
            </div>
            <div className='flex justify-between'>
              <p className='text-[20px]'></p>
              <p className='text-[20px] text-[#4B4B4B]'>0.08050778</p>
            </div>
          </div>
          <div className='flex w-[200px] max-medium:w-[120px] flex-col gap-[19px] pt-[6px]'>
            <div className='flex justify-between items-center'>
              <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>sats</p>
              <p className='text-[20px] max-medium:text-[14px]'>~$4325.29</p>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>BTC</p>
              <p className='text-[20px]'></p>
            </div>
          </div>
        </div>
        <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px] border-b border-[#4B4B4B]'>
          <div className='flex w-[400px] max-medium:w-[220px] justify-between'>
            <p className='text-[20px] text-[#4B4B4B]'>AVAILABLE BALANCE</p>
            <p className='text-[20px] text-[#4B4B4B]'>0</p>
          </div>
          <div className='flex w-[200px] max-medium:w-[120px] justify-between pt-[6px]'>
            <p className='text-[20px] text-[#4B4B4B] max-medium:text-[14px]'>BTC</p>
            <p className='text-[20px]'></p>
          </div>
        </div>
      </div>
      <div className='flex gap-[27px]'>
        <button
          onClick={onClose}
          className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold'
        >
          CANCEL
        </button>
        <button
          onClick={() => onConfirm(tokensToBuy, tick)}
          className='shadow-[0px_1px_18px_0px_#FFD45C80] py-[6px] px-[45px] rounded-full bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] text-[#000] text-[20px] font-bold '
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};
