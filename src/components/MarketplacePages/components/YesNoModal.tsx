import Loading from 'react-loading';

interface YesNoModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const YesNoModal = ({ isLoading, onCancel, onConfirm }: YesNoModalProps) => {
  return (
    <div className='bg-[#191919] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] max-w-[740px] max-medium:max-w-[395px] rounded-[15px] py-[21px] mx-[17px] px-[62px] max-medium:px-[25px] flex flex-col gap-[34px] items-center'>
      {isLoading && <Loading type='balls' />}
      {isLoading || (
        <>
          <h1>
            You do not have enough utxos to complete this transaction, would you like to create
            needed utxos?
          </h1>
          <div className='flex gap-[27px]'>
            <button
              onClick={onCancel}
              className='py-[6px] px-[45px] rounded-full bg-[#fff] text-[#000] text-[20px] font-bold'
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              className='shadow-[0px_1px_18px_0px_#FFD45C80] py-[6px] px-[45px] rounded-full bg-[linear-gradient(90deg,#FFFFFF_0%,#FFBB00_99.07%)] text-[#000] text-[20px] font-bold '
            >
              CREATE
            </button>
          </div>
        </>
      )}
    </div>
  );
};
