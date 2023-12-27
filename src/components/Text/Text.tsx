import BellsIcon from '../../assets/bells.svg?react';
const Text = () => {
  return (
    <div className={'text-center text-white flex flex-col items-center'}>
      <div className='mb-8 text-[40px] md:justify-center relative'>
        <span className={'pl-[10px] rounded-l-[8px] bg-black'}>A secure wallet to store </span>
        <span className={'pr-[35px] rounded-r-[8px] bg-black text-regal-yellow relative'}>
          Bells
          <BellsIcon className={'absolute right-0 bottom-2'} />
        </span>
      </div>

      <div className='text-[20px] md:flex md:justify-center md:flex-col items-center'>
        <div className='inline bg-black px-[5px] mb-[5px] rounded-[8px]'>
          <span>Store. Exchange. Transact. Mine. Explore.</span>
        </div>
      </div>
    </div>
  );
};

export default Text;
