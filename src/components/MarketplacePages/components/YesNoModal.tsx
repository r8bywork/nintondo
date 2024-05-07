import { Modal } from '@/components/Modal';
import Loading from 'react-loading';
import { CustomizeModal } from './CustomizeModal';
import { DEFAULT_FEE_RATE } from '@/consts';
import { useModal } from '@/hooks/useModal';
import { useEffect, useState } from 'react';
import { useMakeDummyUTXOS } from '@/hooks/market';
import { useQuery } from '@tanstack/react-query';

interface YesNoModalProps {
  onCancel: () => void;
  onError: () => void;
  onSuccess: () => void;
}

export const YesNoModal = ({ onCancel, onError, onSuccess }: YesNoModalProps) => {
  const { isOpen: isCustomizeOpen, open: openCustomize, close: closeCustomize } = useModal();
  const [feeRate, setFeeRate] = useState(DEFAULT_FEE_RATE);

  const makeDummyUTXOsReq = useMakeDummyUTXOS();

  const {
    isLoading,
    refetch: makeDummyUTXOs,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['make-dumy-utxos'],
    queryFn: () => makeDummyUTXOsReq(feeRate),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      onSuccess();
    }

    if (!isLoading && isError) {
      onError();
    }
  }, [isLoading, isSuccess, isError]);

  const handleCustomizeFee = (feeRate: number) => {
    setFeeRate(feeRate);
    closeCustomize();
  };

  return (
    <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] max-w-[740px] max-medium:max-w-[395px] rounded-[15px] py-[21px] mx-[17px] px-[62px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
      {isLoading && <Loading type='balls' />}
      {isLoading || (
        <div className='flex flex-col gap-[34px] items-center'>
          <h1 className='text-center text-[20px] leading-[21px] font-bold'>
            You do not have enough utxos to complete this transaction{' '}
          </h1>
          <p className='text-center text-[20px] text-[#53DCFF]'>
            Would you like to create needed utxos?
          </p>
          <div className='flex gap-[20px] max-medium:gap-[12px] pb-[13px]'>
            <div className='flex w-[400px] max-medium:w-[220px] flex-col gap-[10px]'>
              <div className='flex justify-between'>
                <p className='text-[20px] text-[#4B4B4B]'>TRANSACTION FEE RATE</p>
                <p className='text-[20px] pt-[4px] max-medium:pt-0'>{feeRate}</p>
              </div>
            </div>
            <div className='flex w-[200px] max-medium:w-[120px] flex-col gap-[10px] max-medium:gap-[49px] pt-[6px]'>
              <div className='flex justify-between items-center'>
                <p className='text-[20px] max-medium:text-[14px] text-[#4B4B4B]'>sats/vB</p>
                <button
                  onClick={openCustomize}
                  className='text-[20px] text-[#FFBB00] border border-[#FFBB00] px-2 rounded-[4px] leading-5 max-medium:text-[14px] max-medium:px-[2px]'
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
          <div className='flex gap-[27px] justify-center'>
            <button
              onClick={onCancel}
              className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold'
            >
              CANCEL
            </button>
            <button
              onClick={() => makeDummyUTXOs()}
              className='shadow-[0px_1px_18px_0px_#FFD45C80] py-[6px] px-[45px] rounded-full bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] text-[#000] text-[20px] font-bold '
            >
              CREATE
            </button>
          </div>
        </div>
      )}
      {isCustomizeOpen && (
        <Modal
          isOpen
          onClose={closeCustomize}
        >
          <CustomizeModal
            defaultFee={feeRate}
            onClose={closeCustomize}
            onConfirm={handleCustomizeFee}
            normalFee={DEFAULT_FEE_RATE}
          />
        </Modal>
      )}
    </div>
  );
};
