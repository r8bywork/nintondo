import { useNumericInput } from '@/hooks/useNumericInput';
import classNames from 'classnames';
import { useRef, useState } from 'react';

type FeeType = 'normal' | 'custom';

interface CustomizeModalProps {
  onClose: () => void;
  onConfirm: (fee: number) => void;
  defaultFee: number;
  normalFee: number;
}

export const CustomizeModal = ({
  onConfirm,
  onClose,
  defaultFee,
  normalFee,
}: CustomizeModalProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [feeType, setFeeType] = useState<FeeType>('normal');
  const [customFee, changeCustomFee] = useNumericInput(defaultFee, { integerOnly: true });

  const handleCustomClick = () => {
    setFeeType('custom');
    if (ref) {
      ref.current?.focus();
    }
  };

  return (
    <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] max-w-[740px] max-medium:max-w-[395px] rounded-[15px] py-[21px] mx-[17px] px-[62px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
      <p className='text-[20px] font-bold'>Customize</p>
      <p className='text-[20px] text-[#53DCFF]'>Select the network fee you want to pay:</p>
      <div className='flex flex-col w-full px-[25px] gap-[15px]'>
        <div
          className='flex w-full max-w-[370px] justify-between pl-[20px] px-[26px] py-[9px] bg-[#262626] rounded-[50px] cursor-pointer transition '
          onClick={() => setFeeType('normal')}
        >
          <button
            className={classNames('font-bold text-[20px] leading-[21px] transition', {
              'text-[#53DCFF]': feeType === 'normal',
            })}
            onClick={() => setFeeType('normal')}
          >
            NORMAL
          </button>
          <div className='font-bold text-[20px] leading-[21px] text-[#FFBB00] flex gap-[10px]'>
            {normalFee}
            <span className='font-normal text-[#4b4b4b]'>sats/vB</span>
          </div>
        </div>
        <div
          className='flex w-full max-w-[370px] justify-between pl-[20px] px-[26px] py-[9px] bg-[#262626] rounded-[50px] cursor-pointer transition '
          onClick={handleCustomClick}
        >
          <button
            className={classNames('font-bold text-[20px] leading-[21px] transition', {
              'text-[#53DCFF]': feeType === 'custom',
            })}
            onClick={handleCustomClick}
          >
            CUSTOM
          </button>
          <div className='flex gap-[10px] items-center'>
            <input
              ref={ref}
              className='bg-[transparent] flex-1 pl-[15px] h-[21px] w-full text-right font-bold text-[20px] leading-[21px] text-[#FFBB00] outline-none'
              inputMode='numeric'
              pattern='[0-9]*'
              value={customFee}
              onChange={(e) => changeCustomFee(e.target.value)}
            />
            <p className='text-[20px] leading-[21px] font-normal text-[#4b4b4b] break-keep flex-grow-1'>
              sats/vB
            </p>
          </div>
        </div>
      </div>
      <div className='flex gap-[27px] px-[14px]'>
        <button
          onClick={onClose}
          className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold leading-[21px]'
        >
          CANCEL
        </button>
        <button
          onClick={() => onConfirm(feeType === 'custom' ? Number(customFee) : defaultFee)}
          className='shadow-[0px_1px_18px_0px_#FFD45C80] py-[6px] px-[45px] rounded-full bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] text-[#000] text-[20px] leading-[21px] font-bold '
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};
