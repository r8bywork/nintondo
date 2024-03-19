import { useNintondoManagerContext } from '@/utils/bell-provider';

const SplitServicePage = () => {
  const { address } = useNintondoManagerContext();

  if (!address)
    return (
      <div className={'bg-black'}>
        <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px] items-center justify-center text-white'>
          Please connect your wallet
        </div>
      </div>
    );

  return (
    <div className={'bg-black'}>
      <div className='h-screen max-w-[1700px] mx-auto flex pt-[150px]'></div>
    </div>
  );
};

export default SplitServicePage;
