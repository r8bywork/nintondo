const Text = () => {
  return (
    <div className={'text-center text-white flex flex-col items-center'}>
      <div className='mb-8 text-[40px] md:justify-center relative'>
        <span className={'pl-[10px] bg-black'}>Cryptocurrency based on the game </span>
        <span className={'pr-[20px] bg-black text-regal-yellow relative'}>
          Animal Crossing
          <div className='absolute right-0 bottom-0 w-3 h-11 bg-yellow-500'></div>
        </span>
      </div>

      <div className='text-[20px] md:flex md:justify-center md:flex-col items-center'>
        <div className='inline bg-black px-[5px] mb-[5px]'>
          Mine <span className='bg-black text-yellow-500'>Bells</span> with a special
          <span className='text-regal-blue'> wallet</span>,
          <span className='text-regal-blue'> exchange</span> them for other
        </div>
        <div className='inline bg-black px-[5px]'>
          <span>
            cryptocurrencies and track them with <span className='text-regal-blue'>explorer</span>.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Text;
