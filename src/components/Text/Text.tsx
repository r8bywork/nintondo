const Text = () => {
  return (
    <div className={'text-center text-white flex flex-col items-center'}>
      <div className='mb-8 text-[40px] px-[15px] relative'>
        <span className={'p-[5px] bg-black'}>Cryptocurrency based on the game </span>
        <span className={'p-[5px] bg-black text-regal-yellow'}>Animal Crossing</span>
        {/*<div className='absolute right-0 bottom-0 w-4 h-14 bg-yellow-500'></div>*/}
      </div>

      <div className='text-[20px] items-center flex flex-col'>
        <span className={'bg-black mb-[2px]'}>
          Mine <span className='text-yellow-500'>Bells</span> with a special
          <span className='text-regal-blue'> wallet</span>,
          <span className='text-regal-blue'> exchange</span> them for other
        </span>
        <span className={'bg-black'}>
          cryptocurrencies and track them with <span className='text-regal-blue'>explorer</span>.
        </span>
      </div>
    </div>
  );
};

export default Text;
